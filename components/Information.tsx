import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

export default function PanduanPopup({ onClose }) {
  // shared values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    // animasi muncul
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withTiming(1, { duration: 300 });
  }, []);

  // style animasi
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View className="w-full h-full bg-black/50 justify-center items-center px-6 absolute top-0 left-0">
      <Animated.View
        style={animatedStyle}
        className="bg-white w-full max-w-md p-4 rounded-lg"
      >
        <Text className="text-xl font-bold text-sky-700 mb-3 text-center">
          Panduan
        </Text>

        <ScrollView className="px-4">
          <Text className="text-lg font-semibold text-sky-700">
            Cara Penggunaan:
          </Text>
          <View className="space-y-2 mb-4">
            <View className="flex-row gap-2">
              <Text className="text-gray-700">1. </Text>
              <Text className="text-gray-700">
                Arahkan kamera ke objek botol plastik dan tekan tombol kamera.
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Text className="text-gray-700">2. </Text>
              <Text className="text-gray-700">
                Unggah gambar dari perangkat Anda.
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Text className="text-gray-700">3. </Text>
              <Text className="text-gray-700">
                Tunggu beberapa saat dan hasil klasifikasi akan muncul di layar.
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Text className="text-gray-700">4. </Text>
              <Text className="text-gray-700">
                Anda dapat mengubah jumlah kuantiti ataupun menghapusnya
                menggunakan tombol yang tersedia.
              </Text>
            </View>
          </View>

          <Text className="text-lg font-semibold text-sky-700">
            Saran Penggunaan:
          </Text>
          <View className="space-y-2 mb-3">
            <View className="flex-row gap-2">
              <Text className="text-gray-700">•</Text>
              <Text className="text-gray-700">
                Pastikan botol masih dalam keadaan layak dan kosong.
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Text className="text-gray-700">•</Text>
              <Text className="text-gray-700">
                Posisikan botol sekitar 40 cm dari kamera.
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Text className="text-gray-700">•</Text>
              <Text className="text-gray-700">Pastikan pencahayaan cukup.</Text>
            </View>
            <View className="flex-row gap-2">
              <Text className="text-gray-700">•</Text>
              <Text className="text-gray-700">
                Hindari objek lain yang mengganggu objek botol.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View className="flex-row justify-end">
          <TouchableOpacity
            onPress={() => {
              // animasi keluar sebelum close
              opacity.value = withTiming(0, { duration: 200 });
              scale.value = withTiming(0.8, { duration: 200 }, () => {
                onClose?.();
              });
            }}
          >
            <Text className="text-center text-sky-700 font-bold text-lg px-6">
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
