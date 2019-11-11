$(function () {

    const socket = io();

    //get DOM ids
    const formMsg = $('#msg-form');
    const msg = $('#msg');
    const chat = $('#chat');

    const logForm = $('#log-form');
    const userName = $('#username');
    const userError = $('#user-error');

    const userNames = $('#usernames');

    logForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', userName.val(), (data) => {
            if (data) {
                $('#content_log').hide();
                $('#content_chat').show();
                $('#content_chat').css('display','flex');
                $('#User').text(data);
            } else {
                userError.html(`
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error!</strong> nombre de usuario en uso.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                    </div>
                `);
            }
        });
        userName.val('')
    });



    //events
    formMsg.submit(e => {
        e.preventDefault();
        socket.emit('send msg', msg.val(), data =>{
            chat.append(`<p>${data}</p>`);
        });
        msg.val('');
    });

    socket.on('new msg', (msg) => {
        chat.append(`<b>${msg.user}:</b> ${msg.msg}<br><hr>`);
    })

    socket.on('users', data => {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += ` <li>${data[i]}</li>`;
            
        }
        userNames.html(html);
    })

    socket.on('private_msg', data => {
        chat.append(`<p><b>@${data.user}:<b> ${data.msgp}</p>`);
    })

})