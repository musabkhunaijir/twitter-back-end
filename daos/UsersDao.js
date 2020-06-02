const models = require('../models')
const usersModel = models.users;

class UsersDao {
    async create(user = {}) {
        try {
            const result = await usersModel.create(user);
            return result;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async findOne({ where }) {
        try {
            const result = await usersModel.findOne({ where });

            if (result) {
                return result.get({ plain: true });
            }

            return result;
        } catch (error) {
            return Promise.reject(error);
        }
    }
};

module.exports = UsersDao;