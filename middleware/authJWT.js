const jwt = require('jsonwebtoken');
const userData = require('../userData.json');


const verifyToken = (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.API_SECRET, function (err, decode) {
            if (err) {
                req.user = undefined;
                next();
            }
            try {
                currentUser = userData.users.filter(user => user.email === decode.email);
                req.user = currentUser[0];
                next();
            } catch (err) {
                res.status(500).send({
                    message: err
                });
            }
        });
    } else {
        req.user = undefined;
        req.message = "Authorization header not found!";
        next();
    }
};

module.exports = verifyToken;
