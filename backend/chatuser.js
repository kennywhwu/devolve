/** Functionality related to chatting. */

// Room is an abstraction of a chat channel
const Room = require('./Room');
const axios = require('axios');

/** ChatUser is a individual connection from client -> server to chat. */

class ChatUser {
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

  /** handle joining: add to room members, announce join */

  handleJoin(msg) {
    // this.name = msg.name;
    console.log('room size', this.room.player, this.room.members.size);
    if (this.room.members.size === 0) {
      this.room.player = 0;
      this.player = 'playerBig';
    }

    // } else if (data.player === 3) {
    //   this.player = 'playerSmall2';

    // if (this.room.members.size === 0) {
    //   this.room.player = 0;
    // } else {
    //   this.room.player++;
    // }

    // if (this.room.player === 0) {
    //   this.player = 'playerBig';
    // } else {
    //   this.player = `playerSmall${this.room.player}`;
    //   // } else if (data.player === 3) {
    //   //   this.player = 'playerSmall2';
    // }
    this.room.join(this);
    console.log('this.player', this.player);
    this.room.broadcast({
      type: 'other_join',
      text: `${this.name} joined "${this.room.name}".`
    });

    this.room.direct(this, {
      type: 'join',
      text: `${this.name} joined "${this.room.name}".`,
      player: this.player,
      state: msg.state
    });
  }

  /** handle a chat: broadcast to room. */

  handleChat(text) {
    this.room.broadcast({
      name: this.name,
      type: 'chat',
      text: text
    });
  }
  /** handle a keypress: broadcast to room. */

  handleKeyPress(msg) {
    console.log('handleKeyPress msg', msg);
    let key = { ...msg.key, player: msg.player };
    // if (msg.key.player === this.player) {
    this.room.broadcast({
      name: this.name,
      type: 'keypress',
      // state: msg.state,
      key
    });
    // }
  }
  /** handle win: broadcast to room. */

  handleWin(msg) {
    this.room.broadcast({
      name: this.name,
      player: this.player,
      type: 'win',
      win: msg.win
    });
  }
  /** handle reset: broadcast to room. */

  handleReset(msg) {
    this.room.broadcast({
      name: this.name,
      player: this.player,
      type: 'reset'
    });
  }

  /** handle current state: broadcast to room. */

  handleCurrentState(msg) {
    console.log('this.room.player', this.room.player);
    console.log('this.room.members.size', this.room.members.size);

    if (this.room.player >= this.room.members.size - 1) {
      this.player = `playerSmall${this.room.members.size - 1}`;
    } else if (this.room.player >= 0) {
      this.room.player++;
      this.player = `playerSmall${this.room.player}`;
    } else {
      this.player = 'playerBig';
    }
    msg.state.currentPlayer = this.player;
    this.room.broadcast({
      name: this.name,
      player: this.player,
      type: 'current_state',
      state: msg.state
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
      player: this.player,
      type: 'exit',
      exit: { y, x }
    });
  }

  /** Handle messages from client:
   *
   * - {type: "join", name: username} : join
   * - {type: "chat", text: msg }     : chat
   */

  async handleMessage(jsonData) {
    let msg = JSON.parse(jsonData);
    // console.log('msg ', msg);
    if (msg.type === 'join') {
      this.handleJoin(msg);
    } else if (msg.type === 'chat') {
      this.handleChat(msg.text);
    } else if (msg.type === 'joke') {
      this.handleJoke(await this.makeJokeRequest());
    } else if (msg.type === 'keypress') {
      this.handleKeyPress(msg);
      console.log('handleMessage', msg);
    } else if (msg.type === 'win') {
      this.handleWin(msg);
    } else if (msg.type === 'reset') {
      this.handleReset(msg);
    } else if (msg.type === 'exit') {
      this.handleChangeExit(msg);
    } else if (msg.type === 'current_state') {
      // console.log('handleMessage', msg);
      this.handleCurrentState(msg);
    } else {
      throw new Error(`bad message: ${msg.type}`);
    }
  }

  /** Connection was closed: leave room, announce exit to others */

  handleClose() {
    console.log('handleClose');
    this.room.leave(this);
    this.room.broadcast({
      type: 'note',
      text: `${this.name} left ${this.room.name}.`
    });
  }

  async makeJokeRequest() {
    let response = await axios.get('https://icanhazdadjoke.com/', {
      headers: { accept: 'application/json' }
    });
    return response.data.joke;
  }

  async handleJoke(joke) {
    this.display({
      name: this.name,
      type: 'chat',
      text: joke
    });
  }

  display(data) {
    this.send(JSON.stringify(data));
  }
}

module.exports = ChatUser;
