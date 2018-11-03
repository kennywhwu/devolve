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
    {
      /* <td className="PlayerBig" background={this.props.image} style={style}>
<img src={silas} alt="silas" width="60" height="60" />
</td>  */
    }
    return <td className="PlayerBig" style={style} />;
  }
}

export default PlayerBig;
