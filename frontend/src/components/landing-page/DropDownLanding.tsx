import { Pressable, Text } from "react-native";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";

interface DropdownProps {
  onClose?: () => void;
}

export function Dropdown({ onClose }: DropdownProps) {
    const router = useRouter();
    return (
        <BlurView intensity={30} tint="dark" className="flex-1 w-full absolute flex-col items-center" style={{ position: 'absolute', top: 56 }}>
            <Pressable
                className="p-4"
                onPress={() => {
                    onClose?.();
                    router.push('/screens/Login')
                }}
            >
                <Text className="w-40 text-center text-white font-condensed text-body1regular py-4">Login</Text>
            </Pressable>
            <Pressable
                className="p-4"
                onPress={() => {
                    onClose?.();
                    router.push('/screens/Register')
                }}
            >
                <Text className="w-40 text-center text-white font-condensedMedium text-body1regular border border-[#8B93B0] rounded-lg py-4">Register</Text>
            </Pressable>
        </BlurView>
    )
}