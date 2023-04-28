import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getRandomNumBetween } from "@/utils/getRandomNumBetween";
import Button from "../Button";
import Text from "../Text";
import GameBoard from "../GameBoard";
import Snake from "../Snake";
import Food from "../Food";
import TouchControls from "../TouchControls";
import Tagline from "../Tagline";

const SnakeGame = () => {
  // game
  const [gameState, setGameState] = useState("begin");
  const [gameOver, setGameOver] = useState(false);
  const gridWidth = 21;
  const gridHeight = 21;
  const requestAnimationFrameRef = useRef(0);
  const previousTimeRef = useRef(0);
  const initialGameSpeed = 250;
  const [gameSpeed, setGameSpeed] = useState(initialGameSpeed); // game refresh rate in milliseconds
  const snakeWrap = true; // should the snake die when it hits a all or die
  const [score, setScore] = useState(0);

  // direction
  const initialDirection = "down";
  const previousDirection = useRef(initialDirection);
  const [direction, setDirection] = useState<"up" | "right" | "down" | "left">(
    initialDirection
  );

  // snake
  const initialSnake: Array<{
    x: number;
    y: number;
    direction: "up" | "down" | "left" | "right";
  }> = [
    { x: 11, y: 4, direction: "down" },
    { x: 11, y: 3, direction: "down" },
    { x: 11, y: 2, direction: "down" },
    { x: 11, y: 1, direction: "down" },
  ];
  const [snakeBody, setSnakeBody] = useState(initialSnake);
  const snakeGrowAmount = 2; // how much does the snake grow when it eats food

  // food
  const initalFood = { x: 11, y: 9 };
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

  const animate = (time: number) => {
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
    setGameSpeed(initialGameSpeed);
    setScore(0);
    setGameOver(false);
  }

  // keyboard input
  function updateDirection(e: KeyboardEvent) {
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft"
    ) {
      e.preventDefault(); // prevent the page form scrolling when user hits up / down keys

      const directionMap = {
        ArrowUp: previousDirection.current !== "down" ? "up" : false,
        ArrowRight: previousDirection.current !== "left" ? "right" : false,
        ArrowDown: previousDirection.current !== "up" ? "down" : false,
        ArrowLeft: previousDirection.current !== "right" ? "left" : false,
      };

      const nextDirection = directionMap[e.key];
      if (
        nextDirection === "up" ||
        nextDirection === "right" ||
        nextDirection === "down" ||
        nextDirection === "left"
      ) {
        setDirection(nextDirection);
      }
    }
  }

  // touch controls
  function updateDirectionTouch(
    newDir: "ArrowUp" | "ArrowRight" | "ArrowDown" | "ArrowLeft"
  ) {
    const directionMap = {
      ArrowUp: previousDirection.current !== "down" ? "up" : false,
      ArrowRight: previousDirection.current !== "left" ? "right" : false,
      ArrowDown: previousDirection.current !== "up" ? "down" : false,
      ArrowLeft: previousDirection.current !== "right" ? "left" : false,
    };

    const nextDirection = directionMap[newDir];
    if (
      nextDirection === "up" ||
      nextDirection === "right" ||
      nextDirection === "down" ||
      nextDirection === "left"
    ) {
      setDirection(nextDirection);
    }
  }

  function updateSnake() {
    let newArr = snakeBody;

    // update position of each snake segment (except head)
    for (let i = snakeBody.length - 2; i >= 0; i--) {
      newArr[i + 1] = { ...snakeBody[i] };
    }

    // update position of head
    const positionMap: {
      up: { xy: "y"; val: -1 };
      right: { xy: "x"; val: 1 };
      down: { xy: "y"; val: 1 };
      left: { xy: "x"; val: -1 };
    } = {
      up: { xy: "y", val: -1 },
      right: { xy: "x", val: 1 },
      down: { xy: "y", val: 1 },
      left: { xy: "x", val: -1 },
    };

    const axis: "x" | "y" = positionMap[direction].xy; // are we updateing x or y
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

      setScore(score + 1);
      setGameSpeed(gameSpeed - 5);

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

  function isPosIntersecting(
    a: { x: number; y: number },
    b: { x: number; y: number }
  ) {
    const result = a.x === b.x && a.y === b.y;
    return result;
  }

  function isSnakeIntersect(pos: { x: number; y: number }) {
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
        <Inner>
          {gameState === "begin" && (
            <GameModal>
              <Button onClick={() => setGameState("playing")}>
                Start Game
              </Button>
            </GameModal>
          )}

          {gameState === "end" && (
            <GameModal>
              <div>
                <Tagline text="Better luck next time" />
                <br />
                <br />
                <Button
                  onClick={() => {
                    resetGame();
                    setGameState("playing");
                  }}
                >
                  Start again
                </Button>
              </div>
            </GameModal>
          )}

          <GameBoard width={gridWidth} height={gridHeight}>
            <Snake body={[...snakeBody]} />
            <Food pos={foodPos} />
          </GameBoard>
        </Inner>
        <br />
        <Text style={{ textAlign: "center" }}>Score: {score}</Text>
      </Outer>

      <TouchControls updateDirection={updateDirectionTouch} />
    </>
  );
};

export default SnakeGame;

const Outer = styled.div`
  padding: 8px;
`;

const Inner = styled.div`
  position: relative;
`;

const GameModal = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: ${(props) =>
    props.theme.isDark ? `rgba(0, 0, 0, 0.9)` : `rgba(255, 255, 255, 0.9)`};
  border-radius: 6px;
  text-align: center;

  display: grid;
  place-items: center;
`;
