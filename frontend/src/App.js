import React, { Component } from 'react';
import './App.css';
import Board from './Board';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Board xDimension={15} yDimension={15} players={{ big: 1, small: 1 }} />
      </div>
    );
  }
}

export default App;
