const { fontFamily } = require("tailwindcss/defaultTheme");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const { nextui } = require("@nextui-org/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      // animation: {
      //   first: "moveVertical 30s ease infinite",
      //   second: "moveInCircle 20s reverse infinite",
      //   third: "moveInCircle 40s linear infinite",
      //   fourth: "moveHorizontal 40s ease infinite",
      //   fifth: "moveInCircle 20s ease infinite",
      // },
      // keyframes: {
      //   moveHorizontal: {
      //     "0%": {
      //       transform: "translateX(-50%) translateY(-10%)",
      //     },
      //     "50%": {
      //       transform: "translateX(50%) translateY(10%)",
      //     },
      //     "100%": {
      //       transform: "translateX(-50%) translateY(-10%)",
      //     },
      //   },
      //   moveInCircle: {
      //     "0%": {
      //       transform: "rotate(0deg)",
      //     },
      //     "50%": {
      //       transform: "rotate(180deg)",
      //     },
      //     "100%": {
      //       transform: "rotate(360deg)",
      //     },
      //   },
      //   moveVertical: {
      //     "0%": {
      //       transform: "translateY(-50%)",
      //     },
      //     "50%": {
      //       transform: "translateY(50%)",
      //     },
      //     "100%": {
      //       transform: "translateY(-50%)",
      //     },
      //   },
      // },
      fontFamily: {
        // default: ["var(--font-inter)", ...fontFamily.sans],
        cal: ["var(--font-cal)", ...fontFamily.sans],
        // title: ["var(--font-title)", ...fontFamily.sans],
        mono: ["Consolas", ...fontFamily.mono],
        space: ["var(--font-space)", ...fontFamily.sans],
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontFamily: "Cal Sans",
            },
            h2: {
              fontFamily: "Cal Sans",
            },
            h3: {
              fontFamily: "Cal Sans",
            },
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:first-of-type::after": { content: "none" },
          },
        },
      },
      keyframes: {
        wiggle: {
          "0%, 100%": {
            transform: "translateX(0%)",
            transformOrigin: "50% 50%",
          },
          "15%": { transform: "translateX(-6px) rotate(-6deg)" },
          "30%": { transform: "translateX(9px) rotate(6deg)" },
          "45%": { transform: "translateX(-9px) rotate(-3.6deg)" },
          "60%": { transform: "translateX(3px) rotate(2.4deg)" },
          "75%": { transform: "translateX(-2px) rotate(-1.2deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 0.8s both",
      },
    },
  },
  safelist: [
    {
      pattern:
        /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
  ],
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            default: {
              50: "#fafafa",
              100: "#f2f2f3",
              200: "#ebebec",
              300: "#e3e3e6",
              400: "#dcdcdf",
              500: "#d4d4d8",
              600: "#afafb2",
              700: "#8a8a8c",
              800: "#656567",
              900: "#404041",
              foreground: "#000",
              DEFAULT: "#d4d4d8",
            },
            primary: {
              50: "#dfedfd",
              100: "#b3d4fa",
              200: "#86bbf7",
              300: "#59a1f4",
              400: "#2d88f1",
              500: "#006fee",
              600: "#005cc4",
              700: "#00489b",
              800: "#003571",
              900: "#002147",
              foreground: "#fff",
              DEFAULT: "#006fee",
            },
            secondary: {
              50: "#eee4f8",
              100: "#d7bfef",
              200: "#bf99e5",
              300: "#a773db",
              400: "#904ed2",
              500: "#7828c8",
              600: "#6321a5",
              700: "#4e1a82",
              800: "#39135f",
              900: "#240c3c",
              foreground: "#fff",
              DEFAULT: "#7828c8",
            },
            success: {
              50: "#e2f8ec",
              100: "#b9efd1",
              200: "#91e5b5",
              300: "#68dc9a",
              400: "#40d27f",
              500: "#17c964",
              600: "#13a653",
              700: "#0f8341",
              800: "#0b5f30",
              900: "#073c1e",
              foreground: "#000",
              DEFAULT: "#17c964",
            },
            warning: {
              50: "#fef4e4",
              100: "#fce4bd",
              200: "#fad497",
              300: "#f9c571",
              400: "#f7b54a",
              500: "#f5a524",
              600: "#ca881e",
              700: "#9f6b17",
              800: "#744e11",
              900: "#4a320b",
              foreground: "#000",
              DEFAULT: "#f5a524",
            },
            danger: {
              50: "#fee1eb",
              100: "#fbb8cf",
              200: "#f98eb3",
              300: "#f76598",
              400: "#f53b7c",
              500: "#f31260",
              600: "#c80f4f",
              700: "#9e0c3e",
              800: "#73092e",
              900: "#49051d",
              foreground: "#000",
              DEFAULT: "#f31260",
            },
            background: "#ffffff",
            foreground: {
              50: "#dfdfdf",
              100: "#b3b3b3",
              200: "#868686",
              300: "#595959",
              400: "#2d2d2d",
              500: "#000000",
              600: "#000000",
              700: "#000000",
              800: "#000000",
              900: "#000000",
              foreground: "#fff",
              DEFAULT: "#000000",
            },
            content1: {
              DEFAULT: "#ffffff",
              foreground: "#000",
            },
            content2: {
              DEFAULT: "#f4f4f5",
              foreground: "#000",
            },
            content3: {
              DEFAULT: "#e4e4e7",
              foreground: "#000",
            },
            content4: {
              DEFAULT: "#d4d4d8",
              foreground: "#000",
            },
            focus: "#006FEE",
            overlay: "#000000",
            divider: "#111111",
          },
        },
        dark: {
          colors: {
            default: {
              50: "#141417",
              100: "#232327",
              200: "#313136",
              300: "#3f3f46",
              400: "#6a6a70",
              500: "#959599",
              600: "#c1c1c3",
              700: "#ececed",
              foreground: "#fff",
              DEFAULT: "#313136",
            },
            primary: {
              50: "#00244d",
              100: "#003d83",
              200: "#0056b8",
              300: "#006fee",
              400: "#398ff2",
              500: "#73b0f6",
              600: "#acd0f9",
              700: "#e6f1fd",
              foreground: "#fff",
              DEFAULT: "#0056b8",
            },
            secondary: {
              50: "#270d41",
              100: "#42166e",
              200: "#5d1f9b",
              300: "#7828c8",
              400: "#9658d4",
              500: "#b589e1",
              600: "#d3b9ed",
              700: "#f2eafa",
              foreground: "#fff",
              DEFAULT: "#5d1f9b",
            },
            success: {
              50: "#074120",
              100: "#0d6f37",
              200: "#129c4e",
              300: "#17c964",
              400: "#4bd587",
              500: "#7fe1aa",
              600: "#b4edcd",
              700: "#e8faf0",
              foreground: "#000",
              DEFAULT: "#129c4e",
            },
            warning: {
              50: "#50360c",
              100: "#875b14",
              200: "#be801c",
              300: "#f5a524",
              400: "#f7b955",
              500: "#face87",
              600: "#fce2b8",
              700: "#fef6e9",
              foreground: "#000",
              DEFAULT: "#be801c",
            },
            danger: {
              50: "#4f061f",
              100: "#860a35",
              200: "#bc0e4a",
              300: "#f31260",
              400: "#f64784",
              500: "#f87da8",
              600: "#fbb2cb",
              700: "#fee7ef",
              foreground: "#fff",
              DEFAULT: "#bc0e4a",
            },
            background: "#020202",
            foreground: {
              50: "#535353",
              100: "#8c8c8c",
              200: "#c6c6c6",
              300: "#ffffff",
              400: "#ffffff",
              500: "#ffffff",
              600: "#ffffff",
              700: "#ffffff",
              foreground: "#000",
              DEFAULT: "#c6c6c6",
            },
            content1: {
              DEFAULT: "#18181b",
              foreground: "#fff",
            },
            content2: {
              DEFAULT: "#27272a",
              foreground: "#fff",
            },
            content3: {
              DEFAULT: "#3f3f46",
              foreground: "#fff",
            },
            content4: {
              DEFAULT: "#52525b",
              foreground: "#fff",
            },
            focus: "#006FEE",
            overlay: "#ffffff",
            divider: "#ffffff",
          },
        },
      },
      layout: {
        fontSize: {
          tiny: "0.75rem",
          small: "0.875rem",
          medium: "1rem",
          large: "1.125rem",
        },
        lineHeight: {
          tiny: "1rem",
          small: "1.25rem",
          medium: "1.5rem",
          large: "1.75rem",
        },
        radius: {
          small: "0.5rem",
          medium: "0.75rem",
          large: "0.875rem",
        },
        borderWidth: {
          small: "1px",
          medium: "2px",
          large: "3px",
        },
        disabledOpacity: "0.5",
        dividerWeight: "1",
        hoverOpacity: "0.9",
      },
    }),
    require("@tailwindcss/typography"),
    // require("@tailwindcss/forms"),
    require("tailwindcss-animate"),
    addVariablesForColors,
  ],
};

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  );

  addBase({
    ":root": newVars,
  });
}
