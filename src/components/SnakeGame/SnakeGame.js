import { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import AppleSvg from "./assets/apple.svg";
import AvocadoSvg from "./assets/avocado.svg";
import BurgerSvg from "./assets/burger.svg";
import CheeseSvg from "./assets/cheese.svg";
import GrapesSvg from "./assets/grapes.svg";
import SnakeHeadSvg from "./assets/snake-head.svg";
import SnakeBodySvg from "./assets/snake-body.svg";
import SnakeBodyCornerSvg from "./assets/snake-body-corner.svg";

const SnakeGame = (props) => {
  // game
  const [gameOver, setGameOver] = useState(false);
  const gridWidth = 21;
  const gridHeight = 21;
  const requestAnimationFrameRef = useRef();
  const previousTimeRef = useRef(0);
  const gameSpeed = 150; // game refresh rate in milliseconds
  const snakeWrap = true; // should the snake die when it hits a all or die

  // direction
  const initialDirection = "right";
  const previousDirection = useRef(initialDirection);
  const [direction, setDirection] = useState(initialDirection);

  // snake
  const initialSnake = [
    { x: 2, y: 10, direction: "right" },
    { x: 2, y: 9, direction: "down" },
    { x: 2, y: 8, direction: "down" },
    { x: 2, y: 7, direction: "down" },
  ];
  const [snakeBody, setSnakeBody] = useState(initialSnake);
  const snakeGrowAmount = 2; // how much does the snake grow when it eats food

  // food
  const initalFood = { x: 10, y: 10 };
  const [foodPos, setFoodPos] = useState(initalFood);

  // game loop
  useEffect(() => {
    requestAnimationFrameRef.current = requestAnimationFrame(animate);
    window.addEventListener("keydown", updateDirection);

    return () => {
      cancelAnimationFrame(requestAnimationFrameRef.current);
      window.removeEventListener("keydown", updateDirection);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, foodPos, direction]);

  const animate = (time) => {
    if (gameOver === true) {
      resetGame();
      return;
    }

    requestAnimationFrameRef.current = requestAnimationFrame(animate);
    const timeDiff = time - previousTimeRef.current;
    if (timeDiff > gameSpeed) {
      previousTimeRef.current = time;
      previousDirection.current = direction;
      updateSnake();
    }
  };

  function resetGame() {
    if (confirm("GAME OVER. <br />play again?")) {
      setSnakeBody(initialSnake);
      setFoodPos(initalFood);
      previousDirection.current = initialDirection;
      setDirection(initialDirection);
      setGameOver(false);
    }
  }

  function updateDirection(e) {
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowDown" ||
      e.key === "Arrow"
    )
      e.preventDefault(); // prevent the page form scrolling when user hits arrow keys

    // let nextDirection = direction;

    // switch (e.key) {
    //   case "ArrowUp":
    //     nextDirection = previousDirection.current !== "down" ? "up" : direction;
    //     break;

    //   case "ArrowRight":
    //     nextDirection =
    //       previousDirection.current !== "left" ? "right" : direction;
    //     break;

    //   case "ArrowDown":
    //     nextDirection = previousDirection.current !== "up" ? "down" : direction;
    //     break;

    //   case "ArrowLeft":
    //     nextDirection =
    //       previousDirection.current !== "right" ? "left" : direction;
    //     break;
    // }
    // setDirection(nextDirection);

    const directionMap = {
      ArrowUp: previousDirection.current !== "down" ? "up" : false,
      ArrowRight: previousDirection.current !== "left" ? "right" : false,
      ArrowDown: previousDirection.current !== "up" ? "down" : false,
      ArrowLeft: previousDirection.current !== "right" ? "left" : false,
    };

    const nextDirection = directionMap[e.key];
    setDirection(nextDirection || direction);
  }

  function updateSnake() {
    let newArr = snakeBody;

    // update position of each snake segment
    for (let i = snakeBody.length - 2; i >= 0; i--) {
      newArr[i + 1] = { ...snakeBody[i] };
    }

    // update position of head
    const positionMap = {
      up: { xy: "y", val: -1 },
      right: { xy: "x", val: 1 },
      down: { xy: "y", val: 1 },
      left: { xy: "x", val: -1 },
    };

    // switch (direction) {
    //   case "up":
    //     newArr[0].y += -1;
    //     break;

    //   case "right":
    //     newArr[0].x += 1;
    //     break;

    //   case "down":
    //     newArr[0].y += 1;
    //     break;

    //   case "left":
    //     newArr[0].x += -1;
    //     break;
    // }

    const axis = positionMap[direction].xy; // are we updateing x or y
    const updateVal = positionMap[direction].val; // what to add to the head value
    newArr[0][axis] += updateVal; // update the head position

    // snake should wrap when hitting a wall
    if (snakeWrap) {
      const minVal = 0;
      const maxVal = axis === "x" ? gridWidth + 1 : gridHeight + 1;
      if (newArr[0][axis] === minVal) {
        newArr[0][axis] = maxVal - 1;
      } else if (newArr[0][axis] === maxVal) {
        newArr[0][axis] = minVal + 1;
      }
    }

    // update direction of head
    newArr[0].direction = direction;

    // if the snake is eating food
    const isSnakeEatingFood = isPosIntersecting(snakeBody[0], foodPos);
    if (isSnakeEatingFood) {
      // expand the snake
      for (let i = 0; i < snakeGrowAmount; i++) {
        newArr.push({ ...newArr[newArr.length - 1] });
      }

      // update the position of the food
      setFoodPos(newFoodPos());
    }

    const isOutsideGrid = isOutside();
    if (isOutsideGrid && !snakeWrap) {
      setGameOver(true);
    }

    const snakeEatItself = isSnakeIntersectItself();
    if (snakeEatItself) {
      console.log("eat itself");
      setGameOver(true);
    }

    setSnakeBody([...newArr]);
  }

  function isPosIntersecting(a, b) {
    const result = a.x === b.x && a.y === b.y;
    return result;
  }

  function isSnakeIntersect(pos) {
    return snakeBody.some((segment) => {
      return isPosIntersecting(segment, pos);
    });
  }

  function newFoodPos() {
    let newPos = null;

    while (newPos === null || isSnakeIntersect(newPos)) {
      newPos = {
        x: getRandomNumBetween(1, gridWidth - 1),
        y: getRandomNumBetween(1, gridHeight - 1),
      };
    }

    return newPos;
  }

  function isSnakeIntersectItself() {
    const snakeHead = snakeBody[0];
    return snakeBody.some((segment, i) => {
      if (i == 0) return; // ignore head of the snake
      return isPosIntersecting(segment, snakeHead);
    });
  }

  function isOutside() {
    const sbakeHead = snakeBody[0];
    return (
      sbakeHead.x < 1 ||
      sbakeHead.y < 1 ||
      sbakeHead.x > gridWidth ||
      sbakeHead.y > gridHeight
    );
  }

  return (
    <>
      <GlobalStyle />
      <GameBoard width={gridWidth} height={gridHeight}>
        <Snake body={[...snakeBody]} />
        <Food pos={foodPos} />
      </GameBoard>
      <pre>{snakeBody.map((item) => `x:${item.x} y: ${item.y} \n`)}</pre>
      <p>gane over: {gameOver ? "true" : "false"}</p>
    </>
  );
};

export default SnakeGame;

////////////////////////////////////////////////////////////////////////////////

// Global Styles //////////////////////

const GlobalStyle = createGlobalStyle``;

// Game
const GameBoard = styled.div.attrs((props) => {
  return {
    style: {
      grid: `repeat(${props.width}, 1fr) / repeat(${props.height}, 1fr)`,
    },
  };
})`
  background-color: ${(props) => (props.theme.isDark ? "black" : "white")};
  width: 100vw;
  aspect-ratio: 1/1;
  max-width: 768px;
  border-radius: 6px;

  display: grid;
`;

// Snake /////////////////////////////
const Snake = (props) => {
  return (
    <>
      {props.body.map(({ x, y, direction }, i) => {
        const isHead = i == 0;
        const isBody = i != 0 && i != props.body.length - 1;
        const isTail = i == props.body.length - 1;

        return (
          <SnakeSegment key={`snake-segment-${i}`} x={x} y={y}>
            {isHead && <SnakeHead direction={direction} />}
            {isBody && (
              <SnakeBody
                direction={direction}
                prevBody={props.body[i - 1]}
                nextBody={props.body[i + 1]}
              />
            )}
            {isTail && <SnakeTail direction={direction} />}
          </SnakeSegment>
        );
      })}
    </>
  );
};

const directionRotateMap = {
  right: "-90deg",
  down: "0deg",
  left: "90deg",
  up: "-180deg",
};

const SnakeSegment = styled.div.attrs((props) => {
  return {
    style: {
      gridColumnStart: props.x,
      gridRowStart: props.y,
    },
  };
})`
  width: 100%;
  height: 100%;

  svg {
    display: block;
  }
`;

const SnakeHead = (props) => {
  return (
    <SnakeHeadOuter direction={props.direction}>
      <SnakeHeadSvg />
    </SnakeHeadOuter>
  );
};

const SnakeHeadOuter = styled.div.attrs((props) => {
  return {
    style: {
      transform: `rotate(${directionRotateMap[props.direction]})`,
    },
  };
})`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;

  svg {
    position: absolute;
    display: block;
    width: 150%;
  }
`;

const SnakeBody = ({ direction, prevBody, nextBody }) => {
  const isBLCorner =
    (direction == "down" && prevBody.direction == "right") ||
    (direction == "left" && prevBody.direction == "up");

  const isBRCorner =
    (direction == "down" && prevBody.direction == "left") ||
    (direction == "right" && prevBody.direction == "up");

  const isTLCorner =
    (direction == "up" && prevBody.direction == "right") ||
    (direction == "left" && prevBody.direction == "down");

  const isTRCorner =
    (direction == "up" && prevBody.direction == "left") ||
    (direction == "right" && prevBody.direction == "down");

  return (
    <SnakeBodyOuter>
      {isBLCorner ? (
        <SnakeBodyCornerSvg />
      ) : isBRCorner ? (
        <SnakeBodyCornerSvg style={{ transform: "rotate(-90deg)" }} />
      ) : isTLCorner ? (
        <SnakeBodyCornerSvg style={{ transform: "rotate(90deg)" }} />
      ) : isTRCorner ? (
        <SnakeBodyCornerSvg style={{ transform: "rotate(-180deg)" }} />
      ) : (
        <SnakeBodySvg
          style={{
            transform:
              (direction == "left" || direction == "right") && "rotate(-90deg)",
          }}
        />
      )}
    </SnakeBodyOuter>
  );
};

const SnakeBodyOuter = styled.div`
  width: 100%;
  height: 100%;

  svg {
    width: 100%;
  }
`;

const SnakeTail = styled.div`
  background: purple;
  width: 100%;
  height: 100%;
`;

// Food ///////////////////////////////
const Food = (props) => {
  const [icon, setIcon] = useState();

  useEffect(() => {
    const foodArray = [
      <AppleSvg key="apple" />,
      <AvocadoSvg key="avo" />,
      <BurgerSvg key="burger" />,
      <CheeseSvg key="cheese" />,
      <GrapesSvg key="grapes" />,
    ];
    const num = getRandomNumBetween(0, foodArray.length);
    setIcon(foodArray[num]);
  }, [props.pos]);

  return <FoodOuter pos={props.pos}>{icon}</FoodOuter>;
};

const FoodOuter = styled.div.attrs((props) => {
  return {
    style: {
      gridColumnStart: props.pos.x,
      gridRowStart: props.pos.y,
    },
  };
})`
  width: 100%;
  height: 100%;

  svg {
    float: left;
    display: block;
    width: 100%;
  }
`;

// Functions ///////////////////////////////
function getRandomNumBetween(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
