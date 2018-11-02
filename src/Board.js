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
  g: { player: 'small2', type: 'movement', action: 'left' },
  y: { player: 'small2', type: 'movement', action: 'up' },
  j: { player: 'small2', type: 'movement', action: 'right' },
  h: { player: 'small2', type: 'movement', action: 'down' },
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

// Key for defining order of player colors
const playerColorKey = ['blue', 'green', 'yellow', 'tomato'];

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.createBoard(),
      players: this.createPlayerList(),
      bigWin: false
    };
    this.registerKeyPress = this.registerKeyPress.bind(this);
    this.setPlayerPosition = this.setPlayerPosition.bind(this);
    this.setPlayerCoordinates = this.setPlayerCoordinates.bind(this);
    this.moveDelay = this.moveDelay.bind(this);
    this.movePlayer = this.movePlayer.bind(this);
    window.document.addEventListener('keydown', this.registerKeyPress);
  }

  static defaultProps = {
    xDimension: 15,
    yDimension: 15
  };

  // Initialize board populated with 0's based on provided dimensions
  createBoard() {
    let board = Array.from({ length: this.props.yDimension }).map((e1, y) => {
      return Array.from({ length: this.props.xDimension }).map((e2, x) => {
        return 0;
      });
    });
    return board;
  }

  // Create list of player objects based on props fed into Board
  createPlayerList() {
    let playerList = {};
    for (let i = 0; i < this.props.players.big; i++) {
      let playerObj = {
        type: 'big',
        color: 'red',
        border: '2px solid black',
        size: 5,
        moveReady: true,
        delay: 300
      };
      playerObj.position = this.setPlayerPosition(
        0,
        this.props.xDimension - playerObj.size,
        playerObj.size
      );
      playerObj.coordinates = this.setPlayerCoordinates(
        playerObj.size,
        playerObj.position
      );
      playerList.playerBig = playerObj;
    }
    for (let i = 0; i < this.props.players.small; i++) {
      let playerObj = {
        type: 'small',
        color: playerColorKey[i],
        border: '2px solid black',
        size: 2,
        moveReady: true,
        delay: 0
      };
      playerObj.position = this.setPlayerPosition(
        this.props.yDimension - playerObj.size - i * this.props.players.small,
        i * this.props.players.small,
        playerObj.size
      );
      playerObj.coordinates = this.setPlayerCoordinates(
        playerObj.size,
        playerObj.position
      );
      playerList[`playerSmall${i + 1}`] = playerObj;
    }
    return playerList;
  }

  // Initialize creation and placement of playerBig
  setPlayerPosition(initialY, initialX, size) {
    return Array.from({ length: size }).map((e1, i1) =>
      Array.from({ length: size }).map((e2, i2) => ({
        y: initialY + i1,
        x: initialX + i2
      }))
    );
  }

  setPlayerCoordinates(size, position) {
    let coord = new Set();
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        coord.add(`${position[i][j].y}-${position[i][j].x}`);
      }
    }
    return coord;
  }

  // Call action based on keypress
  registerKeyPress(evt) {
    let keyDef = keyDict[evt.key.toString()];
    if (keyDef !== undefined) {
      if (keyDef.type === 'movement') {
        this.moveDelay(keyDef.player, keyDef.action);
      }
    }
  }

  // Set delay on player movement
  async moveDelay(player, direction) {
    if (player === 'small1') {
      if (this.state.players.playerSmall1.moveReady) {
        this.setState(st => ({
          players: {
            ...st.players,
            playerSmall1: {
              ...st.players.playerSmall1,
              moveReady: !st.players.playerSmall1.moveReady
            }
          }
        }));
        await setTimeout(() => {
          this.setState(st => ({
            players: {
              ...st.players,
              playerSmall1: {
                ...st.players.playerSmall1,
                moveReady: !st.players.playerSmall1.moveReady
              }
            }
          }));
          this.movePlayer(player, direction);
        }, this.state.players.playerSmall1.delay);
      }
    } else if (player === 'small2') {
      if (this.state.players.playerSmall2.moveReady) {
        this.setState(st => ({
          players: {
            ...st.players,
            playerSmall1: {
              ...st.players.playerSmall1,
              moveReady: !st.players.playerSmall1.moveReady
            }
          }
        }));
        await setTimeout(() => {
          this.setState(st => ({
            players: {
              ...st.players,
              playerSmall1: {
                ...st.players.playerSmall1,
                moveReady: !st.players.playerSmall1.moveReady
              }
            }
          }));
          this.movePlayer(player, direction);
        }, this.state.players.playerSmall1.delay);
      }
    } else if (player === 'big') {
      if (this.state.players.playerBig.moveReady) {
        this.setState(st => ({
          players: {
            ...st.players,
            playerBig: {
              ...st.players.playerBig,
              moveReady: !st.players.playerBig.moveReady
            }
          }
        }));
        await setTimeout(() => {
          this.setState(st => ({
            players: {
              ...st.players,
              playerBig: {
                ...st.players.playerBig,
                moveReady: !st.players.playerBig.moveReady
              }
            }
          }));
          this.movePlayer(player, direction);
        }, this.state.players.playerBig.delay);
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
    let bigWin = this.state.bigWin;
    let playerList = this.state.players;
    let position;
    let size;
    let playerNewPosition;
    let coordinates;
    if (player === 'big') {
      position = playerList.playerBig.position;
      size = playerList.playerBig.size;
      playerNewPosition = playerList.playerBig.position;
    } else if (player === 'small1') {
      position = playerList.playerSmall1.position;
      size = playerList.playerSmall1.size;
      playerNewPosition = playerList.playerSmall1.position;
    } else if (player === 'small2') {
      position = playerList.playerSmall2.position;
      size = playerList.playerSmall2.size;
      playerNewPosition = playerList.playerSmall2.position;
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

    // Set boundaries of movement based on grid
    let minCorner = position[0][0];
    let maxCorner = position[size - 1][size - 1];
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

    let playerBigCoord = playerList.playerBig.coordinates;
    let playerSmall1Coord = playerList.playerSmall1.coordinates;
    let playerSmall2Coord = playerList.playerSmall2.coordinates;
    if (player === 'big') {
      playerBigCoord = this.setPlayerCoordinates(
        playerList.playerBig.size,
        playerNewPosition
      );
    } else if (player === 'small1') {
      playerSmall1Coord = this.setPlayerCoordinates(
        playerList.playerSmall1.size,
        playerNewPosition
      );
    } else if (player === 'small2') {
      playerSmall2Coord = this.setPlayerCoordinates(
        playerList.playerSmall2.size,
        playerNewPosition
      );
    }

    for (let item of playerBigCoord) {
      if (playerSmall1Coord.has(item) || playerSmall2Coord.has(item)) {
        bigWin = true;
      }
    }

    // Set changedState object based on player, to later set state
    let changedState;
    if (player === 'big') {
      changedState = {
        players: {
          ...playerList,
          playerBig: {
            ...playerList.playerBig,
            position: playerNewPosition,
            coordinates: this.setPlayerCoordinates(
              playerList.playerBig.size,
              playerNewPosition
            )
          }
        },
        board,
        bigWin
      };
    } else if (player === 'small1') {
      changedState = {
        players: {
          ...playerList,
          playerSmall1: {
            ...playerList.playerSmall1,
            position: playerNewPosition,
            coordinates: this.setPlayerCoordinates(
              playerList.playerSmall1.size,
              playerNewPosition
            )
          }
        },
        board,
        bigWin
      };
    } else if (player === 'small2') {
      changedState = {
        players: {
          ...playerList,
          playerSmall2: {
            ...playerList.playerSmall2,
            position: playerNewPosition,
            coordinates: this.setPlayerCoordinates(
              playerList.playerSmall2.size,
              playerNewPosition
            )
          }
        },
        board,
        bigWin
      };
    }

    // Change state
    this.setState(st => changedState);
  }

  render() {
    let playerList = this.state.players;
    if (this.state.bigWin) {
      window.document.removeEventListener('keydown', this.registerKeyPress);
    }

    // Loop through array of arrays to create board with HTML based on coordinates
    let tblBoard = [];
    for (let y = 0; y < this.props.yDimension; y++) {
      let row = [];
      for (let x = 0; x < this.props.xDimension; x++) {
        let coord = `${y}-${x}`;

        // Set cell to be playerBig
        if (
          playerList.playerBig &&
          playerList.playerBig.coordinates.has(coord)
        ) {
          row.push(
            <PlayerBig
              key={coord}
              backgroundColor={playerList.playerBig.color}
              border={playerList.playerBig.border}
            />
          );
        }
        // Set cell to be playerSmall1
        else if (
          playerList.playerSmall1 &&
          playerList.playerSmall1.coordinates.has(coord)
        ) {
          row.push(
            <PlayerSmall
              key={coord}
              backgroundColor={playerList.playerSmall1.color}
              border={playerList.playerSmall1.border}
            />
          );
        }
        // Set cell to be playerSmall2
        else if (
          playerList.playerSmall2 &&
          playerList.playerSmall2.coordinates.has(coord)
        ) {
          row.push(
            <PlayerSmall
              key={coord}
              backgroundColor={playerList.playerSmall2.color}
              border={playerList.playerSmall2.border}
            />
          );
        }

        // Set cell to be empty
        else {
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
      <div className="Board">
        <table className="Board">
          <tbody>{tblBoard}</tbody>
        </table>
        {this.state.bigWin ? (
          <h1>
            You've been eaten by the{' '}
            <span style={{ color: 'red' }}>BEAST!!!</span>
          </h1>
        ) : (
          undefined
        )}
      </div>
    );
  }
}

export default Board;
