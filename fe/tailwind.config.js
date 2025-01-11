/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["ui-sans-serif", "system-ui"],
      serif: ["ui-serif", "Georgia"],
      mono: ["ui-monospace", "SFMono-Regular"],
      handwriting: ["Pacifico"],
      body: ['"Open Sans"'],
    },
    extend: {},
  },
  safelist: [
    "blur-sm",
    "blur-md",
    "blur-lg",
    "lg:blur-lg",
    "lg:blur-sm",
    "lg:blur",
    "from-blue-300",
    "to-purple-400",
    "to-purple-500",
    "via-emerald-300",
    "bg-blue-300",
    "bg-purple-500",
    "bg-emerald-300",
    "text-blue-300",
    "text-purple-500",
    "text-emerald-300",
  ],
  plugins: [],
};
