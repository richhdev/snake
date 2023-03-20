import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import Head from "next/head";
import GlobalMeta from "@/components/GlobalMeta";
import { themeDark, themeLight } from "@/theme";
import ThemeSwitch from "@/components/ThemeSwitch";
import GradientBackground from "@/components/GradientBackground";
import {
  Footer,
  Header,
  IconLink,
  Main,
  Outer,
  StartButton,
} from "./_components";
import GithubSvg from "@/images/github-icon.svg";
import Tagline from "@/components/Tagline";
import SnakeGame from "@/components/SnakeGame";

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
          <Header>
            <ThemeSwitch callback={setThemeSwitch} />
          </Header>
          <Main>
            <div>
              <Tagline text={"<SnakeJs />"} /> <br />
              <StartButton>Start</StartButton>
            </div>
            <div>
              <SnakeGame />
            </div>
          </Main>
          <Footer>
            <IconLink
              href="https://github.com/richhdev/richh-nextjs-starter"
              target="_blank"
              aria-label="github"
            >
              <GithubSvg role="img" alt="github" />
            </IconLink>
          </Footer>
        </Outer>
        <GradientBackground />
      </ThemeProvider>
    </>
  );
}
