import React, { Component } from 'react';
import './App.css';
import Board from './Board';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Board xDimension={20} yDimension={20} players={{ big: 1, small: 2 }} />
      </div>
    );
  }
}

export default App;
