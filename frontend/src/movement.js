function movePlayer(player, direction) {
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
    board,
    bigWin
  };

  // Change state
  this.setState(changedState);

  // Check for eaten/win conditions
  this.checkEaten();
  this.checkWin();
}

export default movePlayer;
