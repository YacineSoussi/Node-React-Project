const { Model, DataTypes } = require("sequelize");
const connection = require("../db");

class Participant extends Model {}

Participant.init({

}, {
    sequelize: connection,
    modelName: "participant",
});

module.exports = Participant;