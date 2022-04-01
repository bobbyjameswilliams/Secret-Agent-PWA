var express = require('express');
var router = express.Router();
var axios = require('axios');

class Card{
  title;
  roomNo;

  constructor(title, roomNo) {
    this.title = title;
    this.roomNo = roomNo
  }

}

function getCards(){
  let card1 = new Card("Hello World",10)
  let card2 = new Card("Numero Dos",11)
  return [card1,card2];
}
/* GET users listing. */

router.get('/', function(req, res) {
  console.log("/ get called")
  axios.post('http://localhost:3001/getArticles',{})
      .then(json => {
        // This could be a render? unsure if res.render is needed.
        console.log("Success");
        //console.log(JSON.stringify(json.data))

        //For now this is gonna be res.render while I figure out axios.
        //TODO: look into this at a later date 
        res.render('card', { title: 'Card View', cardList: getCards() });
        //res.json(json.data)
      })
      .catch(err => {
        console.log("Error")
        res.setHeader('Content-Type', 'application/json');
        res.status(403).json(err)
      })
  //#res.render('card', { title: 'Card View', cardList: getCards() });

  axios.post('http://localhost:3001/insertArticle',{
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
      })

});

router.post('/', function(req, res) {
  console.log("post request started")

  //res.render('card', { title: 'Card View', cardList: getCards() });
});


router.get('/room/',function (req, res) {
  let roomNo = req.query.roomNo;
  res.render('room',{title: roomNo})
})

module.exports = router;
