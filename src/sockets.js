module.exports = (io)=>{

    let users = {};

    io.on('connection', (socket) =>{
        console.log('connect', socket.id);

        socket.on('send msg', (msg, cb)=>{

            var msgp = msg.trim()

            if (msgp.substr(0,1) === '.') {
                msgp = msgp.substr(1);
                const index = msgp.indexOf(' ');
                if (index !== -1) {
                    var name = msgp.substr(0, index);
                    var msgp = msgp.substr(index + 1);
                    if (name in users) {
                        users[name].emit('private_msg', {
                            msgp,
                            user: socket.username
                        })
                    }else{
                        cb('Error usuario desconectado');
                    }
                }else{
                    cb('Ingresa un mensaje')
                }
                
            }else{
                
                io.sockets.emit('new msg', {
                    msg: msg,
                    user: socket.username
                });
            }

        })

        socket.on('new user', (data, cb) => {
            console.log(data);
            
            if (data in users) {
                cb(false);
            }else{
                cb(data)
                socket.username = data;
                users[socket.username] = socket;
                updateUser()
                // console.log( users[socket.username].username);
                
            }
        })

        socket.on('disconnect', data => {
            if (!socket.username) {
                return;
            }
            delete users[socket.username];
            updateUser()
        })


        function updateUser() {
            io.sockets.emit('users', Object.keys(users))
        }

        
    })
    
}