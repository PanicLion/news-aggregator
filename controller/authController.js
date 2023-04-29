const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const usersData = require('../userData.json');
const Validator = require('../validator/validator');


let signup = (req, res) => {
    let newUser = req.body;
    if (Validator.isValidUserSchema(newUser)) {
        if (Validator.isUniqueEmail(newUser.email, usersData)) {
            if (Validator.isValidEmail(newUser.email)) {
                if (Validator.isValidPreferenceSchema(newUser.news_preference)) {

                    newUser.password = bcrypt.hashSync(newUser.password, 8);
                    let modifiedUsers = JSON.parse(JSON.stringify(usersData));
                    modifiedUsers.users.push(newUser);
                
                    let writePath = path.join(__dirname, '..', 'userData.json');
                    fs.writeFile(writePath, JSON.stringify(modifiedUsers), {encoding: 'utf-8', flag: 'w'}, (err) => {
                        if (err) {
                            res.status(500).send({
                                message: err
                            });
                        } else {
                            res.status(200).send({
                                message: "User registered successfully."
                            });
                        } 
                    });
                } else {
                    res.status(400).json({
                        message: "Please provide news_preference in valid format."
                    });
                }
            } else {
                res.status(400).json({
                    message: "Please provide a valid email."
                });
            }
        } else {
            res.status(400).json({
                message: "Email Id already exists!"
            });
        }

    } else {
        res.status(400).json({
            message: "Please provide all the required fields in correct format."
        });
    }
};


let signin = (req, res) => {
    if (Validator.isValidLoginSchema(req.body)) {
        if (Validator.isValidEmail(req.body.email)) {

            let currentUser = usersData.users.filter(user => user.email === req.body.email);
            if (currentUser.length === 0) {
                res.status(404).send({
                    message: "User not Found."
                });
            } else {
                let isPasswordValid = bcrypt.compareSync(req.body.password, currentUser[0].password);
                if (!isPasswordValid) {
                    return res.status(401).send({
                        accessToken: null,
                        message: "Invalid Password!"
                    });
                }
        
                let token = jwt.sign({
                    email: currentUser[0].email
                }, process.env.API_SECRET, {
                    expiresIn: "12h"
                });
        
                res.status(200).send({
                    user: {
                        email: currentUser[0].email,
                        name: currentUser[0].name
                    },
                    message: "Login successfull.",
                    accessToken: token
                });
            }
        } else {
            res.status(400).json({
                message: "Please provide a valid Email Id."
            });
        }
    } else {
        res.status(400).json({
            message: "Please provide email Id and password."
        });
    }
};

module.exports = { signup, signin };
