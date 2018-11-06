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
      timer: 0,
      firstKeyPress: false
    };
    this.registerKeyPress = this.registerKeyPress.bind(this);
    this.resetGame = this.resetGame.bind(this);
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
    if (!this.state.firstKeyPress) {
      this.setState({ firstKeyPress: true });
      this.startTimer();
    }
  }

  // Set delay on player movement
  async moveDelay(player, direction) {
    let setReadyState = function(st) {
      return {
        players: {
          ...st.players,
          [player]: {
            ...st.players[player],
            moveReady: !st.players[player].moveReady
          }
        }
      };
    };

    if (this.state.players[player].moveReady) {
      this.setState(st => setReadyState(st));
      await setTimeout(() => {
        this.setState(st => setReadyState(st));
        this.movePlayer(player, direction);
      }, this.state.players[player].delay);
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
    let position = playerList[player].position;
    let size = playerList[player].size;
    let playerNewPosition = playerList[player].position;

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

      playerNewPosition = position.map(e1 =>
        e1.map(e2 => ({ y: e2.y + yChange, x: e2.x + xChange }))
      );
    }

    // Setting cooordinate object to hold existing players' coordinates
    let coordObj = {};
    for (let key in playerList) {
      coordObj[key] = playerList[key].coordinates;
    }
    coordObj[player] = this.setPlayerCoordinates(
      playerList[player].size,
      playerNewPosition
    );

    // Check win conditions
    if (player !== 'playerBig') {
      for (let item of coordObj.playerBig) {
        if (coordObj[player].has(item)) {
          bigWin = true;
        }
      }
    } else {
      for (let playercoord in coordObj) {
        if (playercoord !== 'playerBig') {
          for (let item of coordObj[`${playercoord}`]) {
            if (coordObj.playerBig.has(item)) {
              bigWin = true;
            }
          }
        }
      }
    }

    // Stop timer if win conditions met
    if (bigWin === true) {
      this.stopTimer();
      window.document.removeEventListener('keydown', this.registerKeyPress);
    }

    // Set changedState object based on player, to later set state
    let changedState = {
      players: {
        ...playerList,
        [player]: {
          ...playerList[player],
          position: playerNewPosition,
          coordinates: this.setPlayerCoordinates(
            playerList[player].size,
            playerNewPosition
          )
        }
      },
      board,
      bigWin
    };

    // Change state
    this.setState(changedState);
  }

  // Set timer
  startTimer() {
    let counter = 1;
    setTimerFunction = setInterval(() => {
      this.setState({
        timer: counter
      });
      counter++;
    }, 1000);
  }

  // Stop timer
  stopTimer() {
    clearInterval(setTimerFunction);
  }

  // Reset game
  resetGame() {
    let defaultState = {
      board: this.createBoard(),
      players: this.createPlayerList(),
      bigWin: false,
      timer: 0,
      firstKeyPress: false
    };
    this.setState(defaultState);
    window.document.addEventListener('keydown', this.registerKeyPress);
  }

  render() {
    let playerList = this.state.players;

    // Loop through array of arrays to create board with HTML based on coordinates
    let tblBoard = [];
    for (let y = 0; y < this.props.yDimension; y++) {
      let row = [];
      for (let x = 0; x < this.props.xDimension; x++) {
        let coord = `${y}-${x}`;

        // Using pushed variable is janky; FIX THIS
        let pushed = false;
        let { playerBig, ...smallPlayers } = playerList;

        // Set cell to be specific playerSmall
        for (let player in smallPlayers) {
          if (playerList[player].coordinates.has(coord) && pushed === false) {
            row.push(
              <PlayerSmall
                key={coord}
                id={coord}
                backgroundColor={playerList[player].color}
                border={playerList[player].border}
              />
            );
            pushed = true;
          }
        }
        // Set cell to be playerBig
        if (playerBig.coordinates.has(coord) && pushed === false) {
          row.push(
            <PlayerBig
              key={coord}
              id={coord}
              backgroundColor={playerList.playerBig.color}
              border={playerList.playerBig.border}
            />
          );
          pushed = true;
        }

        if (!pushed) {
          // Set cell to be border
          if (
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
