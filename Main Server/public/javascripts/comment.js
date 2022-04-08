let socket= io();
let roomNo = null;
let name = null;

class Comment{
    id;
    roomNo;
    userID;
    date_of_issue;

    constructor(id, roomNo,userID,date_of_issue) {
        this.id = id;
        this.roomNo = roomNo;
        this.userID = userID;
        this.date_of_issue = date_of_issue;
    }
}


function init(roomNumber) {
    roomNo = roomNumber
    socket.on('chat', function (room, userId, chatText) {
        let who = userId
        if (userId === name) who = 'Me';
        writeOnHistory('<b>' + who + ':</b> ' + chatText);
    });

    // called when someone joins the room. If it is someone else it notifies the joining of the room
    socket.on('joined', function (room, userId) {
        if (userId !== name){
            // notifies that someone has joined the room
            writeOnHistory('<b>'+userId+'</b>' + ' joined room ' + room);
        }
    });


    connectToRoom()
}

function sendChatText() {
    //This function needs to have code to call db method
    let chatText = document.getElementById('comment_input').value;
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
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    // scroll to the last element
    history.scrollTop = history.scrollHeight;
    document.getElementById('comment_input').value = '';
}

