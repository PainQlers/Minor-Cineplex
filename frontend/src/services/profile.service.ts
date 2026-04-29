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

export const uploadProfilePicture = async (file: any) => {

  try {
  let token: string | null = null;

    if (Platform.OS === 'web') {
      token = localStorage.getItem('userToken');
    } else {
      token = await SecureStore.getItemAsync('userToken');
    }

  // 1. อัปโหลดไป Storage (Frontend ทำเอง)
  const fileName = `avatar-${Date.now()}.jpg`;

  // Convert local URI to Blob (works on web and RN fetch-compatible envs)
  const fetched = await fetch(file.uri);
  const blob = await fetched.blob();

  const { data, error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, blob, { 
      upsert: true, 
      contentType: file.type || 'image/jpeg'
    });

  if (uploadError) throw uploadError;

  // 2. ดึง Public URL
  const { data: publicData } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);
  const publicUrl = publicData?.publicUrl || null;

  return publicUrl;
  } catch (error) {
    console.error('Upload Process Error:', error);
    throw error;
  }
};

export const updateProfileInBackend = async (data: { name?: string; pic_url: string | null }) => {
  try {
    let token: string | null = null;

    if (Platform.OS === 'web') {
      token = localStorage.getItem('userToken');
    } else {
      token = await SecureStore.getItemAsync('userToken');
    }

    const response = await axios.patch(`${API_BASE_URL}/auth/edit`, data, {
      headers: {
        Authorization: `Bearer ${token}`, // สำคัญมาก!
        'Content-Type': 'application/json',
      },
  });
    return response.data;
  } catch (error: any) {
    console.error('Update Backend Error:', error.response?.data || error.message);
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