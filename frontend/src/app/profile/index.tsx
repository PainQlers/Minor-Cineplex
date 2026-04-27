import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import InputField from "@/components/profile/InputField";
import MenuBar from "@/components/profile/MenuBar";
import { getProfileById, uploadProfilePicture } from "@/services/profile.service";
import { useLocalSearchParams } from "expo-router";
import { Profiles } from "@/types/profile";
import * as ImagePicker from 'expo-image-picker';

export default function Profile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<Profiles | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const handleSave = async () => {
    // If there's a preview image selected, upload it on save
    if (previewUri && id) {
      try {
        setUploading(true);
        const newUrl = await uploadProfilePicture(id, {
          uri: previewUri,
          type: 'image/jpeg',
          name: `profile_${id}.jpg`
        });

        if (newUrl) {
          setProfile(prev => prev ? { ...prev, pic_url: newUrl } : null);
          setPreviewUri(null);
        }
      } catch (err) {
        console.error('Upload on save error:', err);
        Alert.alert('Error', 'ไม่สามารถอัปโหลดรูปภาพได้');
      } finally {
        setUploading(false);
      }
    }

    // Other save logic (e.g., name/email) can be added here
    console.log("Saved:", { name, email });
  };

  const handleImagePick = async () => {
    // ขออนุญาตเข้าถึงคลังรูปภาพ
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "ต้องการสิทธิ์การเข้าถึงรูปภาพเพื่อเปลี่ยนโปรไฟล์");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, // ลดขนาดไฟล์ลงหน่อยเพื่อความเร็ว
    });

    if (!result.canceled && result.assets[0]) {
      const imageAsset = result.assets[0];
      // ตั้ง previewUri ให้แสดงภาพก่อนกด Save (ยังไม่อัปโหลด)
      setPreviewUri(imageAsset.uri);
      // ให้ UI ใช้ previewUri เสียก่อน — profile.pic_url ยังคงเป็นค่าจาก backend
      setProfile(prev => prev ? { ...prev } : prev);
    }
  };

  useEffect(() => {
          const loadProfile = async () => {
              try {
                  setLoading(true);
                  setError("");
  
                  const data = await getProfileById();
                  setProfile(data);
                  console.log(profile);
              } catch (err) {
                  console.error("loadProfile error:", err);
                  setError("โหลดรายละเอียดโปรไฟล์ไม่สำเร็จ");
              } finally {
                  setLoading(false);
              }
          };
  
          loadProfile();
      }, [id]);

  return (
    <ScrollView className="flex-1 bg-[#0D0F1F]">
      <MenuBar />
      <View className="flex flex-col gap-y-6 px-4 pt-10 pb-14">
        
        {/* Title */}
        <Text className="font-bold text-[36px] leading-[44px] text-white">
          Profile
        </Text>

        {/* Description */}
        <Text className="font-normal text-base leading-6 text-gray-300">
          Keep your personal details private.{"\n"}
          Information you add here is visible to anyone who can view your profile
        </Text>

        {/* Avatar */}
        {/* ตรวจสอบว่าใน ProfileAvatar ของ Native รับ props เหมือนเดิมไหม */}
        <ProfileAvatar 
          url={profile?.pic_url} 
          previewUri={previewUri}
          onUpload={handleImagePick} 
          isLoading={uploading}
        />

        {/* Form fields */}
        <View className="flex flex-col gap-y-6 w-full">
          <InputField
            label="Name"
            value={profile?.name ?? ''}
            onChangeText={(text) => setName(text)} // Native ใช้ onChangeText
            placeholder="Your name"
            placeholderTextColor="#6B7280"
          />
          <InputField
            label="Email"
            keyboardType="email-address" // เพิ่มเพื่อให้เหมาะกับมือถือ
            value={profile?.email ?? ''}
            onChangeText={(text) => setEmail(text)}
            placeholder="Your email"
            placeholderTextColor="#6B7280"
            readOnly={true}
            showSoftInputOnFocus={false}
            contextMenuHidden={true}
            className="text-gray-500"
          />
        </View>

        {/* Save button */}
        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.7}
          className="border border-gray-300 rounded-lg px-10 py-3 self-start"
        >
          <Text className="font-bold text-base leading-6 text-white text-center">
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}