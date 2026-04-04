import { View, Text } from "react-native";

type StepStatus = "completed" | "active" | "pending";

interface StepItem {
  number: number;
  label: string;
  status: StepStatus;
}

const STEPS: StepItem[] = [
  { number: 1, label: "Select showtime", status: "completed" },
  { number: 2, label: "Select seat", status: "active" },
  { number: 3, label: "Payment", status: "pending" },
];

export default function StepProgress() {
  return (
    <View className="flex-row items-start justify-center px-4 py-5 gap-0">
      {STEPS.map((step, index) => (
        <View key={step.number} className="flex-row items-start">
          <View className="flex-col items-center">
            <View
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                step.status === "completed" || step.status === "active"
                  ? "bg-blue-600"
                  : "bg-[#161A30]"
              }`}
            >
              {step.status === "completed" ? (
                <Text className="text-white">✓</Text>
              ) : (
                <Text className={step.status === "pending" ? "text-gray-400" : "text-white"}>{step.number}</Text>
              )}
            </View>
            <Text className={`mt-2 text-xs text-center leading-tight max-w-[72px] ${step.status === "pending" ? "text-gray-500" : "text-white"}`}>
              {step.label}
            </Text>
          </View>

          {index < STEPS.length - 1 && (
            <View className={`h-[2px] mt-5 mx-2 w-16 flex-shrink-0 rounded-full ${step.status === "completed" ? "bg-blue-600" : "bg-[#161A30]"}`} />
          )}
        </View>
      ))}
    </View>
  );
}
