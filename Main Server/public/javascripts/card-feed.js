function connectToRoomPage(cardID){
    let roomNo = document.getElementById(cardID+'room_input').value;
    let username = document.getElementById(cardID+'username_input').value;
    changeRoomView();
    initRoom(roomNo, username);
}
