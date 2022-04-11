import * as database from './database.js';

let socket= io();
let roomNo = null;
let name = null;

class Comment{
    roomNo;
    userID;
    date_of_issue;
    chatText;

    constructor(id, roomNo,userID,date_of_issue,chatText) {
        this.roomNo = roomNo;
        this.userID = userID;
        this.date_of_issue = date_of_issue;
        this.chatText = chatText;
    }
}


function initRoom(roomNumber) {
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
window.initRoom = initRoom

function sendChatText() {
    //get time and create a string out of it
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    let chatText = document.getElementById('comment_input').value;
    socket.emit('chat', roomNo, name, chatText);
    //Store comment in browser
    let comment = new Comment(roomNo,userId,time,chatText);
    database.storeComment(comment)
        .then(r => console.log("Comment stored successfully."))
        .catch(r => console.log("Error storing comment"));
}
window.sendChatText = sendChatText

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

