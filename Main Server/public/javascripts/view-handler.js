import * as database from './database.js';
import {insertQueuedArticlesMongoThenDelete, retrieveAllLocallyStoredArticles} from "./database.js";


function changeInsertView(){
    getCardView().style.display = "none";
    getInsertView().style.display = "";
    getRoomView().style.display = "none";
}
window.changeInsertView = changeInsertView

function changeCardView(){
    getCardView().style.display = "";
    getInsertView().style.display = "none";
    getRoomView().style.display = "none";
}
window.changeCardView = changeCardView

function changeRoomView(){
    getCardView().style.display = "none";
    getInsertView().style.display = "none";
    getRoomView().style.display = "";
}
window.changeRoomView = changeRoomView;

function getCardView(){
    return document.getElementById("cards-container");
}

function getRoomView(){
    return document.getElementById("room-container");
}

function getInsertView(){
    return document.getElementById("insert-container");
}

async function initArticleFeed() {
    console.log("initArticleFeed called")
    try{
        await database.syncArticles()
        let allIdbArticles = await database.retrieveAllLocallyStoredArticles();
        allIdbArticles.forEach(article => writeCardToHome(createArticleCard(article)))
    }
    catch {
        let allIdbArticles = await database.retrieveAllLocallyStoredArticles();
        allIdbArticles.forEach(article => writeCardToHome(createArticleCard(article)))
    }
    


    //database.insertArticleMongo({ title: "test"}).then(r => console.log(r)).catch(err => console.log(err))

    //console.log(x)
}
window.initArticleFeed = initArticleFeed

async function insertArticle(){
    let title = document.getElementById('title_input');
    let image = document.getElementById('image_b64');
    let description = document.getElementById('description_input');
    let author_name = document.getElementById('author_name')
    let date_of_issue = Date.now();
    let article = new Article(title,image,description,author_name,date_of_issue)
    await database.storeArticle(article)
}
window.insertArticle = insertArticle;

//TODO: below
//################ TO BE MOVED BACK TO card-feed.js ########################

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
    roomInput.id = article.title + "room_input";
    roomInput.placeholder = "Enter Room"
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
window.createArticleCard = createArticleCard;

function writeCardToHome(card){
    let homePage = document.getElementById('cards-container')
    homePage.appendChild(card);
    homePage.scrollTop = homePage.scrollHeight;
}

