const jwt = require('jsonwebtoken');
const User = require('../models/users');
// const user = require("../models/users");
module.exports.auth = async (req, res, next) => {
    if (req.signedCookies) {
        // access cookies
        const token = req.signedCookies['auth'];
        try {
            // verify token
            const decoded = jwt.verify(token, 'secretKey', function (err, decoded) {
                if (err) throw err;
                return decoded;
            });
            // getting user
            const user = await User.findById(decoded.id)
            req.user = user;
            next();
        } catch (err) {
            res.status(401).send('Unauthorized');
        }
    } else {
        res.status(401).send('Unauthorized!')
    }

};
