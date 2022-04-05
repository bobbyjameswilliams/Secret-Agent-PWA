let Card = require('../models/cards');

exports.insert = function (req, res) {
    let userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }

    let card = new Card({
        article_id: userData.article_id,
    });
    console.log('received: ' + card);

    card.save()
        .then ((results) => {
            console.log(results._id);
            res.json(card);
        })
        .catch ((error) => {
            res.status(500).json('Could not insert - probably incorrect data! ' + JSON.stringify(error));
        })

}