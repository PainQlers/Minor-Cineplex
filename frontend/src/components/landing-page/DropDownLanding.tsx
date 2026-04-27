import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View, Animated, Platform, Alert } from "react-native";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { NotebookTabs, TicketPercent, User, LogOut, RotateCcw, LogIn, NotebookPen } from 'lucide-react';
import { Profiles } from '@/types/profile';
import { getProfileById } from '@/services/profile.service';

interface DropdownProps {
  onClose?: () => void;
  open?: boolean;
}

export function Dropdown({ onClose, open = false }: DropdownProps) {
    const router = useRouter();
    const anim = useRef(new Animated.Value(0)).current; // 0 hidden, 1 visible

    useEffect(() => {
        Animated.timing(anim, {
            toValue: open ? 1 : 0,
            duration: 220,
            useNativeDriver: Platform.OS !== 'web',
        }).start();
    }, [open, anim]);

    const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] });
    const opacity = anim;

    return (
        <Animated.View
            pointerEvents={open ? 'auto' : 'none'}
            style={{ position: 'absolute', top: 56, left: 0, right: 0, transform: [{ translateY }], opacity }}
        >
            <BlurView intensity={30} tint="dark" className="w-full flex-col items-stretch" pointerEvents="box-none">
                <Pressable
                    className="h-14 items-center mt-5 object-cover mx-4 flex-row gap-2"
                    onPress={() => {
                        onClose?.();
                        router.push('/screens/Login');
                    }}
                >
                    <LogIn color="#C8CEDD" size={20} />
                    <Text className="w-40 text-[#C8CEDD] font-condensedMedium text-base font-thin py-4">Login</Text>
                </Pressable>
                <Pressable
                    className="h-14 items-center object-cover mx-4 flex-row gap-2"
                    onPress={() => {
                        onClose?.();
                        router.push('/screens/Register');
                    }}
                >
                    <NotebookPen color="#C8CEDD" size={20} />
                    <Text className="w-40 text-[#C8CEDD] font-condensedMedium text-base font-thin py-4">Register</Text>
                </Pressable>
            </BlurView>
        </Animated.View>
    );
}

export function DropdownUser({ onClose, open = false }: DropdownProps) {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [profile, setProfile] = useState<Profiles | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { logout } = useAuth();
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(anim, {
            toValue: open ? 1 : 0,
            duration: 220,
            useNativeDriver: Platform.OS !== 'web',
        }).start();
    }, [open, anim]);

    const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] });
    const opacity = anim;

    return (
        <Animated.View
            pointerEvents={open ? 'auto' : 'none'}
            style={{ position: 'absolute', top: 56, left: 0, right: 0, transform: [{ translateY }], opacity }}
        >
            <BlurView
            intensity={50}
            tint="dark"
            className="w-full flex-col items-stretch"
            pointerEvents="box-none"
            >
                <View className='bg-[#070C1B] opacity-90'>
                <Pressable
                    className="h-14 items-center mt-5 object-cover mx-4 flex-row gap-2"
                    onPress={() => {
                        onClose?.();
                        router.push('/');
                    }}
                >
                    <NotebookTabs color="#C8CEDD" size={20} />
                    <Text className="w-40 text-[#C8CEDD] font-condensedMedium text-base font-thin py-4">Booking History</Text>
                </Pressable>
                <Pressable
                    className="h-14 object-cover mx-4 items-center flex-row gap-2"
                    onPress={() => {
                        onClose?.();
                        router.push('/');
                    }}
                >
                    <TicketPercent color="#C8CEDD" size={20} />
                    <Text className="w-40 text-[#C8CEDD] font-condensedMedium text-base font-thin py-4">My Coupons</Text>
                </Pressable>
                <Pressable
                    className="h-14 object-cover mx-4 items-center flex-row gap-2"
                    onPress={() => {
                        onClose?.();
                        router.push(`/profile`);
                    }}
                >
                    <User color="#C8CEDD" size={20} />
                    <Text className="w-40 text-[#C8CEDD] font-condensedMedium text-base font-thin py-4">Profile</Text>
                </Pressable>
                <Pressable
                    className="h-14 border-b border-gray-500 object-cover mx-4 items-center flex-row gap-2"
                    onPress={() => {
                        onClose?.();
                        router.push('/');
                    }}
                >
                    <RotateCcw color="#C8CEDD" size={20} />
                    <Text className="w-40 text-[#C8CEDD] font-condensedMedium text-base font-thin py-4">Reset Password</Text>
                </Pressable>
                <Pressable
                    className="h-20 object-cover mx-4 items-center flex-row gap-2"
                    onPress={() => {
                        onClose?.();
                        Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Logout', style: 'destructive', onPress: () => { logout(); router.push('/'); } }
                        ]);
                    }}
                >
                    <LogOut color="#C8CEDD" size={20} />
                    <Text className="w-40 text-[#C8CEDD] font-condensedMedium text-base font-thin py-4">Logout</Text>
                </Pressable>
                </View>
            </BlurView>
        </Animated.View>
    );
}
