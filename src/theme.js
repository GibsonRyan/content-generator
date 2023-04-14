import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#4c5463",
      secondary: "#a0a8b6",
      dark: "#282c34",
    },
    primary: {
      main: "#BAFF39",
    },
    secondary: {
      main: "#FF595A",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#282c34",
    }
  },
});

export default theme;
