const hapiJoi = require('@hapi/joi');
const httpStatus = require('http-status');
const sha1 = require('sha1');
const inputValidation = require('../utils/input_validation');
const UsersDao = require('../daos/UsersDao');
const auth = require('../utils/auth');

const registerSchema = hapiJoi.object({
    name: hapiJoi.string().required(),
    email: hapiJoi.string().required(),
    password: hapiJoi.string().required(),
    passwordConfirmation: hapiJoi.string().required()
});

const loginSchema = hapiJoi.object({
    email: hapiJoi.string().required(),
    password: hapiJoi.string().required(),
});

class UsersService {
    async register(user = {}) {
        try {
            const isError = inputValidation.validate(user, registerSchema);
            if (isError.error) {
                return Promise.reject({
                    status: httpStatus.BAD_REQUEST,
                    message: isError.error.details[0].message
                })
            }

            // check that the provided user email doesn't exists
            const isUser = await new UsersDao().findOne({ where: { email: user.email } });
            if (isUser) {
                return Promise.reject({
                    status: httpStatus.CONFLICT,
                    message: 'email already exists'
                })
            }

            const result = await new UsersDao().create({
                name: user.name,
                email: user.email.toLowerCase(),
                password: sha1(user.password)
            });

            delete user.password;

            return result;
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async login(user = {}) {
        try {
            const isError = inputValidation.validate(user, loginSchema);
            if (isError.error) {
                return Promise.reject({
                    status: httpStatus.BAD_REQUEST,
                    message: isError.error.details[0].message
                })
            }

            // check that the provided user email doesn't exists
            const isUser = await new UsersDao().findOne({
                where: {
                    email: user.email.toLowerCase(),
                    password: sha1(user.password)
                }
            });
            if (!isUser) {
                return Promise.reject({
                    status: httpStatus.NOT_FOUND,
                    message: 'user not found'
                })
            }

            // generating the user's token
            const token = auth.generateToken(isUser.id);

            return { token };
        } catch (error) {
            return Promise.reject(error)
        }
    }
};

module.exports = UsersService;