import React, { Component } from 'react';
import './App.css';
import Board from './Board';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Board
          xDimension={10}
          yDimension={10}
          players={{ big: 1, small: 2 }}
          // playerSmall2Size={2}
          // playerBigSize={3}
        />
      </div>
    );
  }
}

export default App;
