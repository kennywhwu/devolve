
![Devolve Logo](/devolve_logo.png?raw=true 'Devolve Logo')

<img align="center" width="400" height="100" src="/devolve_logo.png?raw=true">

Devolve is an asymmetric multiplayer game built with [React](http://www.reactjs.org) and [Node.js](https://nodejs.org) over [websockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).

![Devolve Snapshot](/devolve_readme1.png?raw=true 'Devolve Snapshot')




## Prerequisites

The game requires a backend server, on which the client will connect to through websockets.

From cloned repo folder, navigate to /backend folder and install dependencies:

```
cd backend
npm install
```

Start up node server:

```
nodemon server.js
```

On separate terminal window, navigate to /frontend folder and install client-side dependencies:

```
cd frontend
npm install
```

Start up frontend React server:

```
npm start
```

App should start running with client-side connecting to backend. Open up multiple tabs to simulate multiple players entering game.

App is playable on mobile; however it is not optimized for fair play, as mobile players have to continuously tap on arrow buttons while computer players have the advantage of holding movement keys down.

## Game Description

### Starting a game

Devolve is intended to be a multiplayer experience, and therefore requires at least 2 clients (or multiple tabs) to access the server before the game can start.

A new instance of the game can be started by adding a different endpoint to the URL (so multiple games can be played from same app). Example:

```
http://localhost:3000/new-game
```

#### Lobby

As players join the server, they enter the lobby. All players in the lobby must indicate readiness by clicking on "Ready" button. Once all players are ready, the game can start by clicking "Start the Chase" button.

![Devolve Lobby](/devolve_readme1.gif?raw=true 'Devolve Lobby')

#### Board

The game board is set with uncrossable borders. The board size grows proportional to the number of players in the game. An exit will randomly generate periodically for players to escape through.

![Devolve Play](/devolve_readme2.gif?raw=true 'Devolve Play')

#### Beast

One player represents "The Beast," who is larger and will continue to grow at a constant rate depending on the number of players in the game. The Beast's goal is to chase down and eat other players by colliding with them.

#### Prey

The other players are the Beast's prey and are trying to avoid it and escape through the exit.

## Future Features

Future versions are planned to add following features:

- Optimize for mobile play; enable continuous hold on arrow buttons to move player
- Enable button to return from in-progress game back to lobby
- Randomize player assignment each time new game is started
- Set delay on Beast to slow down movement
- Hide exit from Beast player
- Implement usernames and chatting
- Allow for players in lobby to vote to kick out a hanging client and start game
