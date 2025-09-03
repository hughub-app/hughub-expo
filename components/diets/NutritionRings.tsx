import React from "react";
import Rings, { RingsProps } from "../charts/Rings";
import { Intakes } from "@/types";

export default function NutritionRings({
  values: {
    vegetable: vegValue,
    protein: proteinValue,
    fruit: fruitValue,
    grain: grainValue,
    dairy: dairyValue,
  },
  target: {
    vegetable: vegTarget,
    protein: proteinTarget,
    fruit: fruitTarget,
    grain: grainTarget,
    dairy: dairyTarget,
  },
  projection,
  disabled = false,
  ...rest
}: {
  values: Intakes;
  target: Intakes;
  projection?: Intakes;
  disabled?: boolean;
} & Omit<RingsProps, "rings">) {
  return (
    <Rings
      {...rest}
      rings={[
        {
          color: disabled ? "#d1d5db" : "#22c55e",
          value: vegValue,
          projection: projection?.vegetable,
          goal: vegTarget,
        },
        {
          color: disabled ? "#d1d5db" : "#3b82f6",
          value: proteinValue,
          projection: projection?.protein,
          goal: proteinTarget,
        },
        {
          color: disabled ? "#d1d5db" : "#f59e0b",
          value: fruitValue,
          projection: projection?.fruit,
          goal: fruitTarget,
        },
        {
          color: disabled ? "#d1d5db" : "#ef4444",
          value: grainValue,
          projection: projection?.grain,
          goal: grainTarget,
        },
        {
          color: disabled ? "#d1d5db" : "#8b5cf6",
          value: dairyValue,
          projection: projection?.dairy,
          goal: dairyTarget,
        },
      ]}
    />
  );
}
