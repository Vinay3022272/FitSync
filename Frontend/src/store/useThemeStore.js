import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme:localStorage.getItem("fitsync-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("fitsync-theme", theme);
    set({theme})
  }
}))

