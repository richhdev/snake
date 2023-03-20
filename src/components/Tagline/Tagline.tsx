import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import typewriterText from "@/components/typewriterText";
import { clampBuilder } from "@/utils/clamp-generator";

const Tagline = (props: { text: string }) => {
  const [typedText, setTypedText] = useState();
  const runOnce = useRef(false);

  useEffect(() => {
    if (!runOnce.current)
      typewriterText(props.text, setTypedText, { min: 1, max: 200 });
    runOnce.current = true;
  }, [props.text]);

  return <Container>{typedText}</Container>;
};

const clampDefault = { minWidth: "576px", maxWidth: "1200px", root: "16" };
const containerFontSize = clampBuilder({
  minFontSize: "20",
  maxFontSize: "26",
  ...clampDefault,
});

export const Container = styled.div`
  width: 100%;
  height: 25px;
  min-height: 25px;

  margin: 0;
  padding: 0;

  font-family: "InconsolataVariable", -apple-system, BlinkMacSystemFont,
    "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: ${containerFontSize};
  text-align: center;
  color: ${(props) => (props.theme.isDark ? "white" : "black")};
  background: 0;
  outline: none;
  border: 0;
  user-select: none;
`;

export default Tagline;
