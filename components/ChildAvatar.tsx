import React, { useMemo } from "react";
import { Image, View, StyleSheet } from "react-native";

// A small set of random cartoon avatar URLs
const cartoonAvatars = [
  "https://api.dicebear.com/8.x/bottts/svg?seed=child1",
  "https://api.dicebear.com/8.x/bottts/svg?seed=child2",
  "https://api.dicebear.com/8.x/bottts/svg?seed=child3",
  "https://api.dicebear.com/8.x/bottts/svg?seed=child4",
  "https://api.dicebear.com/8.x/bottts/svg?seed=child5",
];

interface ChildAvatarProps {
  url?: string;
  size?: number;
  borderRadius?: number;
}

export const ChildAvatar: React.FC<ChildAvatarProps> = ({
  url,
  size = 42,
  borderRadius,
}) => {
  // If no url, pick a random cartoon avatar once
  const fallbackUrl = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * cartoonAvatars.length);
    return cartoonAvatars[randomIndex];
  }, []);

  const source = { uri: url || fallbackUrl };

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: borderRadius ?? size / 2, // default circular
        },
      ]}
    >
      <Image
        source={source}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: borderRadius ?? size / 2,
        }}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: "#eee",
  },
});