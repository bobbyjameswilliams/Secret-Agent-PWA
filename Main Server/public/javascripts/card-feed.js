/**
 * Connects to room and updates the view
 * @param cardID
 * @param image
 */
function connectToRoomPage(cardID, image){
    let roomNo = document.getElementById(cardID+'room_input').value;
    let username = document.getElementById(cardID+'username_input').value;
    changeRoomView();
    initRoom(roomNo, username, image);
}
window.connectToRoomPage = connectToRoomPage
