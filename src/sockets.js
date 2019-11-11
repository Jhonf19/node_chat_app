

module.exports = (io)=>{
    io.on('connection', (socket) =>{
        console.log('connect', socket.id);

        socket.on('send msg', (msg)=>{
            io.sockets.emit('new msg', msg);
        })
        
    })
    
}