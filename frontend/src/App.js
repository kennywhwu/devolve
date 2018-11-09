import React, { Component } from 'react';
import './App.css';
import Board from './Board';

const urlParts = document.URL.split('/');
const roomName = urlParts[urlParts.length - 1];

class App extends Component {
  //   state = { isLoading: true, currentPlayer:null };

  //   componentDidMount() {
  //     this.connection = new WebSocket(
  //       `ws://192.168.1.175:3005/devolve/${roomName}`
  //     );

  //     this.connection.onopen = evt => {
  //       let data = { type: 'join' };
  //       this.connection.send(JSON.stringify(data));
  //     };

  //     this.connection.onmessage = evt => {
  //       let data = JSON.parse(evt.data);
  //       if (data.type === 'join') {
  //         this.setState({ currentPlayer: data.player });
  //       }
  //   }
  // }
  render() {
    return (
      <div className="App">
        {/* {this.state.isLoading ? <h1>Game Loading...</h1> : */}
        <Board
          xDimension={20}
          yDimension={20}
          players={{ big: 1, small: 5 }}
          // currentPlayer={this.state.currentPlayer}
        />
        {/* } */}
      </div>
    );
  }
}

export default App;
