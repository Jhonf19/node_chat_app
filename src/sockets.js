module.exports = (io)=>{

    let usernames = [];

    io.on('connection', (socket) =>{
        console.log('connect', socket.id);

        socket.on('send msg', (msg)=>{
            io.sockets.emit('new msg', {
                msg: msg,
                user: socket.username
            });
        })

        socket.on('new user', (data, cb) => {
            console.log(data);
            
            if (usernames.indexOf(data) != -1) {
                cb(false);
            }else{
                cb(true)
                socket.username = data;
                usernames.push(socket.username);
            }
            updateUser()
        })

        socket.on('disconnect', data => {
            if (!socket.username) {
                return;
            }
            usernames.splice(usernames.indexOf(socket.username), 1)
            updateUser()
        })


        function updateUser() {
            io.sockets.emit('usernames', usernames)
        }

        
    })
    
}