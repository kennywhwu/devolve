import React, { Component } from 'react';
import './Board.css';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = { board: this.createBoard() };
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
    console.log('board ', board);
    return board;
  }

  render() {
    let tblBoard = [];
    for (let y = 0; y < this.props.yDimension; y++) {
      let row = [];
      for (let x = 0; x < this.props.xDimension; x++) {
        let coord = `${y}-${x}`;
        row.push(<td className="cell" key={coord} coord={coord} />);
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
