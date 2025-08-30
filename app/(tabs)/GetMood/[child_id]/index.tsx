import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Emoji from "@/components/emoji";
import { Input } from "@/components/ui/input";
import BackButton from "@/components/BackButton";
import PageContainer from "@/components/PageContainer";
import { PageHead } from "@/components/PageHead";
import { mockChildren } from "@/mocks/mockChildren";

const GetMoodPage = () => {
  const router = useRouter();
  const { child_id } = useLocalSearchParams();

  const child = mockChildren.find((c) => c.child_id === Number(child_id));

  const [selectedEmotion, setSelectedEmotion] = useState<
    "laugh" | "smile" | "meh" | "frown" | "angry" | null
  >(null);
  const [thoughts, setThoughts] = useState<string>("");

  const emotions: Array<"laugh" | "smile" | "meh" | "frown" | "angry"> = [
    "angry",
    "frown",
    "meh",
    "smile",
    "laugh",
  ];

  const handleEmojiSelect = (
    emotion: "laugh" | "smile" | "meh" | "frown" | "angry"
  ) => {
    setSelectedEmotion(emotion);
  };

  const handleSave = () => {
    // Record the thoughts and selected emotion locally
    console.log("Saved emotion:", selectedEmotion);
    console.log("Saved thoughts:", thoughts);
    // You can replace these console logs with actual state saving logic
  };

  const handleCardChange = () => {
    // Logic to change card content
    console.log("Card content changed");
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
              Change Card
            </Button>
          </View>

          <Card>
            <CardHeader>
              <CardTitle>Communication Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <Text>
                {/* Fetch and display communication tips from backend here */}
              </Text>
            </CardContent>
          </Card>

          <Text className="text-2xl font-semibold text-gray-900 mt-8">
            How do you think Maya's been feeling?
          </Text>
          <View className="flex-row justify-center mt-5">
            {emotions.map((emotion) => (
              <Button
                key={emotion}
                onPress={() => handleEmojiSelect(emotion)}
                className={`ml-1 p-6 justify-center items-center w-20 h-20${
                  selectedEmotion === emotion ? "border border-blue-500" : ""
                }`}
                variant="outline"
              >
                <Emoji type={emotion} className="flex-grow" size={50} />
              </Button>
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

          <Button className="mt-10 text-white" onPress={handleSave}>
            Save
          </Button>
        </PageContainer>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GetMoodPage;
