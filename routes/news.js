const routes = require('express').Router();
const bodyParser = require('body-parser');
require('dotenv').config();
const NewsAPI = require('newsapi');
const verifyToken = require('../middleware/authJWT');

const newsapi = new NewsAPI(process.env.API_KEY);

routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());


routes.get('/category', verifyToken, (req, res) => {
    if (!req.user && req.message == null) {
        return res.status(403).send({
            message: "Invalid JWT token."
        });
    } else if (!req.user && req.message) {
        return res.status(403).send({
            message: req.message
        });
    }

    newsapi.v2.topHeadlines({
        category: req.user.news_preference.category
    }).then(response => {
        res.status(200).json(response);
    });
});


routes.get('/sources', verifyToken, (req, res) => {
    if (!req.user && req.message == null) {
        return res.status(403).send({
            message: "Invalid JWT token."
        });
    } else if (!req.user && req.message) {
        return res.status(403).send({
            message: req.message
        });
    }

    newsapi.v2.topHeadlines({
        sources: req.user.news_preference.sources.join(',')
    }).then(response => {
        res.status(200).json(response);
    });
});


routes.get('/search/:keyword', verifyToken, (req, res) => {
    if (!req.user && req.message == null) {
        return res.status(403).send({
            message: "Invalid JWT token."
        });
    } else if (!req.user && req.message) {
        return res.status(403).send({
            message: req.message
        });
    }

    newsapi.v2.everything({
        q: req.params.keyword
    }).then(response => {
        res.status(200).json(response);
    })
});


module.exports = routes;
