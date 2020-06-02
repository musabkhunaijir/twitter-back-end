const models = require('../models')
const users = models.users;

class UsersDao {
    async create(user = {}) {
        try {
            const result = await users.create(user);
            return result;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async findOne({ where }) {
        try {
            const result = await users.findOne({ where });
            return result.get({ plain: true });
        } catch (error) {
            return Promise.reject(error);
        }
    }
};

module.exports = UsersDao;