$(function () {
    
    const socket = io();

    //get DOM ids
    const formMsg = $('#msg-form');
    const msg = $('#msg');
    const chat = $('#chat');

    //events
    formMsg.submit( e => {
        e.preventDefault();
        socket.emit('send msg', msg.val());
        msg.val('');
    });

    socket.on('new msg', (msg)=>{
        chat.append(`${msg}<br><hr>`);
    })

})