import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';

import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';
import FilterRow from '../../components/FilterRow';
import SubmitButton from '../../components/SubmitButton';
import Footer from '../../components/Footer';

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

  const handleChange = (key: FieldKey) => (text: string) => {
    setFields(prev => ({ ...prev, [key]: text }));
  };

  const handleSubmit = () => {
    // TODO: wire up form submission / navigation
    console.log('Submitted fields:', fields);
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
          />
        ))}

        {/* CTA */}
        <SubmitButton label="Register" onPress={handleSubmit} />

        {/* Footer */}
        <View className="items-center mt-6 mb-4 gap-y-3">
            {/* Helper / disclaimer text */}
            <Text className="text-[#8b93b0] text-xs text-center px-8 leading-5">
              Already have an account? Login
            </Text>
          </View>
      </ScrollView>
    </View>
  );
};

export default Register;