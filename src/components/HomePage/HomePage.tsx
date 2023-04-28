import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import Head from "next/head";
import GlobalMeta from "@/components/GlobalMeta";
import { themeDark, themeLight } from "@/theme";
import GradientBackground from "@/components/GradientBackground";
import { Outer, Main } from "./_components";
import Game from "@/components/Game";
import NavBar from "../NavBar";

export default function Home() {
  const [theme, setTheme] = useState(themeLight);
  const [themeSwitch, setThemeSwitch] = useState<"auto" | "light" | "dark">(
    "auto"
  );

  useEffect(() => {
    const themeMap = {
      auto: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? themeDark
        : themeLight,
      light: themeLight,
      dark: themeDark,
    };
    setTheme(themeMap[themeSwitch]);
  }, [themeSwitch]);

  return (
    <>
      <Head>
        <title>Snake JS - Richh</title>
        <meta name="description" content="Richh NextJS Starter" />
        <GlobalMeta />
      </Head>
      <ThemeProvider theme={theme}>
        <Outer>
          <NavBar setThemeSwitch={setThemeSwitch} />
          <Main>
            <Game />
          </Main>
        </Outer>
        <GradientBackground />
      </ThemeProvider>
    </>
  );
}
