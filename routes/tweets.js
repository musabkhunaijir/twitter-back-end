const express = require('express');
const router = express.Router();

const authController = require('../utils/auth');

const tweetsController = require('../controllers/tweets');

router.use(authController.isAuthorized)

router.route('/')
  .get(tweetsController.getAllTweets)
  .post(tweetsController.addTweet);

router.route('/:parentId/thread')
  .post(tweetsController.addThread);

router.route('/:tweetId/thread')
  .get(tweetsController.getTweetThread)

router.route('/my_tweets')
  .get(tweetsController.myTweets);

module.exports = router;
