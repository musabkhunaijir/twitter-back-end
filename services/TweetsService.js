const hapiJoi = require('@hapi/joi');
const httpStatus = require('http-status');
const inputValidation = require('../utils/input_validation');
const TweetsDao = require('../daos/TweetsDao');
const UsersService = require('./UsersService');
const handleErrors = require('../utils/handle_errors');

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

const singleTweetSchema = hapiJoi.object({
    tweetId: hapiJoi.number().required(),
});

const updateTweetSchema = hapiJoi.object({
    tweetId: hapiJoi.number().required(),
    content: hapiJoi.string().required(),
});

class TweetsService {
    async addTweet(tweet = {}) {
        try {
            const isError = inputValidation.validate(tweet, tweetSchema);
            if (isError.error) {
                return handleErrors.reject({
                    status: httpStatus.BAD_REQUEST,
                    message: isError.error.details[0].message
                })
            }

            // check that the provided user id doesn't exists
            const isUser = await new UsersService().getUser({ where: { id: tweet.userId } });
            if (!isUser) {
                return handleErrors.reject({
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
                return handleErrors.reject({
                    status: httpStatus.BAD_REQUEST,
                    message: isError.error.details[0].message
                })
            }

            // check that the provided user id does exists
            const isUser = await new UsersService().getUser({ where: { id: tweet.userId } });
            if (!isUser) {
                return handleErrors.reject({
                    status: httpStatus.NOT_FOUND,
                    message: 'user not found'
                })
            }

            // check that the provided tweet id does exists, (parent tweet)
            const isTweet = await new TweetsDao().findOne({ where: { id: tweet.parentId } });
            if (!isTweet) {
                return handleErrors.reject({
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
                return handleErrors.reject({
                    status: httpStatus.BAD_REQUEST,
                    message: isError.error.details[0].message
                })
            }

            // check that the provided user id does exists
            const isUser = await new UsersService().getUser({ where: { id: user.userId } });
            if (!isUser) {
                return handleErrors.reject({
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
            const isError = inputValidation.validate(tweetThread, singleTweetSchema);
            if (isError.error) {
                return handleErrors.reject({
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

    async updateTweet({ tweet = {}, reqUserId }) {
        try {
            const isError = inputValidation.validate(tweet, updateTweetSchema);
            if (isError.error) {
                return handleErrors.reject({
                    status: httpStatus.BAD_REQUEST,
                    message: isError.error.details[0].message
                })
            }

            // check that the provided user id does exists
            const isUser = await new UsersService().getUser({ where: { id: reqUserId } });
            if (!isUser) {
                return handleErrors.rej({
                    status: httpStatus.NOT_FOUND,
                    message: 'user not found'
                })
            }

            // check that the provided tweet id does exists, (parent tweet)
            const isTweet = await new TweetsDao().findOne({ where: { id: tweet.tweetId } });
            if (!isTweet) {
                return handleErrors.reject({
                    status: httpStatus.NOT_FOUND,
                    message: 'tweet not found'
                })
            }

            if (reqUserId !== isTweet.userId) {
                return handleErrors.reject({ status: httpStatus.FORBIDDEN, message: 'FORBIDDEN' })
            }

            // check that user is authorized to delete the tweet

            await new TweetsDao().updateTweet({
                attributes: { content: tweet.content },
                where: { id: tweet.tweetId }
            });

            return { status: httpStatus.OK };
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async deleteTweet({ tweet = {}, reqUserId }) {
        try {
            const isError = inputValidation.validate(tweet, singleTweetSchema);
            if (isError.error) {
                return handleErrors.reject({
                    status: httpStatus.BAD_REQUEST,
                    message: isError.error.details[0].message
                })
            }

            // check that the provided user id does exists
            const isUser = await new UsersService().getUser({ where: { id: reqUserId } });
            if (!isUser) {
                return handleErrors.reject({
                    status: httpStatus.NOT_FOUND,
                    message: 'user not found'
                })
            }

            // check that the provided tweet id does exists, (parent tweet)
            const isTweet = await new TweetsDao().findOne({ where: { id: tweet.tweetId } });
            if (!isTweet) {
                return handleErrors.reject({
                    status: httpStatus.NOT_FOUND,
                    message: 'tweet not found'
                })
            }

            if (reqUserId !== isTweet.userId) {
                return handleErrors.reject({ status: httpStatus.FORBIDDEN, message: 'FORBIDDEN' })
            }

            // check that user is authorized to delete the tweet

            await new TweetsDao().deleteTweet({
                where: { id: tweet.tweetId }
            });

            return { status: httpStatus.OK };
        } catch (error) {
            return Promise.reject(error)
        }
    }

};

module.exports = TweetsService;