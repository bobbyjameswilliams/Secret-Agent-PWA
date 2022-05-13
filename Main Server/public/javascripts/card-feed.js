function connectToRoomPage(cardID, image){
    let roomNo = document.getElementById(cardID+'room_input').value;
    let username = document.getElementById(cardID+'username_input').value;
    if (roomNo !== '' && username !== ''){
        changeRoomView();
        initRoom(roomNo, username, image);
    } else if (roomNo === ''){
        alertInputValidation(cardID, 'room_input');
    } else {
        alertInputValidation(cardID, 'username_input');
    }

}

function alertInputValidation(cardID, inputDomID){
    document.getElementById(cardID+inputDomID).style.backgroundColor = 'red';
    document.getElementById(cardID+inputDomID).style.opacity= '0.6';
}

function createArticleCard(article){
    let row = document.createElement('div');
    row.className = 'row'
    let col = document.createElement('col-sm');
    let card = document.createElement('div');
    card.className = 'card article-card';
    card.id = article.title

    let cardImg = document.createElement('img');
    cardImg.id = article.title + 'img'
    cardImg.class = 'card-img'
    cardImg.alt = 'Card image cap'
    cardImg.src = article.image

    let cardBody = document.createElement('div')
    cardBody.className = "card-body"

    let cardTitle = document.createElement('h3');
    cardTitle.className = 'card-title';
    cardTitle.innerHTML = article.title;

    let cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.innerHTML = article.description;

    let secondRow = document.createElement('div')
    secondRow.className = 'row'
    let col5 = document.createElement('div')
    col5.className = 'col-5'
    let col4 = document.createElement('div')
    col4.className = 'col-4'
    let col3 = document.createElement('div')
    col3.className = 'col-3'
    let usernameInput =  document.createElement('input');
    usernameInput.className = 'text_input';
    usernameInput.id = article.title + "username_input";
    usernameInput.placeholder = "Enter Username"
    usernameInput.type = 'text';

    let roomInput =  document.createElement('input');
    roomInput.className = 'text_input';
    roomInput.id = article.title + "username_input";
    roomInput.placeholder = "Enter Username"
    roomInput.type = 'text';

    let submit = document.createElement('button');
    submit.className = 'btn btn-primary';
    submit.id = "connect";
    submit.placeholder = "Enter Username"
    submit.innerHTML = 'Connect'
    submit.addEventListener('click',function (){
        let roomNo = document.getElementById(article.title+'room_input').value;
        let username = document.getElementById(article.title+'username_input').value;
        changeRoomView();
        initRoom(roomNo, username, article.image);
    })

    row.appendChild(col);
    col.appendChild(card);
    card.appendChild(cardImg);
    card.appendChild(cardBody);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(secondRow);
    secondRow.appendChild(col5);
    col5.appendChild(usernameInput);
    secondRow.appendChild(col4);
    col4.appendChild(roomInput);
    secondRow.appendChild(col3);
    col3.appendChild(submit);

    return card
}