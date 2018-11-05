import React, { Component } from 'react';
import './Board.css';
import PlayerSmall from './PlayerSmall';
import PlayerBig from './PlayerBig';
import keyDict from './keyDictionary';

// Key for defining order of player colors
const playerColorKey = ['blue', 'green', 'yellow', 'tomato'];

// Border Size
const BORDER_SIZE = 1;

let setTimerFunction;

// Board class

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.createBoard(),
      players: this.createPlayerList(),
      bigWin: false,
      timer: 0
    };
    this.registerKeyPress = this.registerKeyPress.bind(this);
    window.document.addEventListener('keydown', this.registerKeyPress);
    this.startTimer();
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
    // Create playerBig object
    for (let i = 0; i < this.props.players.big; i++) {
      // Initialize position/coordinates
      const size = 6;
      const position = this.setPlayerPosition(
        BORDER_SIZE,
        this.props.xDimension - size - BORDER_SIZE,
        size
      );
      const coordinates = this.setPlayerCoordinates(size, position);

      let playerObj = {
        type: 'big',
        color: 'red',
        border: '2px solid black',
        size,
        moveReady: true,
        delay: 200,
        // need to pass in created object to refer to the object that size is being called on
        // already bound to class, so can't use this.size
        // ie. position: ()=>this.setPlayerPosition(0,this.props.xDimension-playerObj.size)
        position,
        coordinates
      };
      playerList.playerBig = playerObj;
    }

    // Create playerSmall objects
    for (let i = 0; i < this.props.players.small; i++) {
      // Initialize position/coordinates
      const size = 1;
      let position = this.setPlayerPosition(
        this.props.yDimension - size - i * size - BORDER_SIZE,
        i * size + BORDER_SIZE,
        size
      );
      const coordinates = this.setPlayerCoordinates(size, position);

      let playerObj = {
        type: 'small',
        color: playerColorKey[i],
        border: '2px solid black',
        size,
        moveReady: true,
        delay: 0,
        position,
        coordinates
      };

      playerList[`playerSmall${i + 1}`] = playerObj;
    }
    return playerList;
  }

  // Initialize creation and placement of playerBig
  setPlayerPosition(initialY, initialX, size) {
    let position = Array.from({ length: size }).map((e1, i1) =>
      Array.from({ length: size }).map((e2, i2) => ({
        y: initialY + i1,
        x: initialX + i2
      }))
    );

    return position;
  }

  // Translate position object into string coordinate
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
    let setReadyState = function(st) {
      return {
        players: {
          ...st.players,
          player: {
            ...st.players.player,
            moveReady: !st.players[`${player}`].moveReady
          }
        }
      };
    };

    // if (player === 'small1') {
    // if (this.state.players[`${player}`].moveReady) {
    this.setState(st => setReadyState(st));
    await setTimeout(() => {
      this.setState(st => setReadyState(st));
      this.movePlayer(player, direction);
    }, this.state.players.playerSmall1.delay);
    // }
    // } else if (player === 'small2') {
    //   if (this.state.players.playerSmall2.moveReady) {
    //     this.setState(st => setReadyState(st));
    //     await setTimeout(() => {
    //       this.setState(st => setReadyState(st));
    //       this.movePlayer(player, direction);
    //     }, this.state.players.playerSmall1.delay);
    //   }
    // } else if (player === 'big') {
    //   if (this.state.players.playerBig.moveReady) {
    //     this.setState(st => setReadyState(st));
    //     await setTimeout(() => {
    //       this.setState(st => setReadyState(st));
    //       this.movePlayer(player, direction);
    //     }, this.state.players.playerBig.delay);
    //   }
    // }
  }

  // movement based on direction pressed
  // 'up' moves player [y-1, 0]
  movePlayer(player, direction) {
    // Initialize board and input states
    let yChange;
    let xChange;
    let board = this.state.board;
    let bigWin = this.state.bigWin;
    let playerList = this.state.players;
    let position = playerList[`${player}`].position;
    let size = playerList[`${player}`].size;
    let playerNewPosition = playerList[`${player}`].position;

    // let position;
    // let size;
    // let playerNewPosition;
    // if (player === 'big') {
    //   position = playerList.playerBig.position;
    //   size = playerList.playerBig.size;
    //   playerNewPosition = playerList.playerBig.position;
    // } else if (player === 'small1') {
    //   position = playerList.playerSmall1.position;
    //   size = playerList.playerSmall1.size;
    //   playerNewPosition = playerList.playerSmall1.position;
    // } else if (player === 'small2') {
    //   position = playerList.playerSmall2.position;
    //   size = playerList.playerSmall2.size;
    //   playerNewPosition = playerList.playerSmall2.position;
    // }

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
      minCorner.x + xChange >= BORDER_SIZE &&
      maxCorner.x + xChange < this.props.xDimension - BORDER_SIZE &&
      minCorner.y + yChange >= BORDER_SIZE &&
      maxCorner.y + yChange < this.props.yDimension - BORDER_SIZE
    ) {
      // Only need if planning on making one Cell Component that takes in board value 0/1/2 and renders players
      // board[newY][newX] = 2;
      // board[y][x] = 0;
      // playerNewPosition = position.map(e1 =>
      //   e1.map(e2 => ({ y: e2.y + yChange, x: e2.x + xChange }))
      // );
      playerNewPosition = position.map(e1 =>
        e1.map(e2 => ({ y: e2.y + yChange, x: e2.x + xChange }))
      );
    }
    console.log(minCorner);

    // let playerCoord = this.setPlayerCoordinates(
    //   playerList[`${player}`].size,
    //   playerNewPosition
    // );

    // if (playerList.playerBig) {
    //   playerBigCoord = playerList.playerBig.coordinates;
    //   if (player === 'big') {
    //     playerBigCoord = this.setPlayerCoordinates(
    //       playerList.playerBig.size,
    //       playerNewPosition
    //     );
    //   }
    // }
    // if (playerList.playerSmall1) {
    //   playerSmall1Coord = playerList.playerSmall1.coordinates;
    //   if (player === 'small1') {
    //     playerSmall1Coord = this.setPlayerCoordinates(
    //       playerList.playerSmall1.size,
    //       playerNewPosition
    //     );
    //   }
    // }
    // if (playerList.playerSmall2) {
    //   playerSmall2Coord = playerList.playerSmall2.coordinates;
    //   if (player === 'small2') {
    //     playerSmall2Coord = this.setPlayerCoordinates(
    //       playerList.playerSmall2.size,
    //       playerNewPosition
    //     );
    //   }
    // }

    let playerCoord = {};
    for (let key in playerList) {
      playerCoord[key] = playerList[key].coordinates;
    }
    playerCoord[`${player}`].coordinates = this.setPlayerCoordinates(
      playerList[`${player}`].size,
      playerNewPosition
    );

    // let playerBigCoord = playerList.playerBig.coordinates;
    // let playerSmall1Coord = playerList.playerSmall1.coordinates;
    // let playerSmall2Coord;
    // if (playerList.playerSmall2 !== undefined) {
    //   playerSmall2Coord = playerList.playerSmall2.coordinates;
    // }
    // playerList[`${player}`].coordinates = this.setPlayerCoordinates(
    //   playerList[`${player}`].size,
    //   playerNewPosition
    // );

    if (player !== 'playerBig') {
      for (let item of playerCoord.playerBig) {
        if (playerCoord[`${player}`].has(item)) {
          bigWin = true;
        }
      }
    } else {
      for (let playercoord in playerCoord) {
        if (playercoord !== 'playerBig') {
          for (let item of playerCoord.playercoord) {
            if (playerCoord.playerBig.has(item)) {
              bigWin = true;
            }
          }
        }
      }
    }

    if (bigWin === true) {
      this.stopTimer();
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
          },
          board,
          bigWin
        }
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

  // Set timer
  startTimer() {
    let counter = 0;
    setTimerFunction = setInterval(() => {
      this.setState({
        timer: counter
      });
      counter++;
    }, 1000);
  }

  stopTimer() {
    clearInterval(setTimerFunction);
  }
  // this.state.bigWin === true

  // Reset game
  // resetGame() {}

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
          playerList.playerSmall1 &&
          playerList.playerSmall1.coordinates.has(coord)
        ) {
          row.push(
            <PlayerSmall
              key={coord}
              id={coord}
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
              id={coord}
              backgroundColor={playerList.playerSmall2.color}
              border={playerList.playerSmall2.border}
            />
          );
        } else if (
          playerList.playerBig &&
          playerList.playerBig.coordinates.has(coord)
        ) {
          row.push(
            <PlayerBig
              key={coord}
              id={coord}
              backgroundColor={playerList.playerBig.color}
              border={playerList.playerBig.border}
            />
          );
        }
        // Set cell to be playerSmall1
        else if (
          y === 0 ||
          x === 0 ||
          y === this.props.yDimension - BORDER_SIZE ||
          x === this.props.xDimension - BORDER_SIZE
        ) {
          row.push(
            <td
              className="cell"
              key={coord}
              id={coord}
              style={{ backgroundColor: 'gray' }}
            />
          );
        }
        // Set cell to be empty
        else {
          row.push(<td className="cell" id={coord} coord={coord} />);
        }
      }

      tblBoard.push(
        <tr id={y} row={y}>
          {row}
        </tr>
      );
    }

    return (
      <div className="Board">
        <table className="Board">
          <tbody>{tblBoard}</tbody>
        </table>
        <h1>{this.state.timer}</h1>
        {this.state.bigWin ? (
          <div>
            <h1>
              You've been eaten by the{' '}
              <span style={{ color: 'red' }}>BEAST!!!</span>
            </h1>
            <button onClick={this.resetGame}>Start the Chase</button>
          </div>
        ) : (
          undefined
        )}
      </div>
    );
  }
}

export default Board;
