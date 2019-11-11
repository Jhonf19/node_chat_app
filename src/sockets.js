const Chat = require('./models/Chat')

module.exports = (io)=>{

    let users = {};

    io.on('connection', async (socket) =>{
        // console.log('connect', socket.id);

       let msgs = await Chat.find({}).limit(10)
       socket.emit('load all msgs', msgs);

        socket.on('send msg', async (msg, cb)=>{

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
                var newMsg = new Chat({
                    msg: msg,
                    user: socket.username
                });
                await newMsg.save();

                io.sockets.emit('new msg', {
                    msg: msg,
                    user: socket.username
                });
            }

        })

        socket.on('new user', (data, cb) => {
            // console.log(data);
            
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