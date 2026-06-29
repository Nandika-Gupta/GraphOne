"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

type Theme = "light" | "dark";
type AuthMode = "login" | "signup" | null;
type SubmitMode = "product" | "startup" | null;

interface AppContextValue {
  theme: Theme;
  toggleTheme: () => void;
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  authMode: AuthMode;
  openAuth: (mode: "login" | "signup") => void;
  closeAuth: () => void;
  submitMode: SubmitMode;
  openSubmit: (mode: "product" | "startup") => void;
  closeSubmit: () => void;
  mobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [searchOpen, setSearchOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [submitMode, setSubmitMode] = useState<SubmitMode>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("go-theme") as Theme | null;
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("go-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setAuthMode(null);
        setSubmitMode(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const toggleTheme = useCallback(() => setTheme((t) => (t === "light" ? "dark" : "light")), []);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const openAuth = useCallback((mode: "login" | "signup") => setAuthMode(mode), []);
  const closeAuth = useCallback(() => setAuthMode(null), []);
  const openSubmit = useCallback((mode: "product" | "startup") => setSubmitMode(mode), []);
  const closeSubmit = useCallback(() => setSubmitMode(null), []);
  const openMobileMenu = useCallback(() => setMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      searchOpen, openSearch, closeSearch,
      authMode, openAuth, closeAuth,
      submitMode, openSubmit, closeSubmit,
      mobileMenuOpen, openMobileMenu, closeMobileMenu,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
