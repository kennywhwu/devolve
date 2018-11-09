/* BOARD COMPONENT */

///////////////
/// IMPORTS ///
///////////////

import React, { Component } from 'react';
import './Board.css';
import PlayerSmall from './PlayerSmall';
import PlayerBig from './PlayerBig';
import keyDict from './keyDictionary';

/////////////////
/// CONSTANTS ///
/////////////////

// Key for defining order of player colors
const playerColorKey = [
  'blue',
  'green',
  'yellow',
  'tomato',
  'purple',
  'pink',
  'black',
  'brown',
  'orange',
  'magenta'
];

// Constant game factors
const BORDER_SIZE = 1;
const GROWTH_RATE = 0;
const EXIT_RATE = 5;

let setTimerFunction;

//////////////////
/// WEBSOCKETS ///
//////////////////

/** Client-side of websocket. */

const urlParts = document.URL.split('/');
const roomName = urlParts[urlParts.length - 1];

///////////////////
/// BOARD CLASS ///
///////////////////

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.createBoard(),
      currentPlayer: null,
      players: this.createPlayerList(),
      eatenPlayers: [],
      escapedPlayers: [],
      win: false,
      timer: 0,
      firstKeyPress: false,
      results: [],
      exit: { y: 1, x: 14 },
      isLoading: true
    };
    this.decodeKeyBoardEvent = this.decodeKeyBoardEvent.bind(this);
    this.stopGame = this.stopGame.bind(this);
    // this.resetGame = this.resetGame.bind(this);
    this.handleResetButton = this.handleResetButton.bind(this);
    window.document.addEventListener('keydown', this.decodeKeyBoardEvent);
  }

  static defaultProps = {
    xDimension: 15,
    yDimension: 15
  };

  // When component mounts, create and open new websocket, prompt user names and player types, and listen for incoming messages from server
  componentDidMount() {
    this.connection = new WebSocket(
      `ws://192.168.1.175:3005/devolve/${roomName}`
    );
    // 192.168.1.175

    // this.name = prompt('Username?', 'Kenny');
    // this.player = prompt('Player?', 'playerSmall1');

    this.connection.onopen = evt => {
      let data = { type: 'join', state: this.state };
      this.connection.send(JSON.stringify(data));
    };

    // this.connection.onopen = evt => {
    //   let data = { type: 'join', name: this.name, player: this.player };
    //   this.connection.send(JSON.stringify(data));
    // };

    // listen to onmessage event
    this.connection.onmessage = evt => {
      let data = JSON.parse(evt.data);
      if (data.type === 'join') {
        if (data.player === 'playerBig') {
          // console.log('data.state', data.state);
          this.setState({ currentPlayer: data.player, isLoading: false });
        } else {
          // console.log('currentPlayer', data.player);
          // this.setState({ currentPlayer: data.player, isLoading: false });
        }
      }

      if (data.type === 'other_join') {
        console.log('other-join');
        if (this.state.currentPlayer === 'playerBig') {
          this.connection.send(
            JSON.stringify({ type: 'current_state', state: this.state })
          );
        }
      }

      if (data.type === 'current_state') {
        console.log('current-state', data.state);
        if (this.state.isLoading === true) {
          this.setState(data.state);
        }
      }

      // If incoming message is keypress, then invoke registerKeyPress function
      if (data.type === 'keypress') {
        this.registerKeyPress(data.key);
        // add the new message to state
        // this.setState(data.state);
      }
      // if (data.type === 'win') {
      //   console.log('this.state.eatenPlayers', this.state.eatenPlayers);
      //   console.log('this.state.escapedPlayers', this.state.escapedPlayers);
      //   this.setState({ win: data.win });
      // }

      // If incoming message is keypress, then invoke registerKeyPress function
      if (data.type === 'reset') {
        this.resetGame();
      }

      if (data.type === 'exit') {
        console.log('exit');
        this.setState({ exit: { y: data.exit.y, x: data.exit.x } });
      }
    };
  }

  // componentDidUpdate() {
  //   if (this.state.win !== false) {
  //     this.connection.send(
  //       JSON.stringify({
  //         name: this.name,
  //         type: 'win',
  //         win: this.state.win
  //       })
  //     );
  //   }
  // }

  // componentWillUnmount() {
  //   this.connection.send(JSON.stringify({ type: 'close' }));
  // }

  ///////////////////////
  /// INITIALIZE GAME ///
  ///////////////////////

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
      const size = 3;
      const position = this.setPlayerPosition(
        BORDER_SIZE + 2,
        this.props.xDimension - size - BORDER_SIZE - 2,
        size
      );
      const coordinates = this.setPlayerCoordinates(size, position);

      let playerObj = {
        type: 'big',
        color: 'red',
        border: '2px solid black',
        size,
        moveReady: true,
        delay: 100,
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

  /////////////////////
  /// SET PLACEMENT ///
  /////////////////////

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
    let coord = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        coord.push(`_${position[i][j].y}-${position[i][j].x}`);
      }
    }

    return coord;
  }

  ////////////////
  /// KEYPRESS ///
  ////////////////

  // Translate keyboard event into actual key pressed
  decodeKeyBoardEvent(evt) {
    let keyDef = keyDict[evt.key.toString()];
    this.connection.send(
      JSON.stringify({
        // state: this.state,
        name: this.name,
        player: this.state.currentPlayer,
        type: 'keypress',
        key: keyDef
      })
    );
    this.registerKeyPress(this.keyDef);
  }

  // Call action based on keypress
  registerKeyPress(keyDef) {
    if (keyDef !== undefined && keyDef.player in this.state.players) {
      if (keyDef.type === 'movement') {
        this.moveDelay(keyDef.player, keyDef.action);
      }
      if (!this.state.firstKeyPress) {
        this.setState({ firstKeyPress: true });
        this.startTimer();
      }
    }
  }

  ////////////////
  /// MOVEMENT ///
  ////////////////

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

    // if (
    //   minCorner.x + xChange >= BORDER_SIZE &&
    //   maxCorner.x + xChange < this.props.xDimension - BORDER_SIZE &&
    //   minCorner.y + yChange >= BORDER_SIZE &&
    //   maxCorner.y + yChange < this.props.yDimension - BORDER_SIZE
    // ) {
    //   // Only need if planning on making one Cell Component that takes in board value 0/1/2 and renders players
    //   // board[newY][newX] = 2;
    //   // board[y][x] = 0;

    //   playerNewPosition = position.map(e1 =>
    //     e1.map(e2 => ({ y: e2.y + yChange, x: e2.x + xChange }))
    //   );
    // }

    if (
      this.checkAllBounds(
        minCorner.x + xChange,
        maxCorner.x + xChange,
        minCorner.y + yChange,
        maxCorner.y + yChange
      )
    ) {
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

    // // Check win conditions
    // if (player !== 'playerBig') {
    //   for (let item of coordObj.playerBig) {
    //     if (coordObj[player].has(item)) {
    //       bigWin = true;
    //     }
    //   }
    // } else {
    //   for (let playercoord in coordObj) {
    //     if (playercoord !== 'playerBig') {
    //       for (let item of coordObj[`${playercoord}`]) {
    //         if (coordObj.playerBig.has(item)) {
    //           bigWin = true;
    //         }
    //       }
    //     }
    //   }
    // }

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
      board
    };

    // Change state
    this.setState(changedState);

    // Check for eaten/win conditions
    this.checkEaten();
    this.checkEscaped();
    this.checkWin();
  }

  ////////////////////
  /// TIMER/GROWTH ///
  ////////////////////

  // Change exit location
  changeExit() {
    // let y;
    // let x;

    // if (Math.random() < 0.25) {
    //   y = 0;
    //   x = Math.floor(Math.random() * (this.props.xDimension - 2)) + 1;
    // } else if (Math.random() < 0.25) {
    //   y = this.props.yDimension - 1;
    //   x = Math.floor(Math.random() * (this.props.xDimension - 2)) + 1;
    // } else if (Math.random() < 0.25) {
    //   y = Math.floor(Math.random() * (this.props.yDimension - 2)) + 1;
    //   x = 0;
    // } else {
    //   y = Math.floor(Math.random() * (this.props.yDimension - 2)) + 1;
    //   x = this.props.xDimension - 1;
    // }

    if (this.state.currentPlayer === 'playerBig') {
      this.connection.send(
        JSON.stringify({
          name: this.name,
          player: this.player,
          type: 'exit',
          dimensions: { y: this.props.yDimension, x: this.props.xDimension }
        })
      );
    }
  }

  // Set timer/growth rate
  startTimer() {
    let counter = 1;
    let growPlayerBig = st => {
      let size =
          st.players.playerBig.size + (counter % GROWTH_RATE === 0 ? 1 : 0),
        currPos = st.players.playerBig.position,
        initialX = currPos[0][0].x,
        initialY = currPos[0][0].y;

      if (!this.checkXMaxBounds(currPos[size - 2][size - 2].x + 1)) {
        initialX -= 1;
      }
      if (!this.checkYMaxBounds(currPos[size - 2][size - 2].y + 1)) {
        initialY -= 1;
      }
      if (!this.checkXMinBounds(currPos[size - 2][size - 2].x - 1)) {
        initialX += 1;
      }
      if (!this.checkYMinBounds(currPos[size - 2][size - 2].y - 1)) {
        initialY += 1;
      }

      let position = this.setPlayerPosition(initialY, initialX, size);
      let coordinates = this.setPlayerCoordinates(size, position);

      return {
        timer: counter,
        players: {
          ...st.players,
          playerBig: {
            ...st.players.playerBig,
            size,
            position,
            coordinates
          }
        }
      };
    };
    setTimerFunction = setInterval(() => {
      this.setState(st => growPlayerBig(st));
      counter++;
      if (counter % EXIT_RATE === 0) {
        this.changeExit();
      }
      this.checkEaten();
      this.checkEscaped();
      this.checkWin();
    }, 1000);
  }

  // Set timer
  startTimer1() {
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

  ////////////////////////
  /// CHECK CONDITIONS ///
  ////////////////////////

  // Check position if crossing border bounds
  checkAllBounds(xMin, xMax, yMin, yMax) {
    if (
      (this.checkXMinBounds(xMin) &&
        this.checkYMinBounds(yMin) &&
        this.checkXMaxBounds(xMax) &&
        this.checkXMaxBounds(yMax)) ||
      this.checkExit(yMin, xMin)
    ) {
      return true;
    }
    return false;
  }
  checkXMinBounds(xMin) {
    return xMin >= BORDER_SIZE ? true : false;
  }
  checkYMinBounds(yMin) {
    return yMin >= BORDER_SIZE ? true : false;
  }
  checkXMaxBounds(xMax) {
    return xMax < this.props.xDimension - BORDER_SIZE ? true : false;
  }
  checkYMaxBounds(yMax) {
    return yMax < this.props.yDimension - BORDER_SIZE ? true : false;
  }
  checkExit(y, x) {
    return y === this.state.exit.y && x === this.state.exit.x;
  }

  // Check player eaten
  checkEaten() {
    const playerList = this.state.players;
    for (let player in playerList) {
      if (player !== 'playerBig') {
        for (let item of playerList.playerBig.coordinates) {
          if (
            playerList[player] &&
            playerList[player].coordinates.some(e => e === item)
          ) {
            let color = playerList[player].color;
            delete playerList[player];
            this.setState(st => ({
              players: playerList,
              eatenPlayers: [...st.eatenPlayers, { player, color }],
              results: [...st.results, { player, color, outcome: 'eaten' }]
            }));
          }
        }
      }
    }
  }

  // Check player escape
  checkEscaped() {
    const playerList = this.state.players;
    for (let player in playerList) {
      if (player !== 'playerBig') {
        for (let item of playerList[player].coordinates) {
          if (
            playerList[player] &&
            item === `_${this.state.exit.y}-${this.state.exit.x}`
          ) {
            let color = playerList[player].color;
            delete playerList[player];
            this.setState(st => ({
              players: playerList,
              escapedPlayers: [...st.escapedPlayers, { player, color }],
              results: [...st.results, { player, color, outcome: 'escaped' }]
            }));
          }
        }
      }
    }
  }

  // Check win conditions
  checkWin() {
    let eaten = this.state.eatenPlayers.length,
      escaped = this.state.escapedPlayers.length,
      small = this.props.players.small;
    if (eaten === small) {
      this.setState({ win: 'big' });
      this.stopGame();
    } else if (escaped === small) {
      this.setState({ win: 'small' });
      this.stopGame();
    } else if (eaten + escaped === small) {
      this.setState({ win: 'tie' });
      this.stopGame();
    }
  }

  /////////////////
  /// GAME OVER ///
  /////////////////

  handleResetButton() {
    this.connection.send(
      JSON.stringify({
        name: this.name,
        player: this.player,
        type: 'reset'
      })
    );
    // this.resetGame();
  }

  // Stop game
  stopGame() {
    this.stopTimer();
    window.document.removeEventListener('keydown', this.decodeKeyBoardEvent);
  }

  // Reset game
  resetGame() {
    this.stopTimer();
    let defaultState = {
      board: this.createBoard(),
      players: this.createPlayerList(),
      eatenPlayers: [],
      escapedPlayers: [],
      win: false,
      timer: 0,
      firstKeyPress: false,
      results: []
    };
    this.setState(defaultState, () => console.log(this.state));
    window.document.addEventListener('keydown', this.decodeKeyBoardEvent);
  }

  //////////////
  /// RENDER ///
  //////////////

  render() {
    let playerList = this.state.players;

    // Loop through array of arrays to create board with HTML based on coordinates
    let tblBoard = [];
    for (let y = 0; y < this.props.yDimension; y++) {
      let row = [];
      for (let x = 0; x < this.props.xDimension; x++) {
        let coord = `_${y}-${x}`;

        // Using pushed variable is janky; FIX THIS
        let pushed = false;
        let { playerBig, ...smallPlayers } = playerList;

        // Set cell to be specific playerSmall
        for (let player in smallPlayers) {
          if (
            playerList[player].coordinates.some(e => e === coord) &&
            pushed === false
          ) {
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
        if (playerBig.coordinates.some(e => e === coord) && pushed === false) {
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

        if (
          `_${this.state.exit.y}-${this.state.exit.x}` === coord &&
          pushed === false
        ) {
          row.push(
            <td className="cell" id={coord} coord={coord} key={coord} />
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
                // Removed for ingame graphics
                style={{ backgroundColor: 'gray' }}
              />
            );
            pushed = true;
          }
          // Set cell to be empty
          else {
            row.push(
              <td className="cell" id={coord} coord={coord} key={coord} />
            );
            pushed = true;
          }
        }
      }

      tblBoard.push(
        <tr id={y} row={y} key={y}>
          {row}
        </tr>
      );
    }

    let results = this.state.results.map(e => {
      if (e.outcome === 'escaped') {
        return (
          <h3 key={e.color}>
            <span style={{ color: e.color }}>{e.color.toUpperCase()}</span> has
            escaped!!!
          </h3>
        );
      } else if (e.outcome === 'eaten') {
        return (
          <h3 key={e.color}>
            <span style={{ color: e.color }}>{e.color.toUpperCase()}</span> has
            been eaten by the <span style={{ color: 'red' }}>BEAST!!!</span>
          </h3>
        );
      }
    });

    let endResult;
    if (this.state.win === 'big') {
      endResult = (
        <h1>
          Y'ALL got eaten by the <span style={{ color: 'red' }}>BEAST!!!</span>
        </h1>
      );
    } else if (this.state.win === 'small') {
      endResult = (
        <h1>
          Good job running from the{' '}
          <span style={{ color: 'red' }}>BEAST!!!</span>
        </h1>
      );
    }

    return (
      <div className="Board">
        {this.state.isLoading ? (
          <h1>Game Loading....</h1>
        ) : (
          <div>
            You are: {this.state.currentPlayer}
            <table className="Board">
              <tbody>{tblBoard}</tbody>
            </table>
            {/* <h1>{this.state.timer}</h1> */}
            {results}
            {endResult}
            {this.state.firstKeyPress ? (
              <button onClick={this.handleResetButton}>
                Restart the Chase
              </button>
            ) : (
              undefined
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Board;
