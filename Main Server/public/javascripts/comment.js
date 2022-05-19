import * as database from './database.js';
import * as canvas from './canvas.js';

let socket= io();
let roomNo = null;
let name = null;

/**
 * Message type enum for denoting how to handle message.
 * @type {{Chat: string, Joined: string, Knowledge: string}}
 */
const MessageType = {
    Joined: 'Joined',
    Knowledge: 'Knowledge',
    Comment: 'Comment'
};

/**
 * Comment class used when storing a comment in IDB
 */
class Comment{
    roomNo;
    userID;
    date_of_issue;
    chatText;
    messageType;
    headerText;
    colour;


    constructor(roomNo,userID,date_of_issue,chatText, messageType, headerText, colour) {
        this.roomNo = roomNo;
        this.userID = userID;
        //epoch date
        this.date_of_issue = date_of_issue;
        this.chatText = chatText;
        this.headerText = headerText;
        this.colour = colour;
        this.messageType = messageType;
    }
}

/**
 * Initialises room
 * @param roomNumber
 * @param username
 * @param image
 * @param title
 * @param description
 * @param author_name
 * @param date_of_issue
 */
function initRoom(roomNumber, username, image, title, description, author_name, date_of_issue) {
    //database.getArticlesMongo().then(r => console.log(r)).catch(r => console.log(r));
    name = username;
    roomNo = roomNumber;

    //Remove history from chat
    let history = document.getElementById('history');
    history.innerHTML = '';
    //Load in and display previous chat history

    loadAndDisplayCachedHistory(roomNo)
        .then(() => console.log("Successfully displayed chat history"))
        .catch(() =>
            console.log("Error displaying chat history")
            )

    //Prepare chat socket.
    socket.on('chat', function (userId, chatText) {
        writeChatToScreen(userId, chatText);
    });

    // called when someone joins the room. If it is someone else it notifies the joining of the room
    socket.on('joined', function (room, userId) {
        // notifies that someone has joined the room
        //get time and create string
        let time = Date.now();
        let comment = new Comment(roomNo,userId,time,null, MessageType.Joined, null, null);
        //Cache comment in IDB
        database.storeComment(comment)
            .then(() => console.log("storeComment ran."))
            .catch(() => console.log("Error storing comment"));

        let preparedJoinedRoomNotification = prepareJoinedRoomNotification(room, userId)
        writeOnHistory(preparedJoinedRoomNotification);
    });

    socket.on('knowledge snippet', function (room, userId, header, body, colour){
        let time = Date.now();
        let comment = new Comment(room, userId, time, body, MessageType.Knowledge, header, colour)
        let card = createCard(header, body, colour);
        writeKnowledgeCard(card);
        database.storeComment(comment)
            .then(() => console.log("Storing Knowledge Snippet."))
            .catch(r => console.log("Error storing comment " + r));
    });

    connectToRoom(image, title, description, author_name, date_of_issue)
}
window.initRoom = initRoom

/**
 * Connects to room. Initialises canvas too, sending article data through to be displayed.
 * @param image
 * @param title
 * @param description
 * @param author_name
 * @param date_of_issue
 */
function connectToRoom(image, title, description, author_name, date_of_issue) {
    if (!name) name = 'Unknown-' + Math.random();
    socket.emit('create or join', roomNo, name);
    canvas.initCanvas(socket,image, roomNo, name, title, description, author_name, date_of_issue);
}

// ######## Chat writing handlers ###########

/**
 * Hanndles chat text IDB storing, then passes the message on to be prepared and written on history.
 * @param userId
 * @param chatText
 */
function writeChatToScreen(userId, chatText) {
    //get time and create a string out of it
    var time = Date.now();
    let comment = new Comment(roomNo, userId, time, chatText, MessageType.Comment, null, null);

    //Cache comment in IDB
    database.storeComment(comment)
        .then(() => console.log("storeComment ran."))
        .catch(() => console.log("Error storing comment"));

    //Write to chat history.
    let preparedChatMessage = prepareChatMessage(userId, chatText)
    writeOnHistory(preparedChatMessage);
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

// ####### Sending ##########

/**
 * Sends chat text in the chat box via socket.
 */
function sendChatText() {
    let chatText = document.getElementById('comment_input').value;
    writeChatToScreen(name, chatText)
    socket.emit('chat', roomNo, name, chatText);
}
window.sendChatText = sendChatText

/**
 * Sends knowledge snippet out of knowledge snippet socket
 * @param header
 * @param body
 * @param colour
 */
function sendKnowledgeSnippet(header, body, colour){
    socket.emit('knowledge snippet',roomNo,name,header,body,colour)
}
window.sendKnowledgeSnippet = sendKnowledgeSnippet

//####### Message preparation #########

/**
 * Prepares chat messages for writeOnHistory
 * @param userId
 * @param chatText
 * @returns {string}
 */
function prepareChatMessage(userId, chatText){
    let who = userId
    if (userId === name) {who = 'Me'}
    return('<b>' + who + ':</b> ' + chatText)
}

/**
 * Prepare joined room notification for writeOnHistory
 * @param room
 * @param userId
 * @returns {string}
 */
function prepareJoinedRoomNotification(room, userId){
    if (userId !== name){
        // notifies that someone has joined the room
        return ('<b>'+userId+'</b>' + ' joined the room.');
    }
}

/**
 * Prepare joined room notification for when message is being retrieved from IDB
 * @param room
 * @param userId
 * @returns {string}
 */
function prepareRetrievedJoinedRoomNotification(room,userId){
    // notifies that someone has joined the room
    return ('<b>'+userId+'</b>' + ' joined the room.');
}

// ########## Caching ##########

/**
 * Loads cached history from idb given a room number
 * @param roomNo Room number to retrieve comments for.
 * @returns {Promise<void>}
 */
async function loadAndDisplayCachedHistory(roomNo){
    database.retrieveAllCachedRoomComments(roomNo)
        .then(r => displayCachedHistory(r))
        .catch(() => console.log("No chat messages loaded"))
}

/**
 * Takes a list of comment objects and writes them to history, handling them differently based on
 * messageType.
 * @param cachedData list of comment objects.
 */
function displayCachedHistory(cachedData){
    for (let res of cachedData)
        if (res.messageType === MessageType.Joined) {
            let preparedJoinedRoomNotification = prepareRetrievedJoinedRoomNotification(res.roomNo, res.userID)
            writeOnHistory(preparedJoinedRoomNotification)
        } else if (res.messageType === MessageType.Comment) {
            let preparedChatMessage = prepareChatMessage(res.userID, res.chatText)
            writeOnHistory(preparedChatMessage);
        } else if (res.messageType === MessageType.Knowledge) {
            let knowledgeSnippetCard = createCard(res.headerText, res.chatText, res.colour);
            writeKnowledgeCard(knowledgeSnippetCard);
        }
}

/**
 * Removes chat socket listeners
 */
function removeChatSocketListeners(){
    socket.removeAllListeners();
}
window.removeChatSocketListeners = removeChatSocketListeners