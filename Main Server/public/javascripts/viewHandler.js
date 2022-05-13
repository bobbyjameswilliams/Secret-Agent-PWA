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
    axios.post('http://localhost:3000/getArticles',{}).then(json => {
        let articles = json.data
        console.log(articles)
        database.cacheRetrievedArticles(articles)
            .then(r => console.log(r))
            .catch(r => console.log(r));
    }).catch(err => {
        console.log("Error getting articles")
        // res.setHeader('Content-Type', 'application/json');
        // res.status(403).json(err)
    })




}
window.initArticleFeed = initArticleFeed