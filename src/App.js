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

  const startGame = () => {};

  const pauseGame = () => {};

  const endGame = () => {};

  const moveSnake = ({ keyCode }) => {
    keyCode >= 37 && keyCode <= 40 && setDirections(DIRECTIONS[keyCode]);
  };

  const createApple = () => {};

  const checkCollision = () => {};

  const checkAppleCollision = () => {};

  const gameLoop = () => {
    // const snakeCopy = JSON.parse(JSON.stringify(snake));
    const snakeCopy = [...snake];
    const newSnakeHead = [
      snakeCopy[0][0] + directions[0],
      snakeCopy[0][1] + directions[1],
    ];
    snakeCopy.unshift(newSnakeHead);
    snakeCopy.pop();
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
      <button onClick={pauseGame}>Pause Game</button>
    </div>
  );
};

export default App;
