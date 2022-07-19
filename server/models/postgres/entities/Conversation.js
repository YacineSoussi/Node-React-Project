const { Model, DataTypes } = require("sequelize");
const connection = require("../db");

class Conversation extends Model {}

Conversation.init({

}, {
    sequelize: connection,
    modelName: "Conversation",
});

module.exports = Conversation;