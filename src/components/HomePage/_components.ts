import styled from "styled-components";
import { navBarHeight } from "../NavBar/NavBar";

export const Outer = styled.div`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Main = styled.main`
  padding-top: ${navBarHeight};
  height: 100vh;
`;
