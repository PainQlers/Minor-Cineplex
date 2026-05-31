import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const LOCATION_PROMPT_SEEN_KEY = "minorcineplex.location_prompt_seen";
const isWeb = Platform.OS === "web";

/**
 * Check if user has previously dismissed the location permission prompt
 * @returns Promise<boolean> true if user has seen and dismissed the prompt
 */
export async function hasSeenLocationPrompt(): Promise<boolean> {
  try {
    if (isWeb) {
      return localStorage.getItem(LOCATION_PROMPT_SEEN_KEY) === "1";
    }
    const value = await SecureStore.getItemAsync(LOCATION_PROMPT_SEEN_KEY);
    return value === "1";
  } catch (error) {
    return false;
  }
}

/**
 * Mark the location permission prompt as seen/dismissed
 * This should only be called when user explicitly interacts with the prompt
 */
export async function markLocationPromptSeen(): Promise<void> {
  try {
    if (isWeb) {
      localStorage.setItem(LOCATION_PROMPT_SEEN_KEY, "1");
      return;
    }
    await SecureStore.setItemAsync(LOCATION_PROMPT_SEEN_KEY, "1");
  } catch (error) {
    console.error("Error saving location prompt state to SecureStore:", error);
  }
}

/**
 * Clear the location prompt seen flag
 * Useful for testing or if user wants to reset permissions
 */
export async function clearLocationPromptSeen(): Promise<void> {
  try {
    if (isWeb) {
      localStorage.removeItem(LOCATION_PROMPT_SEEN_KEY);
      return;
    }
    await SecureStore.deleteItemAsync(LOCATION_PROMPT_SEEN_KEY);
  } catch (error) {
    console.error("Error clearing location prompt state from SecureStore:", error);
  }
}
