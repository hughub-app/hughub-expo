import { View, Text } from "react-native";
import React from "react";
import Rings from "../charts/Rings";

export default function NutritionRings({
    values: {
        veggies: veggiesValue,
        protein: proteinValue,
        fruits: fruitsValue,
        grains: grainsValue,
        dairy: dairyValue
    },
    target: {
        veggies: veggiesTarget,
        protein: proteinTarget,
        fruits: fruitsTarget,
        grains: grainsTarget,
        dairy: dairyTarget
    }
}: {
  values: {
    veggies: number;
    protein: number;
    fruits: number;
    grains: number;
    dairy: number;
  };
  target: {
    veggies: number;
    protein: number;
    fruits: number;
    grains: number;
    dairy: number;
  }
}) {
  return (
    <Rings
      rings={[
        { color: "#22c55e", value: veggiesValue, goal: veggiesTarget },
        { color: "#3b82f6", value: proteinValue, goal: proteinTarget },
        { color: "#f59e0b", value: fruitsValue, goal: fruitsTarget },
        { color: "#ef4444", value: grainsValue, goal: grainsTarget },
        { color: "#8b5cf6", value: dairyValue, goal: dairyTarget },
      ]}
    />
  );
}
