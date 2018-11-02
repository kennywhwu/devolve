import React, { Component } from 'react';
import './Board.css';
import PlayerOne from './PlayerOne';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.createBoard(),
      playerOnePosition: [props.yDimension - 1, 0]
    };
    this.registerKeyPress = this.registerKeyPress.bind(this);
    this.movePlayerOne = this.movePlayerOne.bind(this);
    window.document.addEventListener('keyup', this.registerKeyPress);
  }

  static defaultProps = {
    xDimension: 10,
    yDimension: 6
  };

  createBoard() {
    let board = Array.from({ length: this.props.yDimension }).map((e1, y) => {
      return Array.from({ length: this.props.xDimension }).map((e2, x) => {
        return 0;
      });
    });
    return board;
  }

  registerKeyPress(evt) {
    switch (evt.keyCode) {
      //Player 1 controls
      case 65: //left
        console.log('left player 1');
        this.movePlayerOne('left');
        break;

      case 87: // up
        console.log('up player 1');
        this.movePlayerOne('up');
        break;

      case 68: // right
        console.log('right player 1');
        this.movePlayerOne('right');
        break;

      case 83: // down
        console.log('down player 1');
        this.movePlayerOne('down');
        break;

      //Player 2 controls
      case 37: //left
        console.log('left player 2');

        break;

      case 38: // up
        console.log('up player 2');

        break;

      case 39: // right
        console.log('right player 2');

        break;

      case 40: // down
        console.log('down player 2');

        break;

      default:
        return; // exit this handler for other keys
    }
  }

  // up moves player [y-1, 0]
  movePlayerOne(direction) {
    console.log('movePlayerOne ran');
    let yChange = 0;
    let xChange = 0;
    let board = this.state.board;
    let [oldY, oldX] = this.state.playerOnePosition;

    if (direction === 'up') {
      yChange = -1;
    } else if (direction === 'down') {
      yChange = +1;
    } else if (direction === 'left') {
      xChange = -1;
    } else if (direction === 'right') {
      xChange = +1;
    }

    let playerOneNewPosition = [oldY + yChange, oldX + xChange];
    let [newY, newX] = playerOneNewPosition;

    if (
      newX >= 0 &&
      newX < this.props.xDimension &&
      newY >= 0 &&
      newY < this.props.yDimension
    ) {
      board[newY][newX] = 1;
      board[oldY][oldX] = 0;
    }

    this.setState(st => ({
      playerOnePosition: [
        st.playerOnePosition[0] + yChange,
        st.playerOnePosition[1] + xChange
      ],
      board
    }));
    console.log('p1Position ', this.state.playerOnePosition);
  }

  render() {
    let tblBoard = [];
    for (let y = 0; y < this.props.yDimension; y++) {
      let row = [];
      for (let x = 0; x < this.props.xDimension; x++) {
        let coord = `${y}-${x}`;
        if (
          coord ===
          `${this.state.playerOnePosition[0]}-${
            this.state.playerOnePosition[1]
          }`
        ) {
          row.push(<PlayerOne />);
        } else {
          row.push(
            <td
              className="cell"
              key={coord}
              coord={coord}
              onKeyUp={evt => this.registerKeyPress(evt)}
            />
          );
        }
      }
      tblBoard.push(
        <tr key={y} row={y}>
          {row}
        </tr>
      );
    }
    console.log('playerOnePosition ', this.state.playerOnePosition);
    return (
      <table className="Board">
        <tbody>{tblBoard}</tbody>
      </table>
    );
  }
}

export default Board;
