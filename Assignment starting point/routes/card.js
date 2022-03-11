var express = require('express');
var router = express.Router();

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
  res.render('card', { title: 'Card View', cardList: getCards() });
});

module.exports = router;
