const jwt = require('jsonwebtoken');
const secret = 'some secret';;

module.exports = {
    generateToken(id) {
        const token = jwt.sign({ id }, secret);
        return token;
    },

    verifyToken(token) {
        const decoded = jwt.verify(token, secret);
        return decoded;
    }
}