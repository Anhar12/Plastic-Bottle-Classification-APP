import { View, Text, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AnimatedBubble from "@/components/AnimatedBubble";

export default function LandingPage() {
  return (
    <>
      <StatusBar style="dark" translucent />
      <View
        className="flex-1 relative bg-sky-200/30"
      >
        {/* Dekorasi bubble */}
        <AnimatedBubble
          size={140}
          startX={50}
          startY={100}
          speed={3}
        />

        <AnimatedBubble
          size={120}
          startX={200}
          startY={300}
          speed={3}
        />

        <AnimatedBubble
          size={120}
          startX={100}
          startY={500}
          speed={3}
        />

        <AnimatedBubble
          size={140}
          startX={300}
          startY={150}
          speed={3}
        />

        <View className="px-6 pt-16">
          <View className="flex-row items-center gap-2">
            <Ionicons name="water" size={18} color="#0B79B7" />
            <Text className="text-sky-700 font-semibold">Plastic Bottle Classification</Text>
          </View>
        </View>

        {/* Hero */}
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-56 h-56 bg-sky-600/30 items-center justify-center rounded-full overflow-hidden">
            <Image
              source={require("@/assets/images/logo.jpeg")}
              className="w-52 h-52 rounded-full"
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <View className="mt-8 items-center">
            <Text className="text-3xl font-extrabold text-sky-800 text-center">
              Sistem Klasifikasi
            </Text>
            <Text className="text-lg font-semibold text-sky-600 mt-1 text-center">
              Sampah Botol Plastik
            </Text>
          </View>

          {/* Tombol START */}
          <Link href="/klasifikasi" asChild>
            <TouchableOpacity activeOpacity={0.7} className="mt-10">
              <View className="shadow-lg shadow-cyan-500/30 overflow-hidden">
                <LinearGradient
                  colors={["#3BC9DB", "#0B79B7"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="px-20 py-5"
                >
                  <Text className="text-white font-extrabold text-xl tracking-[0.2em] text-center">
                    START
                  </Text>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </Link>

        </View>

        {/* Footer */}
        <View className="pb-8 items-center">
          <Text className="text-sky-400 text-sm">© 2025 • Anhar Khoirun Najib. All Right Reserved.</Text>
        </View>
      </View>
    </>
  );
}
