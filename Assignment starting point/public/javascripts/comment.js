let socket= io();
let roomNo = null;
let name = null;

function init() {
    socket.on('chat', function (room, userId, chatText) {
        let who = userId
        if (userId === name) who = 'Me';
        writeOnHistory('<b>' + who + ':</b> ' + chatText);
    });
}

function sendChatText(roomNumber,userName) {
    roomNo = roomNumber;
    name = userName;
    let chatText = document.getElementById(roomNo+'comment_input').value;
    connectToRoom()
    socket.emit('chat', roomNo, name, chatText);
}

function connectToRoom() {
    //roomNo = document.getElementById('roomNo').value;
    //name = document.getElementById('name').value;
    //let imageUrl= document.getElementById('image_url').value;
    if (!name) name = 'Unknown-' + Math.random();
    //@todo join the room
    socket.emit('create or join', roomNo, name);
    //initCanvas(socket, imageUrl);
    //hideLoginInterface(roomNo, name);
}

function writeOnHistory(text) {
    if (text==='') return;
    let history = document.getElementById(roomNo+'history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    // scroll to the last element
    history.scrollTop = history.scrollHeight;
    document.getElementById(roomNo+'comment_input').value = '';
}

