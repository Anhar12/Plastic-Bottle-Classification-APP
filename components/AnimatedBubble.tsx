import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

type BubbleProps = {
  size: number;
  startX?: number;
  startY?: number;
  speed?: number;
};

export default function AnimatedBubble({
  size,
  startX,
  startY,
  speed = 2,
}: BubbleProps) {
  const x = useSharedValue(startX ?? Math.random() * (width - size));
  const y = useSharedValue(startY ?? Math.random() * (height - size));

  const vx = useSharedValue((Math.random() - 0.5) * 4 * speed);
  const vy = useSharedValue((Math.random() - 0.5) * 4 * speed);

  useEffect(() => {
    let frameId: number;

    const update = () => {
      x.value += vx.value;
      y.value += vy.value;

      if (x.value < 0 || x.value > width - size) {
        vx.value *= -1;
        x.value = Math.max(0, Math.min(x.value, width - size));
      }

      if (y.value < 0 || y.value > height - size) {
        vy.value *= -1;
        y.value = Math.max(0, Math.min(y.value, height - size));
      }

      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(frameId);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#7dd3fc",
          shadowOpacity: 0.4,
          shadowRadius: 10,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={["rgba(255,255,255,0.6)", "rgba(125,211,252,0.40)"]}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          padding: size * 0.1,
        }}
      >
      </LinearGradient>
    </Animated.View>
  );
}
