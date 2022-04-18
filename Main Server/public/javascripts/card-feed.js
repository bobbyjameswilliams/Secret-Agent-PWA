function connectToRoomPage(cardID){
    let roomNo = document.getElementById(cardID+'room_input').value;
    let username = document.getElementById(cardID+'username_input').value;
    window.location.href = "http://localhost:3000/card/room/?roomNo="+cardID+roomNo+"&username="+username;
}