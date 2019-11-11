const express = require('express');
const app = express();
const socketIO = require('socket.io');
const path = require('path');

//env
// require('dotenv').config({path: 'variables.env'});
// console.log(process.env.DB_URL);

//statics
app.use(express.static(path.join(__dirname, 'public')))

//set
app.set('port', process.env.PORT || 3000);

//server
const server = app.listen(app.get('port'), ()=>{
    console.log('server on port', app.get('port'));
})


//webSocket
const io = socketIO(server);
require('./sockets')(io)
