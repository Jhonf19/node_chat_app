const express = require('express');
const app = express();
const socketIO = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');

//env
require('dotenv').config({path: 'vars.env'});
// console.log(process.env.DB_LOCAL);

//statics
app.use(express.static(path.join(__dirname, 'public')))

//set
app.set('port', process.env.PORT || 3000);

//db conect
mongoose.connect(process.env.DB_LOCAL || process.env.DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(db => console.log('DB ok'))
.catch(err => console.log(err));

//server
const server = app.listen(app.get('port'), ()=>{
    console.log('server started on port', app.get('port'));
})


//webSocket
const io = socketIO(server);
require('./sockets')(io)
