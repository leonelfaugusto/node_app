const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const authenticateToken = (req, res, next) => {
    // Gather the jwt access token from the request header
    const token = req.headers['x-token']
    if (token == null) return res.status(401).json({
        error: 'Unauthorized',
    }) // if there isn't any token

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json(err)
        req.me = user
        next() // pass the execution off to whatever request the client intended
    })
}

const isAuthenticated = [
    authenticateToken,
    (req, res, next) => {
        if (req.me) {
            next()
        } else {
            return res.status(401).json({
                error: 'Unauthorized',
            });
        }
    }
];

const isAdmin = [
    authenticateToken,
    (req, res, next) => {
        if (req.me && req.me.email == 'leonelfaugusto@gmail.com') {
            next()
        } else {
            return res.status(401).json({
                error: 'Unauthorized',
            });
        }
    }
]

const createToken = async (user) => {
    // expires after half and hour (1800 seconds = 30 minutes)
    const { _id, email } = user;
    return await jwt.sign({ _id, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}

const comparePassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = {
    createToken,
    comparePassword,
    isAuthenticated,
    isAdmin,
}