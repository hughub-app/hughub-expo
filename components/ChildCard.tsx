import { View } from "react-native";
import React from "react";
import { Text } from "./ui/text";
import { Child } from "@/lib/api/endpoints/children";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { getAge } from "@/lib/utils";
import { ChildAvatar } from "./ChildAvatar";
import { Calendar } from "lucide-react-native";

export default function ChildCard({ child }: { child: Child }) {
  const age = getAge(new Date(child.date_of_birth));
  return (
    <Card className="w-full">
      <CardHeader>
        <View className="">
          <View className="flex-row gap-4 items-center">
            <ChildAvatar />
            <View>
              <Text className="font-bold">{child.name}</Text>
              <Text>{age} years old</Text>
            </View>
          </View>
        </View>
      </CardHeader>
      <CardContent>
        <View className="flex-row gap-4">
          <Card className="p-4 items-center flex-1 justify-center">
            <Text className="!text-5xl mb-2">🥺</Text>
            <Text>Last Mood</Text>
          </Card>
          <Card className="p-4 items-center flex-1 justify-center">
            <View className="flex-row gap-2 items-center">
              <Text className="!text-5xl mb-2">🥺</Text>
              <Text>40%</Text>
            </View>
            <Text className="text-center">Weekly Average Mood</Text>
          </Card>
        </View>
        <View className="flex-row gap-2 !text-slate-400 items-center mt-4">
          <Calendar size={18} />
          <Text className="!text-slate-400 text-sm">
            Last updated 45 Augusts 1978
          </Text>
        </View>
      </CardContent>
    </Card>
  );
}
