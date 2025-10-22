import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { X, Info } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function InfoModal({ visible, onClose }) {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 justify-center items-center px-6">
      <BlurView intensity={40} tint="dark" className="absolute inset-0" />

      <Animated.View
        entering={SlideInUp.springify().damping(15)}
        exiting={SlideOutUp.springify().damping(15)}
        className="w-full max-w-md rounded-lg overflow-hidden shadow-2xl"
      >
        <LinearGradient
          colors={["#3BC9DB", "#0B79B7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-row justify-between items-center px-5 py-4"
        >
          <View className="flex-row gap-3 items-center">
            <Info size={24} color="white" />
            <Text className="text-white text-lg font-extrabold tracking-wider">
              Panduan Aplikasi
            </Text>
          </View>

          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <X size={22} color="white" />
          </TouchableOpacity>
        </LinearGradient>

        <View className="bg-white p-5">
          <ScrollView className="max-h-96">
            <Text className="text-lg mb-2 font-semibold text-sky-700">
              Cara Penggunaan:
            </Text>
            {[
              "Arahkan kamera ke objek botol plastik dan tekan tombol kamera.",
              "Unggah gambar dari perangkat Anda.",
              "Tunggu beberapa saat dan hasil klasifikasi akan muncul di layar.",
              "Anda dapat mengubah jumlah kuantiti ataupun menghapusnya menggunakan tombol yang tersedia."
            ].map((item, idx) => (
              <View key={idx} className="flex-row gap-2 mb-2">
                <Text className="text-sky-700 font-bold">{idx + 1}.</Text>
                <Text className="text-gray-700 flex-1">{item}</Text>
              </View>
            ))}

            <Text className="text-lg mt-3 mb-2 font-semibold text-sky-700">
              Saran Penggunaan:
            </Text>
            {[
              "Pastikan botol masih dalam keadaan layak dan kosong.",
              "Posisikan botol sekitar 40 cm dari kamera.",
              "Pastikan pencahayaan cukup.",
              "Hindari objek lain yang dapat mengganggu objek botol."
            ].map((item, idx) => (
              <View key={idx} className="flex-row gap-2 mb-2">
                <Text className="text-sky-700">•</Text>
                <Text className="text-gray-700 flex-1">{item}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Tombol OK */}
          <TouchableOpacity onPress={onClose} className="mt-6">
            <LinearGradient
              colors={["#3BC9DB", "#0B79B7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-full py-3"
            >
              <Text className="text-white text-center font-extrabold text-lg tracking-wide">
                OK, Mengerti
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
