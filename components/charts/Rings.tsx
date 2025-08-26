import React, { useEffect } from "react";
import { View } from "react-native";
import Svg, { G, Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";

type Ring = {
  progress?: number;
  value?: number;
  goal?: number;
  color: string;
  thickness?: number;
};

type Props = {
  size?: number;
  thickness?: number;
  gap?: number;
  durationMs?: number;
  rotateStartDeg?: number;
  rings: Ring[];
  trackOpacity?: number;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function Rings({
  size = 240,
  thickness = 22,
  gap = 8,
  durationMs = 900,
  rotateStartDeg = -90,
  rings,
  trackOpacity = 0.15,
}: Props) {
  const cx = size / 2;
  const cy = size / 2;

  const outerEdge = size / 2;
  const radii = rings.map((_, i) => {
    const t = rings[i].thickness ?? thickness;
    const before = rings
      .slice(0, i)
      .reduce((acc, r) => acc + (r.thickness ?? thickness) + gap, 0);
    return outerEdge - before - t / 2;
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <G originX={cx} originY={cy} rotation={rotateStartDeg}>
          {rings.map((ring, i) => {
            const r = radii[i];
            const t = ring.thickness ?? thickness;
            const C = 2 * Math.PI * r;

            const p =
              typeof ring.progress === "number"
                ? Math.max(0, Math.min(1, ring.progress))
                : Math.max(
                    0,
                    Math.min(
                      1,
                      (ring.value ?? 0) /
                        (ring.goal && ring.goal > 0 ? ring.goal : 1)
                    )
                  );

            const targetOffset = C * (1 - p);
            const dashOffset = useSharedValue(C);

            useEffect(() => {
              dashOffset.value = withTiming(targetOffset, {
                duration: durationMs,
                easing: Easing.out(Easing.cubic),
              });
            }, [targetOffset]);

            const animatedProps = useAnimatedProps(() => ({
              strokeDashoffset: dashOffset.value,
            }));

            const shadowProps = {
              cx,
              cy,
              r,
              stroke: "rgba(0,0,0,0.18)",
              strokeWidth: t,
              strokeLinecap: "round" as const,
              strokeDasharray: [C, C],
              strokeDashoffset: C * 0.02,
              fill: "none" as const,
            };

            return (
              <G key={i}>
                <Circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  stroke={ring.color}
                  strokeOpacity={trackOpacity}
                  strokeWidth={t}
                  fill="none"
                />

                <Circle {...shadowProps} />

                <AnimatedCircle
                  cx={cx}
                  cy={cy}
                  r={r}
                  stroke={ring.color}
                  strokeWidth={t}
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={[C, C]}
                  animatedProps={animatedProps}
                />
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
}