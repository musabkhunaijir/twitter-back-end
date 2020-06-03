const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const UsersDao = require('../daos/UsersDao');

// TODO: should be stored in .env file
const secret = 'some secret';;

module.exports = {
    generateToken(id) {
        const token = jwt.sign({ id }, secret);
        return token;
    },

    async isAuthorized(req, response, next) {
        try {
            // check that the token is set in the header
            if (!req.headers.authorization) {
                return response.status(httpStatus.UNAUTHORIZED).send({
                    status: httpStatus.UNAUTHORIZED,
                    message: 'unauthorized'
                })
            }

            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, secret);

            // check that the user does exist
            const isUser = await new UsersDao().findOne({ where: { id: decoded.id } })
            if (!isUser) {
                return response.status(httpStatus.UNAUTHORIZED).send({
                    status: httpStatus.UNAUTHORIZED,
                    message: 'unauthorized'
                })
            }

            // set the user info in the req Object to be used in later middleware
            req.userInfo = { userId: isUser.id };

            return next();
        } catch (error) {
            return response.status(httpStatus.UNAUTHORIZED).send({
                status: httpStatus.UNAUTHORIZED,
                message: 'unauthorized'
            })
        }
    }
}