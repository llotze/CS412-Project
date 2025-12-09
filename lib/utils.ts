// file: project/lib/utils.ts
// Author: Lucas Lotze (llotze@bu.edu), 12/06/2025
// Description: Utility functions for the project.

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to get category title by ID
export function getCategoryTitle(categories: { id: number | string, title: string }[], categoryId: number | string) {
  const cat = categories.find(c => c.id === categoryId)
  return cat ? cat.title : categoryId
}