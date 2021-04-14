import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "./useInterval";
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS,
} from "./constants";

const App = () => {
  const canvasRef = useRef();
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [directions, setDirections] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameover] = useState(false);
  const [prevSpeed, setPrevSpeed] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const startGame = () => {
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setDirections([0, -1]);
    setSpeed(SPEED);
    setGameover(false);
  };

  const pauseGame = () => {
    if (speed !== null) {
      setPrevSpeed(speed);
      setSpeed(null);
      setIsPaused(true);
    } else {
      setSpeed(prevSpeed);
      setIsPaused(false);
    }
  };

  const endGame = () => {
    setSpeed(null);
    setGameover(true);
  };

  const moveSnake = ({ keyCode }) => {
    keyCode >= 37 && keyCode <= 40 && setDirections(DIRECTIONS[keyCode]);
  };

  // generating random numbers for x and y co-ords in apple array
  const createApple = () =>
    apple.map((_, i) => Math.floor((Math.random() * CANVAS_SIZE[i]) / SCALE));

  // wall collision detection, check if head of snake is colliding with the outside of canvas- piece
  const checkCollision = (piece, snk = snake) => {
    if (
      piece[0] * SCALE >= CANVAS_SIZE[0] ||
      piece[0] < 0 ||
      piece[1] * SCALE >= CANVAS_SIZE[1] ||
      piece[1] < 0
    )
      return true;
    // collision with the snake itself- to detect if we turn around and collide with the tail
    for (const segment of snk) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
    }

    return false;
  };

  const checkAppleCollision = (newSnake) => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = createApple();
      while (checkCollision(newApple, newSnake)) {
        newApple = createApple();
      }
      setApple(newApple);
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    const snakeCopy = [...snake];
    const newSnakeHead = [
      snakeCopy[0][0] + directions[0],
      snakeCopy[0][1] + directions[1],
    ];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (checkAppleCollision(snakeCopy)) {
      // do nothing because snake needs to grow when colliding with apple
    } else {
      snakeCopy.pop();
      // pop becuase if you ahven't collided witht eh apple the game continues, ie the back of the snake gets knocked off
      // and an additional point gets added in front
    }
    setSnake(snakeCopy);
  };

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);
    context.fillStyle = "pink";
    snake.forEach(([x, y]) => {
      context.fillRect(x, y, 1, 1);
    });
    context.fillStyle = "lightblue";
    context.fillRect(apple[0], apple[1], 1, 1);
  }, [snake, apple, gameOver]);

  useInterval(() => gameLoop(), speed);

  return (
    <div role="button" tabIndex="0" onKeyDown={(e) => moveSnake(e)}>
      <canvas
        style={{ border: "2px solid darkBlue" }}
        ref={canvasRef}
        width={`${CANVAS_SIZE[0]}px`}
        height={`${CANVAS_SIZE[1]}px`}
      />
      {gameOver && <div>GAME OVER! </div>}
      <button onClick={startGame}>Start Game</button>
      <button onClick={pauseGame}>{isPaused ? `Resume` : `Pause`} Game</button>
    </div>
  );
};

export default App;
