import React, { Component } from 'react';
// import './PlayerBig.css';

class PlayerBig extends Component {
  render() {
    const style = {
      backgroundColor: this.props.backgroundColor,
      border: this.props.border
    };
    return <td className="PlayerBig" style={style} />;
  }
}

export default PlayerBig;
