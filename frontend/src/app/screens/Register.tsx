import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Platform } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

import Header from '../../components/sections/auth/AuthHeader';
import SearchBar from '../../components/sections/auth/AuthSearchBar';
import FilterRow from '../../components/sections/auth/AuthFilterRow';
import SubmitButton from '../../components/sections/auth/AuthSubmitButton';
import Footer from '../../components/sections/auth/AuthFooter';

// ── Filter field config ───────────────────────────────────────────────────────
const FILTER_FIELDS = [
  { key: 'name',    label: 'Name',    placeholder: 'Full name',  secure: false },
  { key: 'email',        label: 'Email',   placeholder: 'Email',      secure: false },
  { key: 'password',     label: 'Password',placeholder: 'Password',   secure: true  },
] as const;

type FieldKey = (typeof FILTER_FIELDS)[number]['key'];

// ── FilterScreen ──────────────────────────────────────────────────────────────
const Register = () => {
  const [fields, setFields] = useState<Record<FieldKey, string>>({
    name: '',
    email:     '',
    password:  '',
  });

  const [errors, setErrors] = useState<Record<FieldKey, string | null>>({
    name: null,
    email: null,
    password: null,
  });

  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (key: FieldKey) => (text: string) => {
    setFields(prev => ({ ...prev, [key]: text }));

    // If user already tried to submit, validate fields live
    if (submitted) {
      if (key === 'email') {
        if (!text.trim()) {
          setErrors(prev => ({ ...prev, email: 'Please enter your email' }));
        } else if (!emailRegex.test(text)) {
          setErrors(prev => ({ ...prev, email: 'Email must be a valid email' }));
        } else {
          setErrors(prev => ({ ...prev, email: null }));
        }
      } else if (key === 'name') {
        if (!text.trim()) {
          setErrors(prev => ({ ...prev, name: 'Please enter your name' }));
        } else {
          setErrors(prev => ({ ...prev, name: null }));
        }
      } else if (key === 'password') {
        if (!text.trim()) {
          setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
        } else {
          setErrors(prev => ({ ...prev, password: null }));
        }
      }
    }
  };

  const handleSubmit = async () => {
    // TODO: wire up form submission / navigation
    setSubmitted(true);
    try {
    console.log('Submitting:', fields);

    // Required-field validation
    const newErrors: Record<FieldKey, string | null> = {
      name: null,
      email: null,
      password: null,
    };

    if (!fields.name.trim()) newErrors.name = 'Please enter your name';
    if (!fields.email.trim()) newErrors.email = 'Please enter your email';
    else if (!emailRegex.test(fields.email)) newErrors.email = 'Email must be a valid email';
    if (!fields.password.trim()) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);

    if (Object.values(newErrors).some(v => v)) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง');
      return;
    }

    const response = await axios.post(
      'http://localhost:3000/auth/register', // ⚠️ Android emulator
      fields
    );

    console.log('✅ Register success:', response.data);
    alert('Register success 🎉');

    // TODO: redirect ไปหน้า login

  } catch (error: any) {
    console.error('❌ Register error:', error.response?.data.message || error.message);

    alert(
      error.response?.data?.message || 'Register failed'
    );
  }
  };

  return (
    <View className="flex-1 bg-[#101525]">
      <Header />
      <Text className="text-white text-4xl font-semibold mx-auto my-10">Register</Text>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Search / top input */}

        {/* Filter rows */}
        {FILTER_FIELDS.map(field => (
          <FilterRow
            key={field.key}
            label={field.label}
            placeholder={field.placeholder}
            secureTextEntry={field.secure}
            value={fields[field.key]}
            onChangeText={handleChange(field.key)}
            error={submitted ? errors[field.key] : null}
          />
        ))}

        {/* CTA */}
        <SubmitButton label="Register" onPress={handleSubmit} />

        {/* Footer */}
        <View className="items-center mt-6 mb-4 gap-y-3 flex-row justify-center">
            {/* Helper / disclaimer text */}
            <Text className="text-[#8b93b0] text-xs text-center px-1 leading-5">
              Already have an account?
            </Text>
            <Pressable onPress={() => Platform.select({
              web: () => window.location.href = '/screens/Login',
              default: () => router.push('/screens/Login')
            })}>
              <Text className="text-white text-xs text-center px-1 leading-5 underline">
                Login
              </Text>
            </Pressable>
          </View>
      </ScrollView>
    </View>
  );
};

export default Register;