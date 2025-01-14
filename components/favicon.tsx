"use client";
import { useEffect, useState } from "react";

const Favicon: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", (e) => setIsDarkMode(e.matches));
  }, []);

  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    link.href = isDarkMode ? "/icon/favicon-dark.ico" : "/icon/favicon.ico";
    const newElement = document.createElement("link");
    newElement.rel = "icon";
    newElement.href = link.href;
    document.head.append(newElement);
  }, [isDarkMode]);

  return <></>;
};

export default Favicon;
