'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  // During server-side rendering or before hydration, context might be undefined
  // We return a default context to prevent errors, but the actual context will be available after hydration
  if (context === undefined) {
    return {
      theme: 'light' as Theme,
      toggleTheme: () => {
        // This is a placeholder function that will be replaced after hydration
        console.warn('Theme toggle called before ThemeProvider was initialized');
      }
    };
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme)
    } else {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      setTheme(systemTheme)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
     if (mounted) {
      document.documentElement.setAttribute('data-theme', theme)
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem('theme', theme)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  // To prevent hydration mismatch issues, we need to ensure the theme is consistent between server and client
  // We'll render children immediately but handle theme application after mounting
  // To prevent hydration mismatch issues, we need to ensure the theme is consistent between server and client
  // We'll render children immediately but handle theme application after mounting
  if (!mounted) {
    // During server-side rendering, we don't apply any theme-specific classes
    return (
      <ThemeContext.Provider value={{ theme: 'light', toggleTheme: () => {} }}>
        {children}
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
  