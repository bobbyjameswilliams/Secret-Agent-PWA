import * as database from './database.js';
import {flushQueuedArticles, retrieveAllLocallyStoredArticles} from "./database.js";


function changeInsertView(){
    getCardView().style.display = "none";
    getInsertView().style.display = "";
    getRoomView().style.display = "none";
    getSortToggle().style.display = "none";
}
window.changeInsertView = changeInsertView

function changeCardView(){
    getCardView().style.display = "";
    getInsertView().style.display = "none";
    getRoomView().style.display = "none";
    getSortToggle().style.display = "";
}
window.changeCardView = changeCardView

function changeRoomView(){
    getCardView().style.display = "none";
    getInsertView().style.display = "none";
    getRoomView().style.display = "";
    getSortToggle().style.display = "none";
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

function getSortToggle(){
    return document.getElementById("sort-toggle");
}

async function initArticleFeed() {
    let writtenToFeed = false
    console.log("initArticleFeed called")
    try{
        await database.syncArticles()
        let allIdbArticles = await database.retrieveAllLocallyStoredArticles();
        console.log("Writing to home from within the try")
        console.log(allIdbArticles);
        sortArticles(1,allIdbArticles)
        writtenToFeed = true
    }
    catch (e) {
        if (!writtenToFeed) {
            console.log("Writing to home from within the catch" + e)
            let allIdbArticles = await database.retrieveAllLocallyStoredArticles();
            sortArticles(1,allIdbArticles)
            writtenToFeed = true
        }
    }
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

    let cardAuthor = document.createElement('p');
    cardAuthor.className = 'card-text';
    cardAuthor.innerHTML = "Author: "+article.author_name;

    let cardDate = document.createElement('p');
    cardDate.className = 'card-text';
    cardDate.innerHTML = "Date of issue: "+ new Date((article.date_of_issue));

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
        let articleID = article._id;
        let username = document.getElementById(article.title+'username_input').value;
        if((roomNo != "")&&(username != "")) {
            changeRoomView();
            let concatRoomId = articleID + roomNo
            initRoom(concatRoomId, username, article.image, article.title, article.description, article.author_name, article.date_of_issue);
        }else{
            alert("Please enter a room number and username");
        }

    })

    row.appendChild(col);
    col.appendChild(card);
    card.appendChild(cardImg);
    card.appendChild(cardBody);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardAuthor);
    cardBody.appendChild(cardDate);
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

function sortArticles(field, allIdbArticles) {
    if (field) {
        return allIdbArticles.sort((a, b) => (a.date_of_issue < b.date_of_issue) ? 1 : -1).forEach(article => writeCardToHome(createArticleCard(article)))
    } else {
        return allIdbArticles.sort((a, b) => (a.author_name > b.author_name) ? 1 : -1).forEach(article => writeCardToHome(createArticleCard(article)))
    }
}

async function getInsertSortedArticles(field){
    let writtenToFeed = false
    console.log("initArticleFeed called")
    try{
        await database.syncArticles()
        let allIdbArticles = await database.retrieveAllLocallyStoredArticles();
        console.log("Writing to home from within the try")
        console.log(allIdbArticles);
        sortArticles(field, allIdbArticles)
        writtenToFeed = true
    }
    catch (e) {
        if (!writtenToFeed) {
            console.log("Writing to home from within the catch" + e)
            let allIdbArticles = await database.retrieveAllLocallyStoredArticles();
            sortArticles(field, allIdbArticles);
            writtenToFeed = true
        }
    }
}


function sortByDate(){
    clearCard();
    getInsertSortedArticles(true);
}
window.sortByDate = sortByDate;


function sortByAuthor(){
    clearCard()
    getInsertSortedArticles(false);
}
window.sortByAuthor = sortByAuthor;


function clearCard(){
    let homePage = document.getElementById('cards-container')
    homePage.innerHTML = "";
    homePage.scrollTop = homePage.scrollHeight;
}

function reloadPage(){
    document.location.reload()
}
window.reloadPage = reloadPage;

$('#fileUpload').change(function (e) {
    if (this.files && this.files[0]) {
        var FR= new FileReader();
        FR.addEventListener("load", function(e) {
            document.getElementById("image_b64").value = e.target.result;
            document.getElementById("imgPreview").src = e.target.result;
        });
        FR.readAsDataURL( this.files[0] );
    }else{
        document.getElementById("image_b64").value = "";
        document.getElementById("imgPreview").src = "/images/placeholder.png";
    }
})