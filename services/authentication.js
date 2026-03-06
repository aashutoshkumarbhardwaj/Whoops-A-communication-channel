const JWT = require('jsonwebtoken');

const secret= 'superman@123';

function createTokenForUser(user) {

    const payload={
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const token = JWT.sign(payload, secret, { expiresIn: '1h' });

    return token;
}

function verifyToken(token) {

    const payload =JWT.verify(token, secret);

    return payload;
}

module.exports = {
    createTokenForUser,
    verifyToken
};


