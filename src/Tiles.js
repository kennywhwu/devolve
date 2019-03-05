import React, { Component } from 'react';
import tileAtlas from './tileAtlasGenericRPG.png';
import './Tiles.css';

const THEIGHT = 512;
const TWIDTH = 512;

class Tiles extends Component {
  makeTileList() {
    let tileArr = [];
    for (let x = 0; x < TWIDTH; x += 16) {
      for (let y = 0; y < THEIGHT; y += 16) {
        tileArr.push(
          <div className="Tiles-tileContainer">
            <br />
            <div
              className="Tiles-tile"
              style={{
                background: `url(${tileAtlas}) -${y}px -${x}px`
              }}
              alt={`${y}-${x}`}
            />
            <br />
            {`-${y}px -${x}px`}
          </div>
        );
      }
    }
    return tileArr;
  }

  render() {
    return <div className="Tiles">{this.makeTileList()}</div>;
  }
}

export default Tiles;
