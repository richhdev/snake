import styled from "styled-components";
import Button from "../Button";
import ArrowUpSvg from "./assets/arrow-up.svg";
import ArrowLeftSvg from "./assets/arrow-left.svg";
import ArrowDownSvg from "./assets/arrow-down.svg";
import ArrowRightSvg from "./assets/arrow-right.svg";

const TouchControls = (props: { updateDirection: Function }) => {
  return (
    <TouchContolsGrid>
      <div></div>
      <Button
        onClick={() => {
          props.updateDirection("ArrowUp");
        }}
      >
        <ArrowUpSvg />
      </Button>
      <div></div>
      <Button
        onClick={() => {
          props.updateDirection("ArrowLeft");
        }}
      >
        <ArrowLeftSvg />
      </Button>
      <Button
        onClick={() => {
          props.updateDirection("ArrowDown");
        }}
      >
        <ArrowDownSvg />
      </Button>
      <Button
        onClick={() => {
          props.updateDirection("ArrowRight");
        }}
      >
        <ArrowRightSvg />
      </Button>
    </TouchContolsGrid>
  );
};

export default TouchControls;

const TouchContolsGrid = styled.div`
  display: none;

  @media (hover: none) and (pointer: coarse) {
    display: grid;
    grid: 1fr 1fr / 1fr 1fr 1fr;
    gap: 8px;
    text-align: center;

    svg {
      display: block;
    }
  }
`;
