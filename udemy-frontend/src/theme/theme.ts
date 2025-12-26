import { createTheme } from "@mui/material/styles";

const udemyPurple = "#6A0DAD";

const theme = createTheme({
  palette: {
    primary: {
      main: udemyPurple,
      light: "#8a2be2",
      dark: "#4b0082",
      contrastText: "#ffffff"
    },
    secondary: {
      main: "#ffffff"
    }
  },
});

export default theme;
