import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Header from '../../components/Header';
import FilterRow from '../../components/FilterRow';
import { Checkbox } from '../../components/Checkbox';
import SubmitButton from '../../components/SubmitButton';
import { useRouter } from 'expo-router';
import axios from 'axios';

const FILTER_FIELDS = [
  { key: 'email',        label: 'Email',   placeholder: 'Email',      secure: false },
  { key: 'password',     label: 'Password',placeholder: 'Password',   secure: true  },
] as const;

type FieldKey = (typeof FILTER_FIELDS)[number]['key'];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [fields, setFields] = useState<Record<FieldKey, string>>({
      email:     '',
      password:  '',
    });
  
  const [errors, setErrors] = useState<Record<FieldKey, string | null>>({
    email: null,
    password: null,
  });

  const router = useRouter();

  const [submitted, setSubmitted] = useState(false);
  
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
      } else if (key === 'password') {
        if (!text) {
          setErrors(prev => ({ ...prev, password: 'Please enter your password' }));
        } else {
          setErrors(prev => ({ ...prev, password: null }));
        }
      }
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    try {
    console.log('Submitting:', fields);

    // Required-field validation
    const newErrors: Record<FieldKey, string | null> = {
      email: null,
      password: null,
    };

    if (!fields.email.trim()) newErrors.email = 'Please enter your email';
    else if (!emailRegex.test(fields.email)) newErrors.email = 'Email must be a valid email';
    if (!fields.password.trim()) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);

    if (Object.values(newErrors).some(v => v)) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง');
      return;
    }

    const response = await axios.post(
      'http://localhost:3000/auth/login', // ⚠️ Android emulator
      fields
    );

    console.log('✅ Login success:', response.data);
    alert('Login success 🎉');

    // TODO: redirect ไปหน้า login

  } catch (error: any) {
    console.error('❌ Login error:', error.response?.data.message || error.message);

    alert(
      error.response?.data?.message || 'Login failed'
    );
  }
    console.log('Sign in:', { email, password, rememberMe });
  };

  return (
    <View className="flex-1 bg-[#101525]">
      <Header />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        >
          {/* Page heading */}
          <Text className="text-white text-4xl font-semibold mx-auto my-10">Login</Text>

          {/* Form fields */}
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

          {/* Remember me */}
          <View className='mt-5 flex-row justify-between mx-5'>
            <Checkbox
            label="Remember me"
            checked={rememberMe}
            onToggle={() => setRememberMe((v) => !v)}
          />
          <Text className='text-white underline'>
            Forget Password?
          </Text>
          </View>

          {/* Password requirements hint
          <Text className="text-[#8b93b0] text-xs leading-5">
            Password must contain: uppercase, lowercase, number, special char, and be 8+ characters.
          </Text> */}

          {/* Sign in button */}
          <SubmitButton label="Register" onPress={handleSubmit} />

          {/* Footer links */}
          <View className="items-center mt-6 mb-4 gap-y-3 flex-row justify-center">
            {/* Helper / disclaimer text */}
            <Text className="text-[#8b93b0] text-xs text-center px-1 leading-5">
                Already have an account?
              </Text>
              <Text className="text-white text-xs text-center px-1 leading-5 underline"
              onPress={() => router.push('/screens/Register')}>
                Register
              </Text>
              <Text className="text-white text-xs text-center px-1 leading-5 underline"
              onPress={() => router.push('/screens/Booking')}>
                Booking
              </Text>
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}