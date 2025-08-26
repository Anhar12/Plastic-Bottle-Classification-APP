import React, { useRef, useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, Animated, PanResponder, Dimensions, Image, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, CameraType, useCameraPermissions, FlashMode } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import Loading from "@/components/Loading";
import Information from "@/components/Information";

export default function KlasifikasiScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("on");
  const [permission, requestPermission] = useCameraPermissions();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [pictureSize, setPictureSize] = useState(null);

  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const panY = useRef(new Animated.Value(screenHeight * 0.71)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
      onPanResponderMove: (_, gestureState) => {
        let newY = gestureState.dy + panY._value;
        if (newY < screenHeight * 0.3) newY = screenHeight * 0.3;
        if (newY > screenHeight * 0.71) newY = screenHeight * 0.71;
        panY.setValue(newY);
      },
      onPanResponderRelease: (_, gestureState) => {
        Animated.spring(panY, {
          toValue: gestureState.dy < 0 ? screenHeight * 0.3 : screenHeight * 0.71,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const onCameraReady = async () => {
    if (cameraRef.current) {
      const sizes = await cameraRef.current.getAvailablePictureSizesAsync();
      if (sizes.length > 0) {
        setPictureSize(sizes[0]);
        console.log(pictureSize);
      }
    }
  };

  const toggleCameraType = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"));
  };

  const uploadPhoto = async (uri: string, fileName?: string) => {
    try {
      const uriParts = uri.split(".");
      const ext = uriParts[uriParts.length - 1];
      const mimeType = ext === "png" ? "image/png" : "image/jpeg";
      const name = fileName ?? `photo.${ext}`;

      const formData = new FormData();
      formData.append("file", {
        uri,
        type: mimeType,
        name,
      } as any);

      const response = await fetch(
        "https://plastic-bottle-classification-production.up.railway.app/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Gagal memproses gambar");
      }

      const result = await response.json();
      Alert.alert("Hasil Klasifikasi", `${result.brand} ${result.size} ${result.weight}g`);

      setData((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === result.code);

        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            qty: updated[existingIndex].qty + 1,
            weight: updated[existingIndex].weight + result.weight,
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              id: result.code,
              name: result.brand,
              size: result.size,
              qty: 1,
              weight: result.weight,
            },
          ];
        }
      });
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Gagal mengupload foto");
    } finally {
      setLoading(false);
    }
  };

  const takePicture = async () => {
    try {
      setLoading(true);
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 1,
        skipProcessing: false,
      });
      if (!photo?.uri) throw new Error("Gagal mengambil foto");
      await uploadPhoto(photo.uri, photo.fileName);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      setLoading(true);
      await uploadPhoto(result.assets[0].uri, result.assets[0].fileName);
    }
  };

  const clearAll = () => {
    Alert.alert(
      "Konfirmasi",
      "Apakah Anda yakin ingin menghapus semua data?",
      [
        { text: "Batal", style: "cancel" },
        { text: "Hapus", style: "destructive", onPress: () => { setLoading(true); setData([]); } }
      ]
    );
  };

  const addCount = (id: string) => {
    setData((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === id);

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          weight: updated[existingIndex].weight + updated[existingIndex].weight / updated[existingIndex].qty,
          qty: updated[existingIndex].qty + 1,
        };
        return updated;
      }
    });
  };

  const removeCount = (id: string) => {
    setData((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === id);

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          weight: updated[existingIndex].weight - updated[existingIndex].weight / updated[existingIndex].qty,
          qty: updated[existingIndex].qty - 1,
        };
        if (updated[existingIndex].qty === 0) {
          updated.splice(existingIndex, 1);
        }
        return updated;
      }
    });
  };

  const removeItem = (id: string) => {
    setData((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === id);

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated.splice(existingIndex, 1);
        return updated;
      }
    });
  };

  useEffect(() => {
    if (data.length === 0) {
      setLoading(false);
    }
  }, [data]);

  if (!permission) return <Loading />;
  if (!permission.granted)
    requestPermission();

  return (
    <>
      <View className="flex-1 relative">
        <CameraView
          ref={cameraRef}
          style={{ width: screenWidth, height: screenHeight * 0.71 }}
          facing={facing}
          ratio="4:3"
          flash={flash}
          pictureSize={pictureSize}
          onCameraReady={onCameraReady}
        />

        <View className="flex-row justify-between items-center p-2 absolute top-0 left-0 right-0 bg-transparent">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="w-14 h-14 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={28} color="#00598a" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setInfoVisible(true)}
            className="w-14 h-14 items-center justify-center"
          >
            <Ionicons name="information-circle" size={28} color="#00598a" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleFlash}
            activeOpacity={0.7}
            className="w-14 h-14 items-center justify-center"
          >
            <Ionicons name={flash === "off" ? "flash-off" : "flash"} size={24} color="#00598a" />
          </TouchableOpacity>
        </View>

        <Animated.View
          {...panResponder.panHandlers}
          style={{
            top: panY,
            height: screenHeight
          }}
          className="bg-white absolute left-0 right-0 rounded-t-2xl p-6"
        >
          <View className="w-[40px] h-[5px] rounded-xl self-center mt-1 mb-6 bg-slate-400" />
          {data.length > 0 && (
            <TouchableOpacity
              onPress={clearAll}
              className="absolute right-6 top-4 flex-row gap-1 items-center"
            >
              <Text className="text-red-500">Clear</Text>
              <Ionicons name="trash" size={22} color="#ff6467" />
            </TouchableOpacity>
          )}
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={() => (
              <View className="items-center justify-center">
                <Text className="text-sky-800/30">Belum ada hasil klasifikasi</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View className="flex-row justify-between mb-3 items-center">
                <Text className="text-sky-800">{item.name}</Text>
                <Text className="text-sky-800 text-right">{item.size}</Text>
                <View className="text-left flex-row gap-2 items-center">
                  <TouchableOpacity
                    onPress={() => removeCount(item.id)}
                  >
                    <Ionicons name="remove-circle" size={22} color="#00598a" />
                  </TouchableOpacity>

                  <Text className="text-sky-800 text-center w-[30px]">{item.qty}</Text>

                  <TouchableOpacity
                    onPress={() => addCount(item.id)}
                  >
                    <Ionicons name="add-circle" size={22} color="#00598a" />
                  </TouchableOpacity>
                </View>
                <Text className="text-sky-800 text-right">{item.weight.toString() + 'g'}</Text>
                <TouchableOpacity
                  onPress={() => removeItem(item.id)}
                >
                  <Ionicons name="backspace" size={22} color="#ff6467" />
                </TouchableOpacity>
              </View>
            )}
            ListFooterComponent={() => {
              if (data.length === 0) return null;

              const totalWeight = data.reduce((sum, item) => sum + item.weight, 0);
              return (
                <View className="flex-row gap-3 justify-center mt-1">
                  <Text className="font-bold text-sky-800">Total Berat:</Text>
                  <Text className="text-right font-bold text-sky-800">{totalWeight}g</Text>
                </View>
              );
            }}
          />
        </Animated.View>

        <View className="absolute left-0 bottom-0 w-full flex-row justify-around items-center p-4 bg-white border-t border-slate-400">
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.7}
            className="w-14 h-14 items-center justify-center"
          >
            <Ionicons name="image-outline" size={28} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={takePicture}
            activeOpacity={0.7}
            className="w-16 h-16 rounded-full bg-sky-700 items-center justify-center"
          >
            <Ionicons name="camera" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleCameraType}
            activeOpacity={0.7}
            className="w-14 h-14 items-center justify-center"
          >
            <Ionicons name="camera-reverse" size={28} color="gray" />
          </TouchableOpacity>
        </View>

        {loading && <Loading />}

        {infoVisible && (
          <Information onClose={() => setInfoVisible(false)} />
        )}
      </View>
    </>
  );
}
