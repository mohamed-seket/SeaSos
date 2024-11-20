const jwt = require('jsonwebtoken');
// This function generates a new unique token
function tokenForUser(user) {
    const timestamp = new Date().getTime();
    const token = jwt.sign({ sub: user._id, iat: timestamp }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

module.exports = tokenForUser;
