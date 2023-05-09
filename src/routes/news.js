const routes = require('express').Router();
const bodyParser = require('body-parser');
require('dotenv').config();
const NewsAPI = require('newsapi');
const verifyToken = require('../middleware/authJWT');
const redisClient = require('../configs/redis.config');

const newsapi = new NewsAPI(process.env.API_KEY);

routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());


routes.get('/category', verifyToken, async (req, res) => {
    if (!req.user && req.message == null) {
        return res.status(403).send({
            message: "Invalid JWT token."
        });
    } else if (!req.user && req.message) {
        return res.status(403).send({
            message: req.message
        });
    }
    else {
        try {
            const category = req.user.news_preference.category;
            const cacheResult = await redisClient.get(category);
            if (cacheResult) {
                console.log("Getting result from cache...");
                res.status(200).send(JSON.parse(cacheResult));
            }
            else {
                console.log("Getting result from API...");
                newsapi.v2.topHeadlines({
                    category: category
                }).then(async response => {
                    await redisClient.set(category, JSON.stringify(response));
                    await redisClient.expire(category, process.env.CATEGORY_NEWS_EXPIRY);
                    res.status(200).json(response);
                });
            }
        } catch (error) {
            res.status(500).send({
                message: error
            });
        }
        
    }
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
