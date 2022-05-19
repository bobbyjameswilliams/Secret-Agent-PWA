/**
 * Connects to room and updates the view
 * @param cardID
 * @param image
 */
function connectToRoomPage(cardID, image){
    let roomNo = document.getElementById(cardID+'room_input').value;
    let username = document.getElementById(cardID+'username_input').value;
    if((roomNo != "")&&(username != "")) {
        if (roomNo !== '' && username !== '') {
            changeRoomView();
            initRoom(roomNo, username, image);
        } else if (username === '') {
            alertInputValidation(cardID, 'username_input');
        } else {
            alertInputValidation(cardID, 'room_input');
        }
    }
}
window.connectToRoomPage = connectToRoomPage

/**
 * /TODO: callum, can you fill this in please
 * @param cardID
 * @param inputDomID
 */
function alertInputValidation(cardID, inputDomID){
    document.getElementById(cardID+inputDomID).style.backgroundColor = 'red';
    document.getElementById(cardID+inputDomID).style.opacity= '0.6';
}

//@todo: Add stray methods here. This may require a fix as this file isnt being imported properly.