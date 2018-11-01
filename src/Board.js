import React, { Component } from 'react';
import './Board.css';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = { board: this.createBoard() };
  }
  static defaultProps = {
    dimension: 3
  };

  createBoard() {
    let board = Array.from({ length: this.props.dimension }).map((e1, y) => {
      return Array.from({ length: this.props.dimension }).map((e2, x) => {
        return 0;
      });
    });
    return board;
  }

  render() {
    let tblBoard = [];
    for (let y = 0; y < this.props.dimension; y++) {
      let row = [];
      for (let x = 0; x < this.props.dimension; x++) {
        let coord = `${y}-${x}`;
        row.push(<td className="cell" />);
      }
      tblBoard.push(<tr key={y}>{row}</tr>);
      return (
        <table className="Board">
          <tbody>{tblBoard}</tbody>
        </table>
      );
    }
  }
}

export default Board;
