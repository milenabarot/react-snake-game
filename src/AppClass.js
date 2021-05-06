import React from "react";
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS,
} from "./constants";
import upArrow from "./images/upArrow.png";
import downArrow from "./images/downArrow.png";
import rightArrow from "./images/rightArrow.png";
import leftArrow from "./images/leftArrow.png";
import pauseIcon from "./images/pauseIcon.png";

import "../src/styles/app.css";
import createReactClass from "create-react-class";

const keys = [
  { text: "Up", icon: upArrow },
  { text: "Down", icon: downArrow },
  { text: "Right", icon: rightArrow },
  { text: "Left", icon: leftArrow },
  { text: "Pause", icon: pauseIcon },
];

const AppClass = createReactClass({
  getInitialState() {
    this.canvasRef = React.createRef();
    return {
      snake: SNAKE_START,
      apple: APPLE_START,
      directions: [0, -1],
      speed: SPEED,
      gameover: false,
      prevSpeed: null,
      isPaused: false,
    };
  },

  componentDidMount() {
    this.createCanvas();
    this.pauseGame();
  },

  startGame(event) {
    this.setState({
      snake: SNAKE_START,
      apple: APPLE_START,
      directions: [0, -1],
      speed: SPEED,
      gameover: false,
    });
    this.interval = setInterval(this.gameLoop, SPEED);
  },

  // Used setInterval passing in gameloop and speed, had to assign it to this.interval, so I could call it
  // in pausegame to clear the interval

  pauseGame() {
    if (this.state.speed !== null) {
      clearInterval(this.interval);
      this.setState({
        prevSpeed: this.state.speed,
        speed: null,
        isPaused: true,
      });
    } else {
      this.setState({
        speed: this.state.prevSpeed,
        isPaused: false,
      });
      this.interval = setInterval(this.gameLoop, this.state.prevSpeed);
    }
  },

  pauseOnPKey(event) {
    if (event.key === "p") {
      this.pauseGame();
    }
  },

  endGame() {
    this.setState({
      speed: null,
      gameover: true,
    });
  },

  moveSnake({ keyCode }) {
    const { directions } = this.state;
    if (keyCode === 40 && String([directions]) === String([0, -1])) {
      return;
    } else if (keyCode === 37 && String([directions]) === String([1, 0])) {
      return;
    } else if (keyCode === 39 && String([directions]) === String([-1, 0])) {
      return;
    } else if (keyCode === 38 && String([directions]) === String([0, 1])) {
      return;
    } else {
      keyCode >= 37 &&
        keyCode <= 40 &&
        this.setState({ directions: DIRECTIONS[keyCode] });
    }
  },

  createApple() {
    return this.state.apple.map((_, i) =>
      Math.floor((Math.random() * CANVAS_SIZE[i]) / SCALE)
    );
  },

  checkCollision(piece, snk = this.state.snake) {
    if (
      piece[0] * SCALE >= CANVAS_SIZE[0] ||
      piece[0] < 0 ||
      piece[1] * SCALE >= CANVAS_SIZE[1] ||
      piece[1] < 0
    )
      return true;
    for (const segment of snk) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
    }

    return false;
  },

  checkAppleCollision(newSnake) {
    const { apple } = this.state;
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = this.createApple();
      while (this.checkCollision(newApple, newSnake)) {
        newApple = this.createApple();
      }
      this.setState({ apple: newApple });
      return true;
    }
    return false;
  },

  gameLoop() {
    const snakeCopy = [...this.state.snake];
    const newSnakeHead = [
      snakeCopy[0][0] + this.state.directions[0],
      snakeCopy[0][1] + this.state.directions[1],
    ];
    snakeCopy.unshift(newSnakeHead);
    if (this.checkCollision(newSnakeHead)) {
      return this.endGame();
    }
    if (this.checkAppleCollision(snakeCopy)) {
    } else {
      snakeCopy.pop();
    }
    this.setState({ snake: snakeCopy });
  },

  createCanvas() {
    const context = this.canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);

    this.state.snake.forEach(([x, y], index) => {
      context.fillStyle = index % 2 === 0 ? "pink" : "purple";
      context.fillRect(x, y, 1, 1);
    });
    context.fillStyle =
      this.state.snake.length % 2 === 0 ? "mediumseagreen" : "crimson";
    context.fillRect(this.state.apple[0], this.state.apple[1], 1, 1);
  },

  componentDidUpdate(_, prevState) {
    const appleChanged =
      String([this.state.apple]) !== String([prevState.apple]);
    const snakeChanged =
      String([this.state.snake]) !== String([prevState.snake]);
    const gameoverChanged = this.state.gameover !== prevState.gameover;

    if (appleChanged || snakeChanged || gameoverChanged) {
      this.createCanvas();
    }
  },

  render() {
    return (
      <div
        className="gameWrap"
        role="button"
        tabIndex="0"
        onKeyDown={this.moveSnake}
        onKeyPress={this.pauseOnPKey}
      >
        {this.state.gameover && <p className="gameOver">GAME OVER! </p>}
        <canvas
          ref={this.canvasRef}
          width={`${CANVAS_SIZE[0]}px`}
          height={`${CANVAS_SIZE[1]}px`}
          className="canvas"
        />
        <div className="gameButtonsWrap">
          <button onClick={this.startGame}>Start Game</button>
          <button onClick={this.pauseGame}>
            {this.state.isPaused ? `Resume` : `Pause`} Game
          </button>
        </div>
        <ul className="keys">
          <p>Key</p>
          {keys.map((key) => {
            return (
              <li className="keyItem">
                {key.text}
                <div
                  className="keyImage"
                  style={{ backgroundImage: `url(${key.icon})` }}
                ></div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
});

export default AppClass;
