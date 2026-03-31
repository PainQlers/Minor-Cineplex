import { Stack } from "expo-router";

import { ButtonShowcase } from "../components/button-showcase";
import "./../global.css";

export default function Index() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ButtonShowcase />
    </>
  );
}
