import { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import AppleSvg from "./assets/apple.svg";
import AvocadoSvg from "./assets/avocado.svg";
import BurgerSvg from "./assets/burger.svg";
import CheeseSvg from "./assets/cheese.svg";
import GrapesSvg from "./assets/grapes.svg";
import SnakeHeadSvg from "./assets/snake-head.svg";
import SnakeBodySvg from "./assets/snake-body.svg";
import SnakeBodyCornerSvg from "./assets/snake-body-corner.svg";
import Button from "../Button";
import Text from "../Text";

const SnakeGame = (props) => {
  // faces
  const face1 = useRef();
  const face2 = useRef();
  const face3 = useRef();
  const face4 = useRef();
  const face5 = useRef();
  const face6 = useRef();

  const [activeFace, setActiveFace] = useState(1);
  const activeFaceMap = {
    1: "none",
    2: "rotateY(-90deg)",
    3: "rotateY(-180deg)",
    4: "rotateY(-270deg)",
    5: "rotateX(-90deg)",
    6: "rotateX(90deg)",
  };

  // game
  const [gameState, setGameState] = useState("begin");
  const [gameOver, setGameOver] = useState(false);
  const gridWidth = 21;
  const gridHeight = 21;
  const requestAnimationFrameRef = useRef();
  const previousTimeRef = useRef(0);
  const gameSpeed = 100; // game refresh rate in milliseconds
  const snakeWrap = true; // should the snake die when it hits a all or die

  // direction
  const initialDirection = "right";
  const previousDirection = useRef(initialDirection);
  const [direction, setDirection] = useState(initialDirection);

  // snake
  const initialSnake = [
    { f: 1, x: 3, y: 9, direction: "right" },
    { f: 1, x: 2, y: 9, direction: "down" },
    { f: 1, x: 2, y: 8, direction: "down" },
    { f: 1, x: 2, y: 7, direction: "down" },
  ];
  const [snakeBody, setSnakeBody] = useState(initialSnake);
  const snakeGrowAmount = 2; // how much does the snake grow when it eats food

  // food
  const initalFood = { f: 1, x: 11, y: 9 };
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
  }, [gameState, gameOver, foodPos, direction]);

  const animate = (time) => {
    if (gameState === "begin") {
      return;
    }

    if (gameOver === true) {
      setGameState("end");
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
    setSnakeBody(initialSnake);
    setFoodPos(initalFood);
    previousDirection.current = initialDirection;
    setDirection(initialDirection);
    setGameOver(false);
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

    // update position of each snake segment (excluding head)
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
      let newF = newArr[0].f;

      // change face - horizontal //////
      // face 1 > 2
      if (newArr[0].x === maxVal && newArr[0].f === 1) {
        console.log("1 > 2");
        newF = 2;
      }

      // face 2 < 1
      if (newArr[0].x === minVal && newArr[0].f === 2) {
        console.log("2 < 1");
        newF = 1;
      }

      // face 2 > 3
      if (newArr[0].x === maxVal && newArr[0].f === 2) {
        console.log("2 > 3");
        newF = 3;
      }

      // face 3 < 2
      if (newArr[0].x === minVal && newArr[0].f === 3) {
        console.log("3 < 2");
        newF = 2;
      }

      // face 3 > 4
      if (newArr[0].x === maxVal && newArr[0].f === 3) {
        console.log("3 > 4");
        newF = 4;
      }

      // face 4 < 3
      if (newArr[0].x === minVal && newArr[0].f === 4) {
        console.log("4 < 3");
        newF = 3;
      }

      // face 4 > 1
      if (newArr[0].x === maxVal && newArr[0].f === 4) {
        console.log("4 > 1");
        newF = 1;
      }

      // face 1 < 4
      if (newArr[0].x === minVal && newArr[0].f === 1) {
        console.log("1 < 4");
        newF = 4;
      }

      ///

      // change face - vertical //////

      // face 1 /\ 5
      if (newArr[0].y === minVal && newArr[0].f === 1) {
        console.log("1 /\\ 5");
        newF = 5;
      }

      // face 1 \/ 6
      if (newArr[0].y === maxVal && newArr[0].f === 1) {
        console.log("1 \\/ 6");
        newF = 6;
      }

      // face 5 \/ 1
      if (newArr[0].y === maxVal && newArr[0].f === 5) {
        console.log("5 \\/ 1");
        newF = 1;
      }

      // face 6 /\ 1
      if (newArr[0].y === minVal && newArr[0].f === 6) {
        console.log("6 /\\ 1");
        newF = 1;
      }

      ////

      // face 2 /\ 5 <
      if (newArr[0].y === minVal && newArr[0].f === 2) {
        console.log("2 /\\ 5 <");
        newF = 5;
        // face5.current.style.transform = "rotate(-90deg)";
        // face5.current.style.transition = "transform 100ms ease";

        // const x = newArr[0].x;
        // const y = newArr[0].y;

        // newArr[0].y = 21 - x;
        // newArr[0].x = 21;

        // setDirection("left");
      }

      newArr[0].f = newF;

      ///////////////

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
      <Outer>
        <GlobalStyle />

        {gameState === "begin" && (
          <GameModal>
            <Button onClick={() => setGameState("playing")}>Start Game</Button>
          </GameModal>
        )}

        {gameState === "end" && (
          <GameModal>
            <center>
              <Text>Better luck next time</Text>
              <br />
              <Button
                onClick={() => {
                  resetGame();
                  setGameState("playing");
                }}
              >
                Start again
              </Button>
            </center>
          </GameModal>
        )}

        <div>
          <div>
            <GameBoard ref={face5} width={gridWidth} height={gridHeight}>
              <Snake body={[...snakeBody]} face={5} />
              <Food pos={foodPos} />
            </GameBoard>
          </div>
          <div style={{ display: "flex" }}>
            <GameBoard ref={face1} width={gridWidth} height={gridHeight}>
              <Snake body={[...snakeBody]} face={1} />
              <Food pos={foodPos} />
            </GameBoard>
            <GameBoard ref={face2} width={gridWidth} height={gridHeight}>
              <Snake body={[...snakeBody]} face={2} />
              <Food pos={foodPos} />
            </GameBoard>
            <GameBoard ref={face3} width={gridWidth} height={gridHeight}>
              <Snake body={[...snakeBody]} face={3} />
              <Food pos={foodPos} />
            </GameBoard>
            <GameBoard ref={face4} width={gridWidth} height={gridHeight}>
              <Snake body={[...snakeBody]} face={4} />
              <Food pos={foodPos} />
            </GameBoard>
          </div>
          <div>
            <GameBoard ref={face6} width={gridWidth} height={gridHeight}>
              <Snake body={[...snakeBody]} face={6} />
              <Food pos={foodPos} />
            </GameBoard>
          </div>
        </div>

        <div>
          <Scene>
            <Cube style={{ transform: activeFaceMap[activeFace] }}>
              <GameBoard
                ref={face5}
                width={gridWidth}
                height={gridHeight}
                className="face face5"
              >
                <Snake body={[...snakeBody]} face={5} />
                <Food pos={foodPos} />
              </GameBoard>
              <GameBoard
                ref={face1}
                width={gridWidth}
                height={gridHeight}
                className="face face1"
              >
                <Snake body={[...snakeBody]} face={1} />
                <Food pos={foodPos} />
              </GameBoard>
              <GameBoard
                ref={face2}
                width={gridWidth}
                height={gridHeight}
                className="face face2"
              >
                <Snake body={[...snakeBody]} face={2} />
                <Food pos={foodPos} />
              </GameBoard>
              <GameBoard
                ref={face3}
                width={gridWidth}
                height={gridHeight}
                className="face face3"
              >
                <Snake body={[...snakeBody]} face={3} />
                <Food pos={foodPos} />
              </GameBoard>
              <GameBoard
                ref={face4}
                width={gridWidth}
                height={gridHeight}
                className="face face4"
              >
                <Snake body={[...snakeBody]} face={4} />
                <Food pos={foodPos} />
              </GameBoard>
              <GameBoard
                ref={face6}
                width={gridWidth}
                height={gridHeight}
                className="face face6"
              >
                <Snake body={[...snakeBody]} face={6} />
                <Food pos={foodPos} />
              </GameBoard>
            </Cube>
          </Scene>

          <br />
          <br />
          <br />
          <br />

          <div
            style={{
              width: "400px",
              display: "grid",
              grid: "1fr / repeat(6,1fr)",
              gap: "4px",
            }}
          >
            <Button onClick={() => setActiveFace(1)}>1</Button>
            <Button onClick={() => setActiveFace(2)}>2</Button>
            <Button onClick={() => setActiveFace(3)}>3</Button>
            <Button onClick={() => setActiveFace(4)}>4</Button>
            <Button onClick={() => setActiveFace(5)}>5</Button>
            <Button onClick={() => setActiveFace(6)}>6</Button>
          </div>
        </div>
      </Outer>

      <pre>
        {snakeBody.map((item) => `f:${item.f} x:${item.x} y: ${item.y} \n`)}
      </pre>

      {/* <p>gane over: {gameOver ? "true" : "false"}</p>
      <p>direction: {direction}</p> */}
    </>
  );
};

