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
