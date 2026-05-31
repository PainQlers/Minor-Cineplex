import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import InputField from "@/components/profile/InputField";
import MenuBar from "@/components/profile/MenuBar";
import { getProfileById, updateProfileInBackend, uploadProfilePicture } from "@/services/profile.service";
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
    try {
      setUploading(true);
      let currentPicUrl = profile?.pic_url || null;

      // 1. ถ้ามีการเลือกรูปใหม่ ให้ทำการอัปโหลดก่อน
      if (previewUri) {
        const uploadedUrl = await uploadProfilePicture({
          uri: previewUri,
          type: 'image/jpeg',
          name: 'avatar.jpg'
        });
        currentPicUrl = uploadedUrl;
      }

      // 2. ส่งข้อมูลทั้งหมด (ชื่อ และ pic_url ล่าสุด) ไปที่ Backend edit
      // แนะนำให้รวมการแก้ไข name ไว้ใน service เดียวกับ updateProfileInBackend
      const updatedData = {
        name: name,
        pic_url: currentPicUrl
      };

      // เรียก service ที่เราสร้างไว้ (ต้องแน่ใจว่า service นี้ส่ง token ไปด้วย)
      const result = await updateProfileInBackend(updatedData);

      setProfile(result);

      Alert.alert("สำเร็จ", "บันทึกข้อมูลเรียบร้อย");
      setPreviewUri(null); // ล้าง preview หลังจาก save สำเร็จ
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('Error', 'ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setUploading(false);
    }
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
          const data = await getProfileById(); // เรียกใช้ตัวที่ดึงจาก JWT
          setProfile(data);
          setName(data.name || ""); // <--- สำคัญ: ต้องเซ็ตค่าเริ่มต้นให้ state name
        } catch (err) {
          Alert.alert("Error", "โหลดรายละเอียดโปรไฟล์ไม่สำเร็จ");
        } finally {
          setLoading(false);
        }
      };
      loadProfile();
    }, []);

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
            value={name ?? ''}
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