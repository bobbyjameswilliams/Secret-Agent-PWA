let Article = require('../models/articles');

exports.insert = function (req, res) {
    let userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }

    let article = new Article({
        title: userData.title,
        file_path: userData.file_path,
        description: userData.description,
        author_name: userData.author_name,
        date_of_issue: userData.date_of_issue,
    });
    console.log('received: ' + article);

    article.save()
        .then ((results) => {
            console.log(results._id);
            res.json(article);
        })
        .catch ((error) => {
            res.status(500).json('Could not insert - probably incorrect data! ' + JSON.stringify(error));
        })

}