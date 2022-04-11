function connectToRoomPage(cardID){
    //console.log(cardID);
    let roomNo = document.getElementById(cardID+'room_input').value;
    window.location.href = "http://localhost:3000/card/room/?roomNo="+cardID+roomNo;
}