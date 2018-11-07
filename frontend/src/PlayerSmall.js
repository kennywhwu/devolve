import React, { Component } from 'react';
// import './PlayerSmall.css';

class PlayerSmall extends Component {
  render() {
    const style = {
      backgroundColor: this.props.backgroundColor,
      border: this.props.border
    };
    return <td className="PlayerSmall" style={style} />;
  }
}

export default PlayerSmall;
