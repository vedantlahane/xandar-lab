import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


/**
 * Utility function to merge class names using clsx and tailwind-merge.
 * @param inputs - An array of class names or conditional class names.
 * @returns A single string containing the merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
