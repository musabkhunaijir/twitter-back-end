const hapiJoi = require('@hapi/joi');
const httpStatus = require('http-status');
const sha1 = require('sha1');
const inputValidation = require('../utils/input_validation');
const TweetsDao = require('../daos/TweetsDao');
const UsersService = require('./UsersService');

const tweetSchema = hapiJoi.object({
    content: hapiJoi.string().required(),
    userId: hapiJoi.number().required()
});

const threadSchema = hapiJoi.object({
    content: hapiJoi.string().required(),
    userId: hapiJoi.number().required(),
    parentId: hapiJoi.number().required()
});

const myTweetsSchema = hapiJoi.object({
    userId: hapiJoi.number().required(),
});

const tweetThreadSchema = hapiJoi.object({
    tweetId: hapiJoi.number().required(),
});

class TweetsService {
    async addTweet(tweet = {}) {
        try {
            const isError = inputValidation.validate(tweet, tweetSchema);
            if (isError.error) {
                return Promise.reject({
                    status: httpStatus.BAD_REQUEST,
                    message: isError.error.details[0].message
                })
            }

            // check that the provided user id doesn't exists
            const isUser = await new UsersService().getUser({ where: { id: tweet.userId } });
            if (!isUser) {
                return Promise.reject({
                    status: httpStatus.NOT_FOUND,
                    message: 'user not found'
                })
            }

            const result = await new TweetsDao().create({
                content: tweet.content,
                userId: tweet.userId
            });

            return result;
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async addThread(tweet = {}) {
        try {
            const isError = inputValidation.validate(tweet, threadSchema);
            if (isError.error) {
                return Promise.reject({
                    status: httpStatus.BAD_REQUEST,
                    message: isError.error.details[0].message
                })
            }

            // check that the provided user id does exists
            const isUser = await new UsersService().getUser({ where: { id: tweet.userId } });
            if (!isUser) {
                return Promise.reject({
                    status: httpStatus.NOT_FOUND,
                    message: 'user not found'
                })
            }

            // check that the provided tweet id does exists, (parent tweet)
            const isTweet = await new TweetsDao().findOne({ where: { id: tweet.parentId } });
            if (!isTweet) {
                return Promise.reject({
                    status: httpStatus.NOT_FOUND,
                    message: 'tweet not found'
                })
            }

            const result = await new TweetsDao().create({
                content: tweet.content,
                parentId: tweet.parentId,
                userId: tweet.userId
            });

            return result;
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async getAllTweets({ pageNumber } = {}) {
        try {
            const result = await new TweetsDao().getTweets({ pageNumber });

            return result;
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async getMyTweets({ user = {}, pageNumber }) {
        try {

            const isError = inputValidation.validate(user, myTweetsSchema);
            if (isError.error) {
                return Promise.reject({
                    status: httpStatus.BAD_REQUEST,
                    message: isError.error.details[0].message
                })
            }

            // check that the provided user id does exists
            const isUser = await new UsersService().getUser({ where: { id: user.userId } });
            if (!isUser) {
                return Promise.reject({
                    status: httpStatus.NOT_FOUND,
                    message: 'user not found'
                })
            }

            const result = await new TweetsDao().getTweets({ where: { userId: user.userId }, pageNumber });

            return result;
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async getTweetThread({ tweetThread = {}, pageNumber }) {
        try {
            const isError = inputValidation.validate(tweetThread, tweetThreadSchema);
            if (isError.error) {
                return Promise.reject({
                    status: httpStatus.BAD_REQUEST,
                    message: isError.error.details[0].message
                })
            }

            const result = await new TweetsDao().getTweets({ where: { id: tweetThread.tweetId }, pageNumber });

            return result;
        } catch (error) {
            return Promise.reject(error)
        }
    }

};

module.exports = TweetsService;