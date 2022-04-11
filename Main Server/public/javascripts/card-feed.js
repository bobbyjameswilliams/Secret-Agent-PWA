function connectToRoomPage(cardID){
    //let roomNo = document.getElementById(cardID+'room_input').value;
    // TODO: Remove following lines
    let roomNo = 321
    cardID = 'H6'
    window.location.href = "http://localhost:3000/card/room/?roomNo="+cardID+roomNo;
}