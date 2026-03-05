import { createTheme } from "@mui/material/styles";

const udemyPurple = "#6A0DAD";

const theme = createTheme({
  palette: {
    primary: {
      main: udemyPurple,
      light: "#8a2be2",
      dark: "#4b0082",
      contrastText: "#ffffff",
    },
    hero: {
      background: "#1c1d1f",
      text: "#ffffff",
      chipBg: "rgba(255,255,255,0.12)"
    },
    sidebar: {
      main: "#111116",
      text: "#ffffff",
      hover: "rgba(255,255,255,0.08)",
      active: "rgba(255,255,255,0.12)",
      border: "rgba(255,255,255,0.08)",
    },

    courseStatus: {
      pending: "#ed6c02",
      published: "#2e7d32",
      rejected: "#d32f2f",
    },
    banner: {
      background: `
        radial-gradient(
          circle at top left,
          #8a2be2,
          #4b0082
        )
      `,
      accent: "#6A0DAD",
      highlight: "#ffffff",
    },

  },
  cssVariables: true,
});
export default theme;