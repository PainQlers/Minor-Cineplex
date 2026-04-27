import { supabase } from "@/libs/supabase";
import { Profiles } from "@/types/profile";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { Platform } from "react-native";

// const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_BASE_URL = 'http://localhost:3000';

export async function getProfileById(): Promise<Profiles> {

  try {
    if (!API_BASE_URL) {
      throw new Error("API base URL is undefined");
    }

    let token: string | null = null;

    if (Platform.OS === 'web') {
      token = localStorage.getItem('userToken');
    } else {
      token = await SecureStore.getItemAsync('userToken');
    }

    console.log('getProfileById: using token present?', !!token);

    if (!token) {
      throw new Error("Unauthorized: Please login first");
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const text = await response.text().catch(() => null);
      console.error('getProfileById failed:', response.status, text);
      throw new Error(`HTTP ${response.status}`);
    }

    const data = (await response.json()) as Profiles;
    console.log("Profile:", data);
    return data;
  } catch (err) {
    console.error("loadProfile error:", err);
    throw err;
  }
}

// frontend/src/services/profileService.ts

export const uploadProfilePicture = async (userId: string, file: any) => {
  // 1. อัปโหลดไป Storage (Frontend ทำเอง)
  const fileExt = (file.uri || '').split('.').pop() || 'jpg';
  const fileName = `${userId}-${Date.now()}.${fileExt}`; // ใส่ Date.now กัน Browser cache รูปเก่า

  // Convert local URI to Blob (works on web and RN fetch-compatible envs)
  const fetched = await fetch(file.uri);
  const blob = await fetched.blob();

  const { data, error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, blob, { upsert: true, contentType: file.type });

  if (uploadError) throw uploadError;

  // 2. ดึง Public URL
  const { data: publicData } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);
  const publicUrl = publicData?.publicUrl || null;

  // 3. ส่ง URL ไปให้ NestJS บันทึก (เรียกผ่าน API ของคุณ)
  // สมมติว่าคุณมีฟังก์ชันสำหรับเรียก axios หรือ fetch ไปที่ NestJS
  if (publicUrl) {
    await updateProfileInBackend(userId, { pic_url: publicUrl });
  }

  return publicUrl;
};

export const updateProfileInBackend = async (userId: string, data: { pic_url: string }) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/profiles/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error('Update Backend Error:', error);
    throw error;
  }}

export const debugAuthHeaders = async (token?: string) => {
  try {
    let t = token ?? null;
    if (!t) {
      if (Platform.OS === 'web') {
        t = localStorage.getItem('userToken');
      } else {
        t = await SecureStore.getItemAsync('userToken');
      }
    }

    console.log('debugAuthHeaders: token present?', !!t);

    const response = await fetch(`${API_BASE_URL}/auth/debug-headers`, {
      headers: {
        'Authorization': t ? `Bearer ${t}` : '',
        'Content-Type': 'application/json'
      }
    });

    const body = await response.text().catch(() => null);
    console.log('debugAuthHeaders response:', response.status, body);
    return { status: response.status, body };
  } catch (err) {
    console.error('debugAuthHeaders error:', err);
    throw err;
  }
};