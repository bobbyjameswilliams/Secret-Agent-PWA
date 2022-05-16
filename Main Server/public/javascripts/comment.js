import * as database from './database.js';
import * as canvas from './canvas.js';

let socket= io();
let roomNo = null;
let name = null;

/**
 * Comment class used when storing a comment in IDB
 */
class Comment{
    roomNo;
    userID;
    date_of_issue;
    chatText;
    joinedRoomNotification;

    constructor(roomNo,userID,date_of_issue,chatText, joinedRoomNotification) {
        this.roomNo = roomNo;
        this.userID = userID;
        //epoch date
        this.date_of_issue = date_of_issue;
        this.chatText = chatText;
        this.joinedRoomNotification = joinedRoomNotification
    }
}

function writeChatToScreen(userId, chatText) {
    //get time and create a string out of it
    var time = Date.now();
    let comment = new Comment(roomNo, userId, time, chatText, false);
    //Cache comment in IDB
    database.storeComment(comment)
        .then(() => console.log("storeComment ran."))
        .catch(() => console.log("Error storing comment"));

    let preparedChatMessage = prepareChatMessage(userId, chatText)
    writeOnHistory(preparedChatMessage);
}

/**
 * Initialises room
 * @param roomNumber
 * @param username
 */

function initRoom(roomNumber, username, image) {
    //database.getArticlesMongo().then(r => console.log(r)).catch(r => console.log(r));
    console.log("Initialising Room")
    name = username;
    roomNo = roomNumber;

    //Remove history from chat
    let history = document.getElementById('history');
    history.innerHTML = '';
    //Load in and display previous chat history

    console.log("Begin loading cached history...")
    loadAndDisplayCachedHistory(roomNo)
        .then(() => console.log("Successfully displayed chat history"))
        .catch(() =>
            console.log("Error displaying chat history")
            )

    //Prepare chat socket.
    socket.on('chat', function (room, userId, chatText) {
        if (userId !== name){
            writeChatToScreen(userId, chatText);
        }
    });

    // called when someone joins the room. If it is someone else it notifies the joining of the room
    socket.on('joined', function (room, userId) {
        if (userId !== name){
            // notifies that someone has joined the room
            //get time and create string
            var time = Date.now();
            let comment = new Comment(roomNo,userId,time,null, true);
            //Cache comment in IDB
            database.storeComment(comment)
                .then(r => console.log("storeComment ran."))
                .catch(r => console.log("Error storing comment"));

            let preparedJoinedRoomNotification = prepareJoinedRoomNotification(room, userId)
            writeOnHistory(preparedJoinedRoomNotification);
        }
    });

    socket.on('knowledge snippet', function (room, userId, header, body, colour){
        let card = createCard(header, body, colour);
        writeKnowledgeCard(card);
    });

    connectToRoom(image)
}
window.initRoom = initRoom

/**
 * Sends chat text via socket.
 */
function sendChatText() {
    let chatText = document.getElementById('comment_input').value;
    writeChatToScreen(name, chatText)
    socket.emit('chat', roomNo, name, chatText);
}
window.sendChatText = sendChatText



/**
 * Connects to room
 */
function connectToRoom(image) {
    //roomNo = document.getElementById('roomNo').value;
    //name = document.getElementById('name').value;
    //let imageUrl= document.getElementById('image_url').value;
    if (!name) name = 'Unknown-' + Math.random();
    //@todo join the room
    socket.emit('create or join', roomNo, name);
    // TODO: change imageURL
    canvas.initCanvas(socket,image, roomNo, name);
}

/**
Prepares chat messages for writeOnHistory
 */
function prepareChatMessage(userId, chatText){
    let who = userId
    if (userId === name) {who = 'Me'}
    return('<b>' + who + ':</b> ' + chatText)
}

/**
Prepares joined room notifications for writeOnHistory
 */
function prepareJoinedRoomNotification(room, userId){
    if (userId !== name){
        // notifies that someone has joined the room
        return ('<b>'+userId+'</b>' + ' joined the room.');
    }
}

/**
    Loads cached chat history and calls display method
 */
async function loadAndDisplayCachedHistory(roomNo){
    database.retrieveAllCachedRoomComments(roomNo)
        .then(r => displayCachedHistory(r))
        .catch(() => console.log("No chat messages loaded"))
}

/**
    Takes a list of message objects and writes them to history.
 */
function displayCachedHistory(cachedData){
    for (let res of cachedData)
        if (res.joinedRoomNotification) {
            let preparedJoinedRoomNotification = prepareJoinedRoomNotification(res.roomNo, res.userID)
            writeOnHistory(preparedJoinedRoomNotification)
        } else {
            let preparedChatMessage = prepareChatMessage(res.userID, res.chatText)
            writeOnHistory(preparedChatMessage);
        }
}

/**
 * Writes text on history. Used for displaying something in the chat history.
 * @param text Text to be added to chat history.
 */
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

function sendKnowledgeSnippet(header, body, colour){
    socket.emit('knowledge snippet',roomNo,name,header,body,colour)
}
window.sendKnowledgeSnippet = sendKnowledgeSnippet

function removeChatSocketListeners(){
    socket.removeAllListeners();
}
window.removeChatSocketListeners =removeChatSocketListeners