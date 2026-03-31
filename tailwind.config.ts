import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'ios-blue': '#007AFF',
        'ios-blue-dark': '#0051D5',
        'ios-blue-light': '#5AC8FA',
      },
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'float-delayed': 'float 25s ease-in-out 5s infinite',
        'nova-orb-1': 'novaOrb1 24s ease-in-out infinite',
        'nova-orb-2': 'novaOrb2 32s ease-in-out infinite',
        'nova-orb-3': 'novaOrb3 20s ease-in-out infinite',
        'nova-orb-4': 'novaOrb4 28s ease-in-out infinite',
        'nova-orb-5': 'novaOrb5 22s ease-in-out infinite',
        'nova-glow': 'novaGlow 10s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        novaOrb1: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)' },
          '25%': { transform: 'translate(6%, 8%) scale(1.08)' },
          '50%': { transform: 'translate(3%, -4%) scale(1.02)' },
          '75%': { transform: 'translate(-5%, 5%) scale(1.06)' },
        },
        novaOrb2: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)' },
          '33%': { transform: 'translate(-8%, 5%) scale(1.1)' },
          '66%': { transform: 'translate(4%, -6%) scale(0.96)' },
        },
        novaOrb3: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)' },
          '50%': { transform: 'translate(-6%, -8%) scale(1.12)' },
        },
        novaOrb4: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)' },
          '40%': { transform: 'translate(7%, -5%) scale(1.07)' },
          '80%': { transform: 'translate(-4%, 9%) scale(0.98)' },
        },
        novaOrb5: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)' },
          '20%': { transform: 'translate(5%, -7%) scale(1.05)' },
          '60%': { transform: 'translate(-7%, 3%) scale(1.1)' },
        },
        novaGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.9' },
        },
      }
    },
  },
  plugins: [],
};
export default config;