export default SnakeGame;

////////////////////////////////////////////////////////////////////////////////

// Global Styles //////////////////////

const GlobalStyle = createGlobalStyle``;

// Game
const GameBoard = styled.div.attrs((props) => {
  // return {
  //   style: {
  //     grid: `repeat(${props.width}, 1fr) / repeat(${props.height}, 1fr)`,
  //   },
  // };
})`
  /* background-color: ${(props) =>
    props.theme.isDark ? "black" : "white"}; */
  width: 100vw;
  aspect-ratio: 1/1;
  max-width: 768px;
  /* border-radius: 6px; */

  display: grid;
  grid: repeat(21, 1fr) / repeat(21, 1fr);

  width: 250px;
  border: 1px solid green;
`;

// Snake /////////////////////////////
const Snake = (props) => {
  return (
    <>
      {props.body.map(({ f, x, y, direction }, i) => {
        const isHead = i == 0;
        const isBody = i != 0 && i != props.body.length - 1;
        const isTail = i == props.body.length - 1;

        if (props.face !== f) return;

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

function closestNumber(n, m) {
  // find the quotient
  let q = parseInt(n / m);

  // 1st possible closest number
  let n1 = m * q;

  // 2nd possible closest number
  let n2 = n * m > 0 ? m * (q + 1) : m * (q - 1);

  // if true, then n1 is the
  // required closest number
  if (Math.abs(n - n1) < Math.abs(n - n2)) return n1;

  // else n2 is the required
  // closest number
  return n2;
}

// game state ////
const Outer = styled.div`
  position: relative;
`;

const GameModal = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: ${(props) =>
    props.theme.isDark ? `rgba(0, 0, 0, 0.9)` : `rgba(255, 255, 255, 0.9)`};
  /* border-radius: 6px; */

  display: grid;
  place-items: center;
`;

////////////////////////////////////////////////////////////////////////////////

const size = 250;
const Scene = styled.div`
  width: ${size}px;
  height: ${size}px;
  z-index: 1000;
  perspective: calc(400 * 1px);
  perspective-origin: 50% 50%;
`;

const rotate = keyframes`

  from {
    transform: translateZ(-100px) rotateY(calc(0 * 1deg));
  }

  to {
    transform: translateZ(-100px) rotateY(calc(-360 * 1deg));
  }
  

`;

const Cube = styled.div`
  width: ${size}px;
  height: ${size}px;
  transform-style: preserve-3d;
  position: relative;
  /* animation: linear 20000ms infinite ${rotate}; */
  transition: transform 300ms ease;

  .face {
    width: 100%;
    height: 100%;
    position: absolute;
    border: 1px solid black;
  }

  .face1 {
    transform: rotateY(0deg) translateZ(${size / 2}px);
  }

  .face2 {
    transform: rotateY(90deg) translateZ(${size / 2}px);
  }

  .face3 {
    transform: rotateY(180deg) translateZ(${size / 2}px);
  }

  .face4 {
    transform: rotateY(-90deg) translateZ(${size / 2}px);
  }

  .face5 {
    transform: rotateX(90deg) translateZ(${size / 2}px);
  }

  .face6 {
    transform: rotateX(-90deg) translateZ(${size / 2}px);
  }
`;
