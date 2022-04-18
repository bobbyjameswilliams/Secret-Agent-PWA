var express = require('express');
var router = express.Router();
var axios = require('axios');

class Card{
  id;
  title;
  roomNo;
  image_path;
  description;
  author;
  date_of_issue;

  constructor(id, title, roomNo,image_path,description,author,date_of_issue) {
    this.id = id;
    this.title = title;
    this.roomNo = roomNo;
    this.image_path = image_path;
    this.description = description;
    this.author = author;
    this.date_of_issue = date_of_issue;
  }

}

/* GET users listing. */
router.get('/', function(req, res) {
  console.log("/ get called")
  axios.post('http://localhost:3001/getArticles',{})
      .then(json => {
        // This could be a render? unsure if res.render is needed.

        var cards = [];
        json.data.forEach(function(article) {
            let card = new Card(article._id, article.title, article.file_path,
                                article.description, article.author_name, article.date_of_issue);
            cards.push(card);
        });

        //For now this is gonna be res.render while I figure out axios.
        //TODO: look into this at a later date 
        res.render('card', { title: 'Card View', cardList: cards });

      })
      .catch(err => {
        console.log("Error")
        res.setHeader('Content-Type', 'application/json');
        res.status(403).json(err)
      })
  //#res.render('card', { title: 'Card View', cardList: getCards() });

  /*axios.post('http://localhost:3001/insertArticle',{
    title: "Insert route test",
    file_path: "/test",
    description: "Insert route test",
    author_name: "Dan",
    date_of_issue: Date.now()
  })
      .then(json => {
        // This could be a render? unsure if res.render is needed.
        console.log("Success");
        console.log(JSON.stringify(json.data))

        //For now this is gonna be res.render while I figure out axios.
        //TODO: look into this at a later date
        //res.render('card', { title: 'Card View', cardList: getCards() });
        //res.json(json.data)
      })
      .catch(err => {
        console.log("Error")
        res.setHeader('Content-Type', 'application/json');
        res.status(403).json(err)
      })*/

});

router.post('/', function(req, res) {
  console.log("post request started")

  //res.render('card', { title: 'Card View', cardList: getCards() });
});


router.get('/room/',function (req, res) {
  let roomNo = req.query.roomNo;
  let reqUsername = req.query.username;
  res.render('room',{title: roomNo,username: reqUsername})
})

module.exports = router;
