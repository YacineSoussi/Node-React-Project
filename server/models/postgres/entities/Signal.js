const { Model, DataTypes } = require('sequelize');
const connection = require('../db');

class Signal extends Model {}

Signal.init(
	{
		user_id_requester: {
			type: DataTypes.INTEGER,
			allowNull: false,
			require: true,
		},

		user_id_to_signal: {
			type: DataTypes.INTEGER,
			allowNull: false,
			require: true,
		},
		reason: {
			type: DataTypes.ENUM('fake profil','worst Behavior','scam','other'),
			allowNull: false,
			require: true
		},

		comment: {
			type: DataTypes.STRING,
			allowNull: true,
			require: false
		},
	},
	{
		sequelize: connection,
		modelName: 'signal',
	}
);

module.exports = Signal;
