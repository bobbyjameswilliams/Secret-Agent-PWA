function changeInsertView(){
    getCardView().style.display = "none";
    getInsertView().style.display = "";
    getRoomView().style.display = "none";
}

function changeCardView(){
    getCardView().style.display = "";
    getInsertView().style.display = "none";
    getRoomView().style.display = "none";
}

function changeRoomView(){
    getCardView().style.display = "none";
    getInsertView().style.display = "none";
    getRoomView().style.display = "";
}

function getCardView(){
    return document.getElementById("cards-container");
}

function getRoomView(){
    return document.getElementById("room-container");
}

function getInsertView(){
    return document.getElementById("insert-container");
}