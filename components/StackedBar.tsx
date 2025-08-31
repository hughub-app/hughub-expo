// components/StackedBar.tsx
import React, { useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export type StackedSegment = {
  value: number;
  colorClass: string; // e.g. "bg-[#22c55e]"
  label?: string;
};

export interface StackedBarProps {
  segments: StackedSegment[];
  total?: number;
  heightPx?: number;
  radiusPx?: number;
  gapPx?: number;
  trackClass?: string;
  className?: string;
  formatTooltip?: (seg: StackedSegment, frac: number) => React.ReactNode;
  tooltipSide?: "top" | "bottom" | "left" | "right";
  tooltipPortalHost?: string;
}

const StackedBar: React.FC<StackedBarProps> = ({
  segments,
  total,
  heightPx = 12,
  radiusPx = 6,
  trackClass = "bg-gray-200",
  className = "",
  formatTooltip,
  tooltipSide = "top",
  tooltipPortalHost,
}) => {
  const sum = useMemo(
    () =>
      total && total > 0
        ? total
        : Math.max(
            1,
            segments.reduce((a, s) => a + s.value, 0)
          ),
    [segments, total]
  );

  const defaultFormat = (seg: StackedSegment, frac: number) => (
    <Text>
      {(seg.label ?? "Segment") +
        " — " +
        Math.round(frac * 100) +
        "% (" +
        seg.value +
        ")"}
    </Text>
  );

  return (
    <View
      className={[
        `relative overflow-hidden ${trackClass} h-[${heightPx}px] rounded-[${radiusPx}px]`,
        className,
      ].join(" ")}
      accessibilityRole="progressbar"
    >
      <View className="absolute inset-0 flex-row items-stretch">
        {segments.map((seg, idx) => {
          const frac = Math.max(0, seg.value / sum);
          const pct = frac * 100;

          return (
            <Tooltip key={`tooltip-${idx}`} style={{ width: `${pct}%` }} delayDuration={100}>
              <TooltipTrigger className={`w-full h-full ${seg.colorClass}`} accessibilityLabel={seg.label ?? `segment ${idx + 1}`}/>

              <TooltipContent side={tooltipSide} portalHost={tooltipPortalHost}>
                <Text className="text-white">
                    {formatTooltip
                    ? formatTooltip(seg, frac)
                    : defaultFormat(seg, frac)}
                </Text>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </View>
    </View>
  );
};

export default StackedBar;
