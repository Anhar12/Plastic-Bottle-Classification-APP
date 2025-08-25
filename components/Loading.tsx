import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { MotiView } from "moti";

export default function Loading() {
  return (
    <View className="absolute inset-0 bg-slate-900/70 items-center justify-center">
      <MotiView
        from={{ scale: 0.8, opacity: 0.5 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{
          loop: true,
          type: "timing",
          duration: 1000,
        }}
        className="rounded-full bg-sky-200/40 items-center justify-center p-2"
      >
        <ActivityIndicator size="large" color="#fff" />
      </MotiView>
    </View>
  );
}
