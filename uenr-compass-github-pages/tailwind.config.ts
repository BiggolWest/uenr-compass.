import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest: "#0B7A3B",
        river: "#009FE3",
        heritage: "#590D0D",
        solar: "#EAB308",
      },
    },
  },
  plugins: [],
};
export default config;
