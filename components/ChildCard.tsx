import { View } from "react-native";
import React from "react";
import { Text } from "./ui/text";
import { Child } from "@/lib/api/endpoints/children";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { getAge } from "@/lib/utils";
import { ChildAvatar } from "./ChildAvatar";

export default function ChildCard({ child }: { child: Child }) {
  const age = getAge(new Date(child.date_of_birth));
  return (
    <Card>
      <CardHeader>
        <View className="justify-between items-center` flex-row">
            <View className="flex-row gap-2 items-center">
              <ChildAvatar />
          <Text className="font-bold">{child.name}</Text>
            </View>
          <Text>{age} years old</Text>
        </View>
      </CardHeader>
      <CardContent>
        <View className="flex-row gap-4">
          <Card className="p-4 items-center flex-1">
            <Text className="!text-5xl mb-2">🥺</Text>
            <Text>Last Mood</Text>
          </Card>
          <Card className="p-4 items-center flex-1">
            <View className="flex-row gap-2 items-center">
              <Text className="!text-5xl mb-2">🥺</Text>
              <Text>40%</Text>
            </View>
            <Text className="text-center">Weekly Average Mood</Text>
          </Card>
        </View>
      </CardContent>
    </Card>
  );
}
