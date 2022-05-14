import * as database from './database.js';

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
    // let articles;
    // articles = await database.getArticles();
    //console.log(articles)
    //database.getArticles();
    // axios.post('http://localhost:3000/getArticles',{}).then(json => {
    //     let articles = json.data
    //     database.storeArticles(articles)
    //         .then(r => console.log(r))
    //         .catch(r => console.log(r));
    // }).catch(err => {
    //     console.log("Error getting articles")
    //     // res.setHeader('Content-Type', 'application/json');
    //     // res.status(403).json(err)
    // })

    await database.syncArticles();

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