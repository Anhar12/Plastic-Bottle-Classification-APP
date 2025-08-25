import React from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";

export default function Information({ visible, onClose }) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white w-full max-w-md p-6">
          <Text className="text-xl font-bold text-sky-700 mb-3">
            Panduan Penggunaan
          </Text>

          <ScrollView className="mb-4">
            <View className="space-y-2">
              <View className="flex-row gap-2">
                <Text className="text-gray-700">•</Text>
                <Text className="text-gray-700">Arahkan kamera ke objek botol plastik.</Text>
              </View>
              <View className="flex-row gap-2">
                <Text className="text-gray-700">•</Text>
                <Text className="text-gray-700">Atau unggah gambar dari perangkat Anda.</Text>
              </View>
              <View className="flex-row gap-2">
                <Text className="text-gray-700">•</Text>
                <Text className="text-gray-700">Pastikan botol masih dalam keadaan layak.</Text>
              </View>
              <View className="flex-row gap-2">
                <Text className="text-gray-700">•</Text>
                <Text className="text-gray-700">Posisikan botol sekitar 30 cm dari kamera.</Text>
              </View>
              <View className="flex-row gap-2">
                <Text className="text-gray-700">•</Text>
                <Text className="text-gray-700">Pastikan pencahayaan cukup.</Text>
              </View>
              <View className="flex-row gap-2">
                <Text className="text-gray-700">•</Text>
                <Text className="text-gray-700">Hindari objek lain yang mengganggu tampilan.</Text>
              </View>
            </View>
          </ScrollView>

          <View className="flex-row justify-end">
            <TouchableOpacity
              onPress={onClose}
            >
              <Text className="text-center text-sky-700 font-bold text-lg">Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}