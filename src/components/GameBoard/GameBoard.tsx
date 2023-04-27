import styled from "styled-components";

const GameBoard = styled.div.attrs((props: GameBoardProps) => {
  return {
    style: {
      grid: `repeat(${props.width}, 1fr) / repeat(${props.height}, 1fr)`,
    },
  };
})<GameBoardProps>`
  background-color: ${(props) => (props.theme.isDark ? "black" : "white")};
  width: 100vw;
  aspect-ratio: 1/1;
  max-width: 768px;
  border-radius: 6px;

  display: grid;
`;

type GameBoardProps = { width: number; height: number };

export default GameBoard;
