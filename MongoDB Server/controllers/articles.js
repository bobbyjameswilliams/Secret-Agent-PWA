let Article = require('../models/articles');


exports.getAllArticles = function (req, res) {
    let userData = req.body;
    if (userData == null) {
        res.status(403).json('No data sent!')
    }

    Article.find({})
        .then(articles => {
            if (articles.length > 0) {
                res.json(articles)
            } else {
                res.json("not found");
            }
        })
        .catch((err) => {
            //res.status(500).send('Invalid data or not found!' + JSON.stringify(err));
        });
}

exports.getArticle = function (req, res) {
    let userData = req.body;
    if (userData == null) {
        res.status(403).json('No data sent!')
    }

    Article.find({"_id" : userData.articleId})
        .then(article => {
            if (article !== null) {
                res.json(article)
            } else {
                res.json("not found");
            }
        })
        .catch((err) => {
            //res.status(500).send('Invalid data or not found!' + JSON.stringify(err));
        });
}

exports.insert = function (req, res) {
    let userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }

    let article = new Article({
        title: userData.title,
        image: userData.image,
        description: userData.description,
        author_name: userData.author_name,
        date_of_issue: userData.date_of_issue,
    });
    console.log('received: ' + article);

    article.save()
        .then ((results) => {
            console.log("Successfully inserted");
            res.json(article);
        })
        .catch ((error) => {
            res.status(500).json('Could not insert - probably incorrect data! ' + JSON.stringify(error));
        })
}