const { Model, DataTypes } = require("sequelize");
const connection = require("../db");

class Message extends Model {}

Message.init({

    content: DataTypes.STRING,
    state: DataTypes.STRING
}, {
    sequelize: connection,
    modelName: "message",
});

module.exports = Message;