const models = require('../models')
const tweetsModel = models.tweets;

class TweetsDao {
    async create(tweet = {}) {
        try {
            const result = await tweetsModel.create(tweet);
            return result;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getTweets({ where = {}, pageNumber = 0 } = {}) {
        try {
            const pageSize = 10;
            const offset = pageNumber * pageSize;

            // model relation
            const include = [
                {
                    model: models.users,
                    as: 'user',
                    attributes: ['id', 'name']
                },
                {
                    model: models.tweets,
                    as: 'thread',
                }
            ];

            const result = await tweetsModel.findAll({
                where,
                include,
                offset,
                limit: pageSize
            })
                .map(t => t.get({ plain: true }));

            return result;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async findOne({ where = {} } = {}) {
        try {
            const result = await tweetsModel.findOne({ where });
            if (result) {
                return result.get({ plain: true });
            }

            return result;
        } catch (error) {
            return Promise.reject(error);
        }
    }
};

module.exports = TweetsDao;