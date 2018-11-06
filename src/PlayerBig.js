import React, { Component } from 'react';
// import silas from './silas.png';
// import './PlayerBig.css';

class PlayerBig extends Component {
  render() {
    const style = {
      // backgroundImage: `url(${silas})`,
      backgroundColor: this.props.backgroundColor,
      border: this.props.border
    };

    return <td className="PlayerBig" style={style} />;
  }
}

export default PlayerBig;
