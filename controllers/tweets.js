const TweetsService = require('../services/TweetsService')

module.exports = {
    async addTweet(req, response) {
        try {
            const { userId } = req.userInfo;
            const { content } = req.body;

            console.log({ userId });

            const result = await new TweetsService().addTweet({ content, userId });

            return response.status(200).send(result);
        } catch (error) {
            console.error({ error });

            return response.status(error.status ? error.status : 500).send(error);
        }
    },

    async addThread(req, response) {
        try {
            const { userId } = req.userInfo;
            const { content } = req.body;
            const parentId = req.params.parentId;

            const result = await new TweetsService().addThread({ content, parentId, userId });

            return response.status(200).send(result);
        } catch (error) {
            console.error({ error });

            return response.status(error.status ? error.status : 500).send(error);
        }
    },

    async myTweets(req, response) {
        try {
            const { userId } = req.userInfo;
            const { pageNumber } = req.query;

            const result = await new TweetsService().getMyTweets({ user: { userId }, pageNumber });

            return response.status(200).send(result);
        } catch (error) {
            console.error({ error });

            return response.status(error.status ? error.status : 500).send(error);
        }
    },

    async getAllTweets(req, response) {
        try {
            const { pageNumber } = req.query;

            const result = await new TweetsService().getAllTweets({ pageNumber });

            return response.status(200).send(result);
        } catch (error) {
            console.error({ error });

            return response.status(error.status ? error.status : 500).send(error);
        }
    },

    async getTweetThread(req, response) {
        try {
            const { tweetId } = req.params;
            const { pageNumber } = req.query;

            const result = await new TweetsService().getTweetThread({ tweetThread: { tweetId }, pageNumber });

            return response.status(200).send(result);
        } catch (error) {
            console.error({ error });

            return response.status(error.status ? error.status : 500).send(error);
        }
    },

    async updateTweet(req, response) {
        try {
            const { tweetId } = req.params;
            const { content } = req.body;
            const { userId } = req.userInfo;

            const result = await new TweetsService().updateTweet({ tweet: { tweetId, content }, reqUserId: userId });

            return response.status(200).send(result);
        } catch (error) {
            console.error({ error });

            return response.status(error.status ? error.status : 500).send(error);
        }
    },

    async deleteTweet(req, response) {
        try {
            const { tweetId } = req.params;
            const { userId } = req.userInfo;

            const result = await new TweetsService().deleteTweet({ tweet: { tweetId }, reqUserId: userId });

            return response.status(200).send(result);
        } catch (error) {
            console.error({ error });

            return response.status(error.status ? error.status : 500).send(error);
        }
    },

}