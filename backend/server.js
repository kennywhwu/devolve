/** server for groupchat */

const app = require('./app');

app.listen(process.env.PORT || 3005, function() {
  console.log('server started on 3005');
});
