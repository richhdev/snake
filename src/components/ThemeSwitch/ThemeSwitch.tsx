import { useState } from "react";
import styled from "styled-components";
import { clampBuilder } from "@/utils/clamp-generator";
import AutoSvg from "./images/auto.svg";
import LightSvg from "./images/light.svg";
import DarkSvg from "./images/dark.svg";
import { ThemeSwitchProps, ThemeMapArray } from "./types";

const ThemeSwitch = (props: ThemeSwitchProps) => {
  const [themeIndex, setThemeIndex] = useState(0);

  return (
    <Outer
      onClick={() => {
        const i = themeIndex === themeMap.length - 1 ? 0 : themeIndex + 1;
        setThemeIndex(i);
        props.callback(themeMap[i].name);
      }}
    >
      {themeMap[themeIndex].icon}
    </Outer>
  );
};

export default ThemeSwitch;

const themeMap: ThemeMapArray = [
  {
    name: "auto",
    icon: <AutoSvg alt="auto" />,
  },
  {
    name: "light",
    icon: <LightSvg alt="light" />,
  },
  {
    name: "dark",
    icon: <DarkSvg alt="dark" />,
  },
];

const clampDefault = { minWidth: "576px", maxWidth: "1200px", root: "16" };
const outerPadding = clampBuilder({
  minFontSize: "8",
  maxFontSize: "11",
  ...clampDefault,
});
const svgSize = clampBuilder({
  minFontSize: "16",
  maxFontSize: "22",
  ...clampDefault,
});

const Outer = styled.div`
  padding: ${outerPadding};
  color: ${(props) => props.theme.color || "#fff"};
  background: ${(props) => props.theme.backgroundColor || "#000"};
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  transition: opacity 300ms ease;

  svg {
    display: block;
    width: ${svgSize};
    height: ${svgSize};
  }
`;
