import React, { useMemo, useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Emoji, { EmojiType } from "@/components/emoji";
import { useMoodStore } from "@/hooks/useMoodStore";
import { Input } from "@/components/ui/input";
import BackButton from "@/components/BackButton";
import PageContainer from "@/components/PageContainer";
import { PageHead } from "@/components/PageHead";
import { mockChildren } from "@/mocks/mockChildren";
import { Toast } from "toastify-react-native";
import { logMood } from "@/lib/api/endpoints/moodLogs";

const GetMoodPage = () => {
  const router = useRouter();
  const { child_id } = useLocalSearchParams();

  const child = mockChildren.find((c) => c.child_id === Number(child_id));

  const [selectedEmotion, setSelectedEmotion] = useState<EmojiType | null>(null);
  const setCurrentEmoji = useMoodStore((s) => s.setCurrentEmoji);
  const [thoughts, setThoughts] = useState<string>("");
  const [tipIndex, setTipIndex] = useState<number>(0);

  const tips = useMemo(
    () => [
      {
        title: "Communication Tips",
        content:
          "Ask open-ended questions like 'What made you feel that way today?' and listen without interrupting.",
      },
      {
        title: "Active Listening",
        content:
          "Reflect back what you heard: 'It sounds like recess was tough today.' Validate feelings before problem-solving.",
      },
      {
        title: "Name The Emotion",
        content:
          "Help label emotions: 'Are you feeling frustrated or maybe disappointed?' Naming helps kids process feelings.",
      },
      {
        title: "Co-Regulation",
        content:
          "Model calm breathing together for 30 seconds before talking. Calm bodies help calm minds.",
      },
    ],
    []
  );

  const emotions: Array<EmojiType> = [
    "angry",
    "frown",
    "meh",
    "smile",
    "laugh",
  ];

  const handleEmojiSelect = (emotion: EmojiType) => {
    setSelectedEmotion(emotion);
    setCurrentEmoji(emotion);
  };

  const mapEmojiToMood = (e: EmojiType | null): string | null => {
    if (!e) return null;
    switch (e) {
      case "laugh":
        return "laugh"; // align with backend enum
      case "smile":
        return "happy";
      case "frown":
        return "sad";
      case "meh":
        return "neutral";
      case "angry":
        return "angry";
      default:
        return null;
    }
  };

  const handleSave = async () => {
    const idNum = Number(child_id);
    const mood = mapEmojiToMood(selectedEmotion);
    if (!Number.isFinite(idNum)) {
      Toast.error("Invalid child id");
      return;
    }
    if (!mood) {
      Toast.error("Please select an emotion");
      return;
    }
    try {
      const res = await logMood({ childId: idNum, mood, notes: thoughts || undefined });
      if (!res.ok) {
        Toast.error(`Failed (${res.status})`);
        return;
      }
      Toast.success("Mood saved");
      router.replace({ pathname: "/child/[child_id]", params: { child_id: String(child_id) } });
    } catch (e) {
      console.error(e);
      Toast.error("Network error");
    }
  };

  const handleCardChange = () => {
    setTipIndex((prev) => (prev + 1) % tips.length);
  };

  return (
    <SafeAreaView>
      <PageHead title={`Log Mood for ${child?.name}`} description={`Log ${child?.name}'s mood and thoughts`} />
      <ScrollView>
        <PageContainer>
          <BackButton fallbackUrl={`/(tabs)/child/${child_id}/index`} />
          <View className="flex-row justify-between align-middle m-3">
            <Text className="text-xl">Taking Care</Text>
            <Button
              className="text-white bg-gray-700"
              onPress={handleCardChange}
            >
              <Text>Change Card</Text>
            </Button>
          </View>

          <Card>
            <CardHeader>
              <CardTitle>{tips[tipIndex].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Text>{tips[tipIndex].content}</Text>
            </CardContent>
          </Card>

          <Text className="text-2xl font-semibold text-gray-900 mt-8">
            How do you think Maya's been feeling?
          </Text>
          <View className="flex-row justify-center mt-5">
            {emotions.map((emotion) => (
              <Pressable
                key={emotion}
                accessibilityRole="button"
                onPress={() => handleEmojiSelect(emotion)}
              >
                <Card
                  className={`mx-1 justify-center items-center w-24 h-24 rounded-xl ${
                    selectedEmotion === emotion
                      ? "border border-blue-500 shadow-lg shadow-blue-300/50"
                      : "border border-transparent shadow-none"
                  }`}
                >
                  <CardContent className="p-0 mt-6 items-center justify-center">
                    <Emoji type={emotion} size={64} className="justify-center" />
                  </CardContent>
                </Card>
              </Pressable>
            ))}
          </View>

          <Text className="text-2xl font-semibold text-gray-900 mt-8">
            Do you have any thoughts?
          </Text>
          <Input
            value={thoughts}
            onChangeText={setThoughts}
            placeholder="Your thoughts here..."
            className="mt-3 p-8 justify-center h-auto"
          />

          <Button className="mt-10 mb-10 text-white" onPress={handleSave}>
            <Text>Save</Text>
          </Button>
        </PageContainer>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GetMoodPage;
