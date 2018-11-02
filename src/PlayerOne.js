import React, { Component } from 'react';
import './PlayerOne.css';

class PlayerOne extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {};

  render() {
    return <td className="PlayerOne" />;
  }
}

export default PlayerOne;
