/** Functionality related to chatting. */

// Room is an abstraction of a chat channel
const Room = require('./room');
const axios = require('axios');

const playerColorKey = [
  'red',
  'blue',
  'green',
  'gold',
  'tomato',
  'purple',
  'pink',
  'black',
  'brown',
  'orange',
  'magenta',
];

/** Player is a individual connection from client -> server to chat. */

class Player {
  /** make chat: store connection-device, rooom */

  constructor(send, roomName) {
    this._send = send; // "send" function for this user
    this.room = Room.get(roomName); // room user will be in
    this.name = null; // becomes the username of the visitor

    console.log(`created chat in ${this.room.name}`);
  }

  /** send msgs to this client using underlying connection-send-function */

  send(data) {
    try {
      this._send(data);
    } catch {
      // If trying to send to a user fails, ignore it
    }
  }

  /** Handle messages from client:
   *
   * - {type: "join", name: username} : join
   * - {type: "chat", text: msg }     : chat
   */

  async handleMessage(jsonData) {
    let msg = JSON.parse(jsonData);
    console.log('msg', msg);
    if (msg.type === 'join') {
      this.handleJoin(msg);
    } else if (msg.type === 'ready') {
      this.handleReady(msg);
    } else if (msg.type === 'start') {
      this.handleStart(msg);
    } else if (msg.type === 'keypress') {
      this.handleKeyPress(msg);
    } else if (msg.type === 'win') {
      this.handleWin(msg);
    } else if (msg.type === 'reset') {
      this.handleReset(msg);
    } else if (msg.type === 'lobby') {
      this.handleLobby(msg);
    } else if (msg.type === 'exit') {
      this.handleChangeExit(msg);
    } else if (msg.type === 'current_state') {
      // console.log('handleMessage', msg);
      this.handleCurrentState(msg);
    } else {
      throw new Error(`bad message: ${msg.type}`);
    }
  }

  /** handle joining: add to room members, announce join */

  handleJoin(msg) {
    if (this.room.members.size === 0 || !this.room.players['playerBig']) {
      this.room.playerMarker = 1;
      this.currentPlayer = {
        player: 'playerBig',
        color: playerColorKey[0],
        isReady: false,
      };
    } else {
      while (this.room.players[`playerSmall${this.room.playerMarker}`]) {
        this.room.playerMarker++;
      }
      this.currentPlayer = {
        player: `playerSmall${this.room.playerMarker}`,
        color: playerColorKey[this.room.playerMarker],
        isReady: false,
      };
    }
    console.log('this.currentPlayer, color', this.currentPlayer);
    this.room.join(this);

    this.room.broadcast({
      type: 'other_join',
      player: this.currentPlayer,
      playerList: this.room.players,
    });
    console.log('this.room.players', this.room.players);

    this.room.direct(this, {
      type: 'join',
      text: `${this.name} joined "${this.room.name}".`,
      player: this.currentPlayer,
      playerList: this.room.players,
    });
  }

  /** handle player ready: broadcast to room. */

  handleReady(msg) {
    console.log('handleReady ran');
    this.room.ready(this);
    this.room.broadcast({
      playerList: this.room.players,
      type: 'ready',
    });
  }

  /** handle start game: broadcast to room. */

  handleStart(msg) {
    console.log('handleStart ran');
    this.room.broadcast({
      name: this.name,
      type: 'start',
    });
  }

  /** handle a chat: broadcast to room. */

  handleChat(text) {
    this.room.broadcast({
      name: this.name,
      type: 'chat',
      text: text,
    });
  }

  /** handle a keypress: broadcast to room. */

  handleKeyPress(msg) {
    console.log('handleKeyPress msg', msg);
    let key = { ...msg.key, player: msg.player };
    // if (msg.key.player === this.currentPlayer) {
    this.room.broadcast({
      name: this.name,
      type: 'keypress',
      // state: msg.state,
      key,
      id: msg.id,
    });
    // }
  }

  /** handle win: broadcast to room. */

  handleWin(msg) {
    this.room.broadcast({
      name: this.name,
      player: this.currentPlayer,
      type: 'win',
      win: msg.win,
    });
  }
  /** handle reset: broadcast to room. */

  handleReset(msg) {
    this.room.broadcast({
      name: this.name,
      player: this.currentPlayer,
      type: 'reset',
    });
  }

  /** handle return to lobby: broadcast to room. */

  handleLobby(msg) {
    console.log('handleLobby', msg);
    this.room.broadcast({
      name: this.name,
      player: this.currentPlayer,
      type: 'lobby',
    });
  }

  /** handle change exit: broadcast to room. */

  handleChangeExit(msg) {
    let y;
    let x;

    if (Math.random() < 0.25) {
      y = 0;
      x = Math.floor(Math.random() * (msg.dimensions.x - 2)) + 1;
    } else if (Math.random() < 0.25) {
      y = msg.dimensions.y - 1;
      x = Math.floor(Math.random() * (msg.dimensions.x - 2)) + 1;
    } else if (Math.random() < 0.25) {
      y = Math.floor(Math.random() * (msg.dimensions.y - 2)) + 1;
      x = 0;
    } else {
      y = Math.floor(Math.random() * (msg.dimensions.y - 2)) + 1;
      x = msg.dimensions.x - 1;
    }
    this.room.broadcast({
      name: this.name,
      player: this.currentPlayer,
      type: 'exit',
      exit: { y, x },
    });
  }

  /** Connection was closed: leave room, announce exit to others */

  handleClose() {
    console.log('handleClose');
    this.room.leave(this);
    this.room.playerMarker = 1;
    this.room.broadcast({
      type: 'leave',
      leftPlayer: this.currentPlayer,
      playerList: this.room.players,
    });
  }

  display(data) {
    this.send(JSON.stringify(data));
  }
}

module.exports = Player;
