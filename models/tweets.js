'use strict';
module.exports = (sequelize, DataTypes) => {
  const tweets = sequelize.define('tweets', {
    content: DataTypes.STRING,
    parentId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  tweets.associate = function (models) {
    // associations can be defined here
    tweets.belongsTo(models.users, { foreignKey: 'userId', as: 'user' });

    tweets.hasMany(models.tweets, { foreignKey: 'parentId', as: 'thread' });
  };

  return tweets;
};