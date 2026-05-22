import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          container: "hsl(var(--primary-container))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          container: "hsl(var(--secondary-container))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          container: "hsl(var(--tertiary-container))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          container: "hsl(var(--error-container))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          variant: "hsl(var(--surface-variant))",
          container: "hsl(var(--surface-container))",
          "container-low": "hsl(var(--surface-container-low))",
          "container-high": "hsl(var(--surface-container-high))",
          "container-highest": "hsl(var(--surface-container-highest))",
        },
        outline: {
          DEFAULT: "hsl(var(--outline))",
          variant: "hsl(var(--outline-variant))",
        },
        "on-surface": {
          DEFAULT: "hsl(var(--on-surface))",
          variant: "hsl(var(--on-surface-variant))",
        },
        "on-primary-container": "hsl(var(--on-primary-container))",
        "on-secondary-container": "hsl(var(--on-secondary-container))",
        "inverse-surface": "hsl(var(--inverse-surface))",
        "inverse-on-surface": "hsl(var(--inverse-on-surface))",
      },
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "28px",
        full: "9999px",
      },
      boxShadow: {
        "elevation-1": "var(--shadow-elevation-1)",
        "elevation-2": "var(--shadow-elevation-2)",
        "elevation-3": "var(--shadow-elevation-3)",
        "elevation-4": "var(--shadow-elevation-4)",
        "elevation-5": "var(--shadow-elevation-5)",
      },
      transitionTimingFunction: {
        "md-standard": "cubic-bezier(0.2, 0, 0, 1)",
        "md-emphasized": "cubic-bezier(0.2, 0, 0, 1)",
        "md-decelerated": "cubic-bezier(0, 0, 0, 1)",
        "md-accelerated": "cubic-bezier(0.3, 0, 1, 1)",
      },
      transitionDuration: {
        "md-short": "200ms",
        "md-medium": "300ms",
        "md-long": "500ms",
      },
    },
  },
  plugins: [],
};

export default config;
