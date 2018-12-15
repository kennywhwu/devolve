/** app for devolve */

const express = require('express');
app = express();

// serve stuff in static/ folder

app.use(express.static('static/'));
const path = require('path');

/** Handle websocket */

// allow for app.ws routes for websocket routes
const wsExpress = require('express-ws')(app);

const Player = require('./player');

app.ws('/:roomName', function(ws, req, next) {
  try {
    const user = new Player(
      ws.send.bind(ws), // fn to call to message this user
      req.params.roomName // name of room for user
    );

    // register handlers for message-received, connection-closed

    ws.on('message', function(data) {
      try {
        user.handleMessage(data);
      } catch (err) {
        console.error(err);
      }
    });

    ws.on('close', function() {
      try {
        user.handleClose();
      } catch (err) {
        console.error(err);
      }
    });
  } catch (err) {
    console.error(err);
  }
});

/** serve homepage --- just static HTML
 *
 * Allow any roomName to come after homepage --- client JS will find the
 * roomname in the URL.
 *
 * */

// app.get('/:roomName', function(req, res, next) {
//   // res.sendFile(`${__dirname}/chat.html`);
//   res.sendFile('index.html', {
//     root: path.join(__dirname, '../frontend/public')
//   });
// });

module.exports = app;
