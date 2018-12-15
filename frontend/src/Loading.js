import React, { Component } from 'react';
// import './Loading.css';
import Board from './Board';
import Ready from './Ready';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3005';
const WEBSOCKET_URL =
  BASE_URL.substring(0, 5) === 'https'
    ? BASE_URL.replace(/^https/, 'wss')
    : BASE_URL.replace(/^http/, 'ws');
const urlParts = document.URL.split('/');
const roomName = urlParts[urlParts.length - 1] || 'game';

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      gameReady: false,
      playersReady: false,
      currentPlayer: { player: '', color: '' },
      playerList: {},
    };
    this.handleStart = this.handleStart.bind(this);
    this.handleReady = this.handleReady.bind(this);
    this.handleLobby = this.handleLobby.bind(this);
  }

  componentDidMount() {
    // Set up new websocket
    this.connection = new WebSocket(`${WEBSOCKET_URL}/${roomName}`);
    console.log('this.connection', this.connection);
    // On open, send join data to server
    this.connection.onopen = evt => {
      console.log('open occurred');
      this.connection.send(JSON.stringify({ type: 'join' }));
    };

    // On receiving signal from
    this.connection.onmessage = evt => {
      let data = JSON.parse(evt.data);

      if (data.type === 'join') {
        this.setState({
          currentPlayer: data.player,
          playerList: data.playerList,
          isLoading: false,
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
              .every(e => e === true) &&
            Object.values(this.state.playerList).length > 1
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
        type: 'ready',
      })
    );
  }

  handleStart() {
    this.connection.send(
      JSON.stringify({
        type: 'start',
      })
    );
  }

  handleLobby() {
    this.setState({ gameReady: false });
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
                xDimension={10 + 2 * Object.keys(this.state.playerList).length}
                yDimension={10 + 2 * Object.keys(this.state.playerList).length}
                players={{
                  big: 1,
                  small: Object.keys(this.state.playerList).length - 1,
                }}
                currentPlayer={this.state.currentPlayer}
                handleLobby={this.handleLobby}
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
