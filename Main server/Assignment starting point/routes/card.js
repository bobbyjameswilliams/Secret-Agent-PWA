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
  console.log("/ get called")
  axios.get('http://localhost:3001/getArticles')
      .then(json => {
        console.log("Success");
        res.json(json.data.result)
      })
      .catch(err => {
        console.log("Error")
        res.setHeader('Content-Type', 'application/json');
        res.status(403).json(err)
      })
  //#res.render('card', { title: 'Card View', cardList: getCards() });

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
