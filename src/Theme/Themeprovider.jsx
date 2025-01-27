// ThemeContext.js
import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const defaultTheme = {
  linearGradientColorMain: "#112D4E",
  linearGradientColorMain2: "#3F72AF",
  bodyColor: "#DBE2EF",
  bodyColor2: "#F9F7F7",
  textColor: "white",
  button: "#0462ffd1",
};

const themeColors = [
  {
    linearGradientColorMain: "#3F72AF",
    linearGradientColorMain2: "#112D4E",
    menuLink: "#3aadef", // Light complementary blue
    bodyColor: "#DBE2EF",
    bodyColor2: "#F9F7F7",
    textColor: "white",
    button: "#0462ffd1",
  },
  {
    linearGradientColorMain: "#6D2323",
    linearGradientColorMain2: "#A31D1D",
    menuLink: "#FFA07A", // Warm salmon color for contrast
    bodyColor: "#E5D0AC",
    bodyColor2: "#FEF9E1",
    textColor: "white",
    button: "#0462ffd1",
  },
  {
    linearGradientColorMain: "#8174A0",
    linearGradientColorMain2: "#441752",
    menuLink: "#FFC0CB", // Light pink for harmony
    bodyColor: "#A888B5",
    bodyColor2: "#EFB6C8",
    textColor: "white",
    button: "#0462ffd1",
  },
  {
    linearGradientColorMain: "#3E7B27",
    linearGradientColorMain2: "#123524",
    menuLink: "#EFE3C2",
    bodyColor: "#EFE3C2",
    bodyColor2: "#85A947",
    textColor: "white",
    button: "#0462ffd1",
  },
  {
    linearGradientColorMain: "#71C9CE",
    linearGradientColorMain2: "#71C9CE",
    menuLink: "#000", // Soft mint green for balance
    bodyColor: "#CBF1F5",
    bodyColor2: "#E3FDFD",
    textColor: "white",
    button: "#000957",
  },
  {
    linearGradientColorMain: "#F93827",
    linearGradientColorMain2: "#FF9D23",
    bodyColor: "#FFD65A",
    bodyColor2: "#16C47F",
    textColor: "white",
    button: "#000957",
  },
  {
    linearGradientColorMain: "#F14A00",
    linearGradientColorMain2: "#C62300",
    bodyColor: "#500073",
    bodyColor2: "#2A004E",
    textColor: "white",
    button: "#000957",
  },
  {
    linearGradientColorMain: "#E8E7AB",
    linearGradientColorMain2: "#F2AE66",
    bodyColor: "#E82561",
    bodyColor2: "#C30E59",
    textColor: "white",
    button: "#000957",
  },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("appTheme");
    return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem("appTheme", JSON.stringify(theme));
    const root = document.documentElement;

    // Set CSS variables dynamically
    root.style.setProperty(
      "--linear-gradient-main",
      theme.linearGradientColorMain
    );
    root.style.setProperty(
      "--linear-gradient-main-2",
      theme.linearGradientColorMain2
    );
    root.style.setProperty("--menu-link-color", theme.menuLink);
    root.style.setProperty("--body-color", theme.bodyColor);
    root.style.setProperty("--body-color-2", theme.bodyColor2);
    root.style.setProperty("--text-color", theme.textColor);
    root.style.setProperty("--button-color", theme.button);
  }, [theme]);

  const changeTheme = (index) => {
    const selectedTheme = themeColors[index];
    setTheme(selectedTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
