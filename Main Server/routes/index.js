var express = require('express');
const axios = require("axios");
var router = express.Router();
var fs = require('fs');

/**
 * Card class
 */
class Card{
    id;
    title;
    roomNo;
    image;
    description;
    author;
    date_of_issue;

    constructor(id,title,roomNo,image,description,author,date_of_issue) {
        this.id = id;
        this.title = title;
        this.roomNo = roomNo;
        this.image = image;
        this.description = description;
        this.author = author;
        this.date_of_issue = date_of_issue;
    }
}

/* GET home page. */
/**
 * index get route
 */
router.get('/', function(req, res, next) {
    console.log("/ get called")
    res.render('index', { title: 'Card View', cardList: [] });
    // axios.post('http://localhost:3001/getArticles',{}).then(json => {
    //     var cards = [];
    //     json.data.forEach(function(article) {
    //
    //       let card = new Card(article._id, article.title, 0,article.image,
    //           article.description, article.author_name, article.date_of_issue);
    //
    //       cards.push(card);
    //     });
    //     //Renders homepage
    //     res.render('index', { title: 'Card View', cardList: cards });
    // }).catch(err => {
    //     res.render('index', { title: 'Card View', cardList: [] });
    //     console.log("Error Rendering Index")
    //     //res.setHeader('Content-Type', 'application/json');
    //     //res.status(403).json(err)
    // })
});

// router.post('/', function(req, res) {
//     axios.post('http://localhost:3001/insertArticle',{
//         title: req.body.title,
//         image_b64: req.body.image_b64,
//         description: req.body.description,
//         author_name: req.body.author_name,
//         date_of_issue: Date.now()
//     }).then(json => {
//         //console.log(JSON.stringify(json.data));
//         req.method='get';
//         res.redirect('/')
//     }).catch(err => {
//         console.log("Error")
//         res.setHeader('Content-Type', 'application/json');
//         res.status(403).json(err)
//     })
// })

/**
 * Passes data through to get articles from mongo.
 */
router.post('/getArticles', function(req, res, next) {
    console.log("/getAllArticles get called")
    axios.post('http://localhost:3001/getArticles',{}).then(json => {
        res.send(json.data)
    }).catch(err => {
        console.log("Error getting articles")
        res.setHeader('Content-Type', 'application/json');
        res.status(403).json(err)
    })
});

/**
 * Passes data through to insert article into mongo.
 */
router.post('/insertArticle', function(req, res) {
    console.log("/insertArticle called")
    axios.post('http://localhost:3001/insertArticle',{
        title: req.body.title,
        image: req.body.image,
        description: req.body.description,
        author_name: req.body.author_name,
        date_of_issue: req.body.date_of_issue
    }).then(json => {
        //console.log(JSON.stringify(json.data));
        res.send(json.data)
    }).catch(err => {
        console.log("Error")
        res.setHeader('Content-Type', 'application/json');
        res.status(403).json(err)
    })
})

module.exports = router;
