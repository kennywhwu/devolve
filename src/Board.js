import React, { Component } from 'react';
import './Board.css';
import PlayerSmall from './PlayerSmall';
import PlayerBig from './PlayerBig';

const keyDict = {
  65: { player: 'small', type: 'movement', action: 'left' },
  87: { player: 'small', type: 'movement', action: 'up' },
  68: { player: 'small', type: 'movement', action: 'right' },
  83: { player: 'small', type: 'movement', action: 'down' },
  37: { player: 'big', type: 'movement', action: 'left' },
  38: { player: 'big', type: 'movement', action: 'up' },
  39: { player: 'big', type: 'movement', action: 'right' },
  40: { player: 'big', type: 'movement', action: 'down' }
};

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.createBoard(),
      playerSmallPosition: this.createPlayerSmall(0),
      // // playerBigPosition defined by array of arrays (ie. [[{y1, x1}, {y1, x2}],[{y2, x1},{y2, x2}]]
      playerBigPosition: this.createPlayerBig()
    };
    this.registerKeyPress = this.registerKeyPress.bind(this);
    // this.movePlayerSmall = this.movePlayerSmall.bind(this);
    // this.movePlayerBig = this.movePlayerBig.bind(this);
    this.move = this.move.bind(this);
    window.document.addEventListener('keydown', this.registerKeyPress);
    this.p1Ready = true;
    this.p1Delay = 0;
    this.p2Ready = true;
    this.p2Delay = 300;
  }

  static defaultProps = {
    xDimension: 15,
    yDimension: 15,
    playerSmallSize: 1,
    playerBigSize: 2
  };

  // Initializes board populated with 0's based on provided dimensions
  createBoard() {
    let board = Array.from({ length: this.props.yDimension }).map((e1, y) => {
      return Array.from({ length: this.props.xDimension }).map((e2, x) => {
        return 0;
      });
    });
    return board;
  }

  // Initializes creation and placement of playerBig
  createPlayerBig() {
    let dimension = this.props.playerBigSize;

    return Array.from({ length: dimension }).map((e1, i1) =>
      Array.from({ length: dimension }).map((e2, i2) => ({
        y: i1,
        x: this.props.xDimension - (dimension - i2)
      }))
    );
  }

  // Initializes creation and placement of playerBig
  createPlayerSmall(num) {
    let dimension = this.props.playerSmallSize;

    return Array.from({ length: dimension }).map((e1, i1) =>
      Array.from({ length: dimension }).map((e2, i2) => ({
        y: this.props.yDimension - (dimension - i1) - num,
        x: i2 + num
      }))
    );
  }

  // General function to call function based on keypress
  registerKeyPress(evt) {
    let keyDef = keyDict[evt.keyCode.toString()];
    if (keyDef.type === 'movement') {
      this.move(keyDef.player, keyDef.action);
    }
  }

  // Sets delay on player movement
  async move(player, direction) {
    if (player === 'small') {
      if (this.p1Ready) {
        this.p1Ready = false;
        await setTimeout(() => {
          this.p1Ready = true;
          this.movePlayer(player, direction);
        }, this.p1Delay);
      }
    } else {
      if (this.p2Ready) {
        this.p2Ready = false;
        await setTimeout(() => {
          this.p2Ready = true;
          this.movePlayer(player, direction);
        }, this.p2Delay);
      }
    }
  }

  // 'up' moves player [y-1, 0]
  movePlayerSmall(direction) {
    // Initialize board and input states
    let yChange = 0;
    let xChange = 0;
    let board = this.state.board;
    let { y, x } = this.state.playerSmallPosition;

    // Translate directions into y-x coordinate changes
    if (direction === 'up') {
      yChange = -1;
    } else if (direction === 'down') {
      yChange = +1;
    } else if (direction === 'left') {
      xChange = -1;
    } else if (direction === 'right') {
      xChange = +1;
    }

    let newY = y + yChange;
    let newX = x + xChange;
    let playerSmallNewPosition = this.state.playerSmallPosition;

    // Set boundaries of movement based on grid
    if (
      newX >= 0 &&
      newX < this.props.xDimension &&
      newY >= 0 &&
      newY < this.props.yDimension
    ) {
      //
      // board[newY][newX] = 1;
      // board[y][x] = 0;
      playerSmallNewPosition = { y: newY, x: newX };
    }

    // Change state
    this.setState(st => ({
      playerSmallPosition: playerSmallNewPosition,
      board
    }));
  }

  // 'up' moves player [y-1, 0]
  movePlayer(player, direction) {
    // Initialize board and input states
    let yChange = 0;
    let xChange = 0;
    let board = this.state.board;
    let position;
    let size;
    let playerNewPosition;
    if (player === 'big') {
      position = this.state.playerBigPosition;
      size = this.props.playerBigSize;
      playerNewPosition = this.state.playerBigPosition;
    } else if (player === 'small') {
      position = this.state.playerSmallPosition;
      size = this.props.playerSmallSize;
      playerNewPosition = this.state.playerSmallPosition;
    }

    // Translate directions into y-x coordinate changes
    if (direction === 'up') {
      yChange = -1;
    } else if (direction === 'down') {
      yChange = +1;
    } else if (direction === 'left') {
      xChange = -1;
    } else if (direction === 'right') {
      xChange = +1;
    }

    let minCorner = position[0][0];
    let maxCorner = position[size - 1][size - 1];

    // Set boundaries of movement based on grid
    if (
      minCorner.x + xChange >= 0 &&
      maxCorner.x + xChange < this.props.xDimension &&
      minCorner.y + yChange >= 0 &&
      maxCorner.y + yChange < this.props.yDimension
    ) {
      // Only need if planning on making one Cell Component that takes in board value 0/1/2 and renders players
      // board[newY][newX] = 2;
      // board[y][x] = 0;
      playerNewPosition = position.map(e1 =>
        e1.map(e2 => ({ y: e2.y + yChange, x: e2.x + xChange }))
      );
    }

    let changedState;
    if (player === 'big') {
      changedState = {
        playerBigPosition: playerNewPosition,
        board
      };
    } else if (player === 'small') {
      changedState = {
        playerSmallPosition: playerNewPosition,
        board
      };
    }

    // Change state
    this.setState(st => changedState);
  }

  render() {
    // Loop through array of arrays to create board with HTML based on coordinates

    // Set all playerBig coordinates
    let playerBigCoord = new Set();
    for (let i = 0; i < this.props.playerBigSize; i++) {
      for (let j = 0; j < this.props.playerBigSize; j++) {
        playerBigCoord.add(
          `${this.state.playerBigPosition[i][j].y}-${
            this.state.playerBigPosition[i][j].x
          }`
        );
      }
    }

    let playerSmallCoord = new Set();
    for (let i = 0; i < this.props.playerSmallSize; i++) {
      for (let j = 0; j < this.props.playerSmallSize; j++) {
        playerSmallCoord.add(
          `${this.state.playerSmallPosition[i][j].y}-${
            this.state.playerSmallPosition[i][j].x
          }`
        );
      }
    }

    let tblBoard = [];
    for (let y = 0; y < this.props.yDimension; y++) {
      let row = [];

      for (let x = 0; x < this.props.xDimension; x++) {
        let coord = `${y}-${x}`;

        // Set cell to be playerSmall
        if (playerSmallCoord.has(coord)) {
          row.push(<PlayerSmall key={coord} />);

          // Set cell to be playerBig
        } else if (playerBigCoord.has(coord)) {
          row.push(<PlayerBig key={coord} />);

          // Set cell to be empty
        } else {
          row.push(<td className="cell" key={coord} coord={coord} />);
        }
      }

      tblBoard.push(
        <tr key={y} row={y}>
          {row}
        </tr>
      );
    }

    return (
      <table className="Board">
        <tbody>{tblBoard}</tbody>
      </table>
    );
  }
}

export default Board;
