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

export const themeColors = [
  {
    linearGradientColorMain: "#3F72AF",
    linearGradientColorMain2: "#112D4E",
    menuLink: "#3aadef",
    bodyColor: "#DBE2EF",
    bodyColor2: "#F9F7F7",
    textColor: "white",
    button: "#0462ffd1",
  },
  {
    linearGradientColorMain: "#6D2323",
    linearGradientColorMain2: "#A31D1D",
    menuLink: "#FFA07A",
    bodyColor: "#E5D0AC",
    bodyColor2: "#FEF9E1",
    textColor: "white",
    button: "#0462ffd1",
  },
  {
    linearGradientColorMain: "#8174A0",
    linearGradientColorMain2: "#441752",
    menuLink: "#FFC0CB",
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
    menuLink: "#000",
    bodyColor: "#CBF1F5",
    bodyColor2: "#E3FDFD",
    textColor: "white",
    button: "#000957",
  },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("appTheme");
    return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
  });

  const [selectedThemeIndex, setSelectedThemeIndex] = useState(() => {
    const savedIndex = localStorage.getItem("selectedThemeIndex");
    return savedIndex !== null ? Number(savedIndex) : 0;
  });

  useEffect(() => {
    localStorage.setItem("appTheme", JSON.stringify(theme));
    localStorage.setItem("selectedThemeIndex", selectedThemeIndex);
    const root = document.documentElement;
    root.style.setProperty("--linear-gradient-main", theme.linearGradientColorMain);
    root.style.setProperty("--linear-gradient-main-2", theme.linearGradientColorMain2);
    root.style.setProperty("--menu-link-color", theme.menuLink || "");
    root.style.setProperty("--body-color", theme.bodyColor);
    root.style.setProperty("--body-color-2", theme.bodyColor2);
    root.style.setProperty("--text-color", theme.textColor);
    root.style.setProperty("--button-color", theme.button);
  }, [theme, selectedThemeIndex]);

  const changeTheme = (index) => {
    const selectedTheme = themeColors[index];
    setTheme(selectedTheme);
    setSelectedThemeIndex(index);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, selectedThemeIndex, themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};
