let Card = require('../models/cards');

exports.getDescription = function (req, res) {
    let userData = req.body;
    if (userData == null)
        res.status(403).json('No data sent!')

    Card.find({Title: userData.title},
        'Title')
        .then(cards => {
            let card = null;
            if (cards.length > 0) {
                let firstElem = cards[0];
                card = {
                    file_path: firstElem.file_path,
                    description: firstElem.description,
                    author_name: firstElem.author_name,
                    date_of_issue: firstElem.date_of_issue,
                };
                res.json(card.description);
            } else {
                res.json("not found");
            }
        })
        .catch((err) => {
            res.status(500).send('Invalid data or not found!' + JSON.stringify(err));
        });
}


exports.insert = function (req, res) {
    let userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }

    let card = new Card({
        file_path: userData.file_path,
        description: userData.description,
        author_name: userData.author_name,
        date_of_issue: userData.date_of_issue,
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