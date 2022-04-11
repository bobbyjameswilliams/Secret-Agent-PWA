import * as database from './database.js';

let socket= io();
let roomNo = null;
let name = null;

class Comment{
    roomNo;
    userID;
    date_of_issue;
    chatText;

    constructor(roomNo,userID,date_of_issue,chatText) {
        this.roomNo = roomNo;
        this.userID = userID;
        this.date_of_issue = date_of_issue;
        this.chatText = chatText;
    }
}


function initRoom(roomNumber) {
    roomNo = roomNumber
    //Load in and display previous chat history


    //Prepare chat socket.
    socket.on('chat', function (room, userId, chatText) {
        //get time and create a string out of it
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let comment = new Comment(roomNo,userId,time,chatText);
        //Cache comment in IDB
        database.storeComment(comment)
            .then(r => console.log("storeComment ran."))
            .catch(r => console.log("Error storing comment"));

        let preparedChatMessage = prepareChatMessage(userId, chatText)
        writeOnHistory(preparedChatMessage);
    });

    // called when someone joins the room. If it is someone else it notifies the joining of the room
    socket.on('joined', function (room, userId) {
        if (userId !== name){
            // notifies that someone has joined the room
            let preparedJoinedRoomNotification = prepareJoinedRoomNotification(room, userId)
            writeOnHistory(preparedJoinedRoomNotification);
        }
    });

    connectToRoom()
}
window.initRoom = initRoom

function sendChatText() {
    let chatText = document.getElementById('comment_input').value;
    socket.emit('chat', roomNo, name, chatText);
}
window.sendChatText = sendChatText

function connectToRoom() {
    //roomNo = document.getElementById('roomNo').value;
    //name = document.getElementById('name').value;
    //let imageUrl= document.getElementById('image_url').value;
    if (!name) name = 'Unknown-' + Math.random();
    //@todo join the room
    socket.emit('create or join', roomNo, name);
    // TODO: change imageURL
    initCanvas(socket,"/images/cathedral.jpg");
}

/*
Prepares chat messages for writeOnHistory
 */
function prepareChatMessage(userId, chatText){
    let who = userId
    if (userId === name) {who = 'Me'}
    return('<b>' + who + ':</b> ' + chatText)
}

/*
Prepares joined room notifications for writeOnHistory
 */
function prepareJoinedRoomNotification(room, userID){
    if (userId !== name){
        // notifies that someone has joined the room
        return ('<b>'+userId+'</b>' + ' joined room ' + room);
    }
}

async function loadAndDisplayCachedHistory(roomNo){

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

