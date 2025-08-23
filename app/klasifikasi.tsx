import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Klasifikasi() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-xl font-bold mb-6">Halaman Klasifikasi</Text>
      <TouchableOpacity
        onPress={() => router.back()}
        className="bg-green-500 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Kembali</Text>
      </TouchableOpacity>
    </View>
  );
}
