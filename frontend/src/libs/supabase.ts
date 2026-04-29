import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage'; // สำหรับ Mobile
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // แก้ไขตรงนี้: เช็คว่าถ้าไม่ใช่ Web ให้ใช้ AsyncStorage 
    // แต่ถ้าเป็น Web ให้เช็คด้วยว่า window มีตัวตนไหม (กัน SSR พัง)
    storage: Platform.OS === 'web' 
      ? (typeof window !== 'undefined' ? window.localStorage : undefined) 
      : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});