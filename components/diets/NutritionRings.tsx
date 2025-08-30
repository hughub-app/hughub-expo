import React from "react";
import Rings from "../charts/Rings";
import { Intake } from "@/types";

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
}: {
  values: Intake;
  target: Intake;
  projection?: Intake;
}) {
  return (
    <Rings
      rings={[
        {
          color: "#22c55e",
          value: vegValue,
          projection: projection?.vegetable,
          goal: vegTarget,
        },
        {
          color: "#3b82f6",
          value: proteinValue,
          projection: projection?.protein,
          goal: proteinTarget,
        },
        {
          color: "#f59e0b",
          value: fruitValue,
          projection: projection?.fruit,
          goal: fruitTarget,
        },
        {
          color: "#ef4444",
          value: grainValue,
          projection: projection?.grain,
          goal: grainTarget,
        },
        {
          color: "#8b5cf6",
          value: dairyValue,
          projection: projection?.dairy,
          goal: dairyTarget,
        },
      ]}
    />
  );
}
