import React, { Component } from 'react';
// import './Loading.css';
import Board from './Board';
import Ready from './Ready';

const urlParts = document.URL.split('/');
const roomName = urlParts[urlParts.length - 1];

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      gameReady: false,
      playersReady: false,
      currentPlayer: { player: '', color: '' },
      playerList: {}
    };
    this.handleStart = this.handleStart.bind(this);
    this.handleReady = this.handleReady.bind(this);
  }

  componentDidMount() {
    this.connection = new WebSocket(
      `ws://192.168.1.175:3005/devolve/${roomName}`
    );

    this.connection.onopen = evt => {
      let data = { type: 'join' };
      this.connection.send(JSON.stringify(data));
    };

    this.connection.onmessage = evt => {
      let data = JSON.parse(evt.data);

      if (data.type === 'join') {
        this.setState({
          currentPlayer: data.player,
          playerList: data.playerList,
          isLoading: false
        });
      }
      if (data.type === 'other_join') {
        this.setState({ playerList: data.playerList });
      }
      if (data.type === 'leave') {
        this.setState({ playerList: data.playerList });
      }
      if (data.type === 'ready') {
        this.setState({ playerList: data.playerList }, () => {
          if (
            Object.values(this.state.playerList)
              .map(player => player.isReady)
              .every(e => e === true)
          ) {
            this.setState({ playersReady: true });
          } else {
            this.setState({ playersReady: false });
          }
        });
      }
      if (data.type === 'start') {
        this.setState({ gameReady: true });
      }
    };
  }

  handleReady() {
    this.connection.send(
      JSON.stringify({
        type: 'ready'
      })
    );
  }

  handleStart() {
    this.connection.send(
      JSON.stringify({
        type: 'start'
      })
    );
  }

  render() {
    return (
      <div className="Loading">
        {this.state.isLoading ? (
          <h1>Game Loading...</h1>
        ) : (
          <div>
            {!this.state.gameReady ? (
              <Ready
                handleReady={this.handleReady}
                handleStart={this.handleStart}
                currentPlayer={this.state.currentPlayer}
                playerList={this.state.playerList}
                playersReady={this.state.playersReady}
              />
            ) : (
              <Board
                xDimension={20}
                yDimension={20}
                players={{
                  big: 1,
                  small: Object.keys(this.state.playerList).length - 1
                }}
                currentPlayer={this.state.currentPlayer}
                connection={this.connection}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Loading;
