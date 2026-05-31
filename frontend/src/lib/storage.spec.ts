import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  hasSeenLocationPrompt,
  markLocationPromptSeen,
  clearLocationPromptSeen,
} from "./storage";

// Mock expo-secure-store
const mockGetItemAsync = vi.fn();
const mockSetItemAsync = vi.fn();
const mockDeleteItemAsync = vi.fn();

vi.mock("expo-secure-store", () => ({
  getItemAsync: (...args: unknown[]) => mockGetItemAsync(...args),
  setItemAsync: (...args: unknown[]) => mockSetItemAsync(...args),
  deleteItemAsync: (...args: unknown[]) => mockDeleteItemAsync(...args),
}));

describe("storage utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error in tests
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("hasSeenLocationPrompt", () => {
    it("should return true when key exists with value '1'", async () => {
      mockGetItemAsync.mockResolvedValue("1");

      const result = await hasSeenLocationPrompt();

      expect(result).toBe(true);
      expect(mockGetItemAsync).toHaveBeenCalledWith(
        "minorcineplex.location_prompt_seen"
      );
    });

    it("should return false when key does not exist", async () => {
      mockGetItemAsync.mockResolvedValue(null);

      const result = await hasSeenLocationPrompt();

      expect(result).toBe(false);
    });

    it("should return false when key has different value", async () => {
      mockGetItemAsync.mockResolvedValue("0");

      const result = await hasSeenLocationPrompt();

      expect(result).toBe(false);
    });

    it("should return false and log error when SecureStore fails", async () => {
      mockGetItemAsync.mockRejectedValue(new Error("Storage error"));

      const result = await hasSeenLocationPrompt();

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "Error reading location prompt state from SecureStore:",
        expect.any(Error)
      );
    });
  });

  describe("markLocationPromptSeen", () => {
    it("should save '1' to SecureStore", async () => {
      mockSetItemAsync.mockResolvedValue(undefined);

      await markLocationPromptSeen();

      expect(mockSetItemAsync).toHaveBeenCalledWith(
        "minorcineplex.location_prompt_seen",
        "1"
      );
    });

    it("should log error when SecureStore fails", async () => {
      mockSetItemAsync.mockRejectedValue(new Error("Storage error"));

      await markLocationPromptSeen();

      expect(console.error).toHaveBeenCalledWith(
        "Error saving location prompt state to SecureStore:",
        expect.any(Error)
      );
    });
  });

  describe("clearLocationPromptSeen", () => {
    it("should delete key from SecureStore", async () => {
      mockDeleteItemAsync.mockResolvedValue(undefined);

      await clearLocationPromptSeen();

      expect(mockDeleteItemAsync).toHaveBeenCalledWith(
        "minorcineplex.location_prompt_seen"
      );
    });

    it("should log error when SecureStore fails", async () => {
      mockDeleteItemAsync.mockRejectedValue(new Error("Storage error"));

      await clearLocationPromptSeen();

      expect(console.error).toHaveBeenCalledWith(
        "Error clearing location prompt state from SecureStore:",
        expect.any(Error)
      );
    });
  });
});
