import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRoomCode(length = 6) {
  // Define characters that can be used in the room code
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let roomCode = "";

  // Randomly select characters from the pool until the desired length is reached
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomCode += characters[randomIndex];
  }

  return roomCode;
}

export function generateRandomHueColor() {
  const hue = Math.floor(Math.random() * 360); // Generate a random hue (0-360)
  const saturation = 100; // Full saturation for vibrant colors
  const lightness = 50; // Midpoint lightness for a balanced color

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function generateUniqueString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

export function wordMatchPercentage(
  str1: string,
  str2: string,
  threshold: number
): boolean {
  // Split the strings into arrays of words
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);

  // Determine the shorter and longer list of words
  const [shorterWords, longerWords] =
    words1.length <= words2.length ? [words1, words2] : [words2, words1];

  // Count matching words
  let matchCount = 0;
  for (let word of shorterWords) {
    if (longerWords.includes(word)) {
      matchCount++;
    }
  }

  // Calculate the match percentage based on the shorter list's length
  const matchPercentage = (matchCount / longerWords.length) * 100;

  // Return whether the match percentage meets or exceeds the threshold
  return matchPercentage >= threshold;
}
