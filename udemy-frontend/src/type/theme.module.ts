import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    sidebar: {
      main: string;
      text: string;
      hover: string;
      active: string;
      border: string;
    };

    courseStatus: {
      pending: string;
      published: string;
      rejected: string;
    };
    banner: {
      background: string;
      accent: string;
      highlight: string;
    };
  }

  interface PaletteOptions {
    sidebar?: {
      main: string;
      text: string;
      hover: string;
      active: string;
      border: string;
    };

    courseStatus?: {
      pending: string;
      published: string;
      rejected: string;
    };
    banner?: {
      background: string;
      accent: string;
      highlight: string;
    };
  }
}
