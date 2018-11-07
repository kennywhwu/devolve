import React, { Component } from 'react';
import './Board.css';
import PlayerSmall from './PlayerSmall';
import PlayerBig from './PlayerBig';

// Reference translation for key press to expected action
const keyDict = {
  a: { player: 'small1', type: 'movement', action: 'left' },
  w: { player: 'small1', type: 'movement', action: 'up' },
  d: { player: 'small1', type: 'movement', action: 'right' },
  s: { player: 'small1', type: 'movement', action: 'down' },
  h: { player: 'small2', type: 'movement', action: 'left' },
  u: { player: 'small2', type: 'movement', action: 'up' },
  k: { player: 'small2', type: 'movement', action: 'right' },
  j: { player: 'small2', type: 'movement', action: 'down' },
  ArrowLeft: {
    player: 'big',
    type: 'movement',
    action: 'left'
  },
  ArrowUp: { player: 'big', type: 'movement', action: 'up' },
  ArrowRight: {
    player: 'big',
    type: 'movement',
    action: 'right'
  },
  ArrowDown: {
    player: 'big',
    type: 'movement',
    action: 'down'
  }
};

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.createBoard(),
      // // playerPosition defined by array of arrays of objects w/coordinates (ie. [[{y1, x1}, {y1, x2}],[{y2, x1},{y2, x2}]]
      playerSmall1Position: this.createPlayerSmall(0),
      playerSmall2Position: this.createPlayerSmall(2),
      playerBigPosition: this.createPlayerBig(),
      players: this.createPlayerList()
    };
    this.registerKeyPress = this.registerKeyPress.bind(this);
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
    playerSmall1Size: 1,
    playerSmall2Size: 1,
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
  setPositionPlayerSmall(offset) {
    let dimension = this.props.playerSmall1Size;

    return Array.from({ length: dimension }).map((e1, i1) =>
      Array.from({ length: dimension }).map((e2, i2) => ({
        y: this.props.yDimension - (dimension - i1) - offset,
        x: i2 + offset
      }))
    );
  }

  createPlayer(player) {
    let dimension = this.props.playerSmall1Size;

    return Array.from({ length: dimension }).map((e1, i1) =>
      Array.from({ length: dimension }).map((e2, i2) => ({
        y: this.props.yDimension - (dimension - i1) - offset,
        x: i2 + offset
      }))
    );
  }

  // General function to call action based on keypress
  registerKeyPress(evt) {
    let keyDef = keyDict[evt.key.toString()];
    if (keyDef !== undefined) {
      if (keyDef.type === 'movement') {
        this.moveDelay(keyDef.player, keyDef.action);
      }
    }
  }

  // Sets delay on player movement
  async moveDelay(player, direction) {
    if (player === 'small1') {
      if (this.p1Ready) {
        this.p1Ready = false;
        await setTimeout(() => {
          this.p1Ready = true;
          this.movePlayer(player, direction);
        }, this.p1Delay);
      }
    } else if (player === 'small2') {
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

  // movement based on direction pressed
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
    } else if (player === 'small1') {
      position = this.state.playerSmall1Position;
      size = this.props.playerSmall1Size;
      playerNewPosition = this.state.playerSmall1Position;
    } else if (player === 'small2') {
      position = this.state.playerSmall2Position;
      size = this.props.playerSmall2Size;
      playerNewPosition = this.state.playerSmall2Position;
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

    // Set changedState object based on player to later set state
    let changedState;
    if (player === 'big') {
      changedState = {
        playerBigPosition: playerNewPosition,
        board
      };
    } else if (player === 'small1') {
      changedState = {
        playerSmall1Position: playerNewPosition,
        board
      };
    } else if (player === 'small2') {
      changedState = {
        playerSmall2Position: playerNewPosition,
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

    let playerSmall1Coord = new Set();
    for (let i = 0; i < this.props.playerSmall1Size; i++) {
      for (let j = 0; j < this.props.playerSmall1Size; j++) {
        playerSmall1Coord.add(
          `${this.state.playerSmall1Position[i][j].y}-${
            this.state.playerSmall1Position[i][j].x
          }`
        );
      }
    }
    let playerSmall2Coord = new Set();
    for (let i = 0; i < this.props.playerSmall2Size; i++) {
      for (let j = 0; j < this.props.playerSmall2Size; j++) {
        playerSmall2Coord.add(
          `${this.state.playerSmall2Position[i][j].y}-${
            this.state.playerSmall2Position[i][j].x
          }`
        );
      }
    }

    let tblBoard = [];
    for (let y = 0; y < this.props.yDimension; y++) {
      let row = [];

      for (let x = 0; x < this.props.xDimension; x++) {
        let coord = `${y}-${x}`;

        // Set cell to be playerSmall1
        if (playerSmall1Coord.has(coord)) {
          row.push(
            <PlayerSmall
              key={coord}
              backgroundColor="red"
              border="2px solid black"
            />
          );
        } else if (playerSmall2Coord.has(coord)) {
          row.push(
            <PlayerSmall
              key={coord}
              backgroundColor="green"
              border="2px solid black"
            />
          );

          // Set cell to be playerBig
        } else if (playerBigCoord.has(coord)) {
          row.push(
            <PlayerBig
              key={coord}
              backgroundColor="blue"
              border="2px solid black"
            />
          );

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
