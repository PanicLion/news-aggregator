const route = require('express').Router();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const userData = require('../userData.json');
const verifyToken = require('../middleware/authJWT');
const Validator = require('../validator/validator');


route.use(bodyParser.urlencoded({ extended: false }));
route.use(bodyParser.json());

route.get('/', verifyToken, (req, res) => {
    if (!req.user && req.message == null) {
        return res.status(403).send({
            message: "Invalid JWT token."
        });
    } else if (!req.user && req.message) {
        return res.status(403).send({
            message: req.message
        });
    }
    try {
        currentUser = userData.users.filter(user => user.email === req.user.email);
        res.status(200).json(currentUser[0].news_preference);
    } catch (err) {
        res.status(500).send({
            message: err
        });
    }
});


route.put('/', verifyToken, (req, res) => {
    if (!req.user && req.message == null) {
        return res.status(403).send({
            message: "Invalid JWT token."
        });
    } else if (!req.user && req.message) {
        return res.status(403).send({
            message: req.message
        });
    }
    try {
        let newPreference = req.body;
        if (Validator.isValidPreferenceSchema(newPreference)) {
            
            let modifiedUserData = JSON.parse(JSON.stringify(userData));
            let writePath = path.join(__dirname, '..', 'userData.json');
    
            for (const user of modifiedUserData.users) {
                if (user.email === req.user.email) {
                    user.news_preference.category = newPreference.category;
                    user.news_preference.sources = newPreference.sources;
                    break;
                }
            }
    
            fs.writeFile(writePath, JSON.stringify(modifiedUserData), {encoding: 'utf-8', flag: 'w'}, (err) => {
                if (err) {
                    res.status(500).send({
                        message: err
                    });
                } else {
                    res.status(200).send({
                        message: "News preference updated successfully."
                    });
                } 
            });
        } else {
            res.status(400).send({
                message: "Please provide news_preference in valid format."
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err
        });
    }
});

module.exports = route;
