// utils/index.tsx
// where all general functionality, utility, and library functions are saved

// cn
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function insertAt(arr: any[], index: any, ...elementsArr: any[]) {
  // Insert the elements at the specified index
  arr.splice(index, 0, ...elementsArr);
}

export function hexToRGBA(hex: string, alpha: string) {
  // Remove the hash at the beginning if it exists
  hex = hex.replace(/^#/, "");

  // Parse the hex color string
  let r, g, b;

  if (hex.length === 3) {
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
  } else if (hex.length === 6) {
    // If it is a six-digit hex code, parse each pair of digits
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 2), 16);
    b = parseInt(hex.substring(4, 2), 16);
  } else {
    return hex;
  }

  // Return the RGBA color string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
