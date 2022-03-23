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

router.get('/', function(req, res, next) {
  //#res.render('card', { title: 'Card View', cardList: getCards() });
  console.log("deez nuts")
  axios.post('http://localhost:3001/getArticles')
      .then(json => res.json(json.data.result))
      .catch(err => {
        res.setHeader('Content-Type', 'application/json');
        res.status(403).json(err)
      })
});

router.post('/', function(req, res) {
  console.log("deez nuts")
  axios.post('http://localhost:3001/getArticles').then(json => res.json(json.data.result)).catch(console.log("This is a certified bruh moment"));
  res.render('card', { title: 'Card View', cardList: getCards() });
});


router.get('/room/',function (req, res) {
  let roomNo = req.query.roomNo;
  res.render('room',{title: roomNo})
})

module.exports = router;
