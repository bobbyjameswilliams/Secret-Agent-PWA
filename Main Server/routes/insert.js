var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("wobble");
    res.render('insert');
});

router.post('/', function(req, res) {
    console.log("wibble");
    axios.post('http://localhost:3001/insertArticle',{
   title: req.body.title_input ,
   file_path: "public/images/cathedral.jpg" ,
   description: req.body.description_input,
   author_name: req.body.author_name_input,
   date_of_issue: Date.now()
 })
     .then(json => {
       // This could be a render? unsure if res.render is needed.
       console.log("Success");
       console.log(JSON.stringify(json.data))
     res.render('insert');

     })
     .catch(err => {
       console.log("Error")
       res.setHeader('Content-Type', 'application/json');
       res.status(403).json(err)
     })
})

module.exports = router;