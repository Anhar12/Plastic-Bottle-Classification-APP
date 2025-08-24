import React, { useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, Animated, PanResponder, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

const dummyData = [
  { id: "1", name: "lorem ipsum dolor", size: "600ml", qty: 1, weight: 16 },
  { id: "2", name: "lorem ipsum dolor", size: "1500ml", qty: 2, weight: 60 },
  { id: "3", name: "lorem ipsum dolor", size: "600ml", qty: 2, weight: 36 },
];

export default function KlasifikasiScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [data, setData] = useState(dummyData);

  const screenHeight = Dimensions.get("window").height;
  const panY = useRef(new Animated.Value(screenHeight * 0.75)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        let newY = gestureState.dy + panY._value;
        if (newY < 0) newY = 0;
        if (newY > screenHeight * 0.75) newY = screenHeight * 0.75;
        panY.setValue(newY);
      },
      onPanResponderRelease: (_, gestureState) => {
        Animated.spring(panY, {
          toValue: gestureState.dy < 0 ? 0 : screenHeight * 0.75,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const toggleCameraType = () => setFacing((current) => (current === "back" ? "front" : "back"));

  const takePicture = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 1, skipProcessing: true });
      if (photo?.uri) {
        Alert.alert("📸 Foto diambil!", photo.uri);
      }
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Gagal mengambil foto");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: false, quality: 1 });
    if (!result.canceled) Alert.alert("Gambar dipilih!", result.assets[0].uri);
  };

  if (!permission) return <View className="flex-1 bg-white" />;
  if (!permission.granted)
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="mb-3">We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} className="px-4 py-2 bg-blue-500 rounded-lg">
          <Text className="text-white">Grant permission</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View className="flex-1 relative">
      {/* Kamera */}
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />

      {/* Swipe-Up List */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          top: panY,
          height: screenHeight
        }}
        className="bg-sky-100 absolute left-0 right-0 rounded-t-2xl p-6"
      >
        <View className="w-[40px] h-[5px] rounded-xl self-center mt-1 mb-6 bg-sky-700" />
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex-row justify-between mb-3">
              <Text className="flex-1">{item.name}</Text>
              <Text className="w-[20%] text-right">{item.size}</Text>
              <Text className="w-[15%] text-right">x {item.qty}</Text>
              <Text className="w-[15%] text-right">{item.weight.toString() + 'g'}</Text>
            </View>
          )}
        />
      </Animated.View>

      <View className="flex-row justify-around items-center p-4 bg-white border-t border-slate-400">
        <TouchableOpacity
          onPress={pickImage}
          activeOpacity={0.7}
          className="w-14 h-14 items-center justify-center"
        >
          <Ionicons name="image-outline" size={28} color="green" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={takePicture}
          activeOpacity={0.7}
          className="w-16 h-16 rounded-full bg-sky-700 items-center justify-center"
        >
          <Ionicons name="camera" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="w-14 h-14 items-center justify-center"
        >
          <Ionicons name="exit-outline" size={28} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
