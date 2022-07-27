const { Model, DataTypes } = require('sequelize');
const connection = require('../db');
const ErrorResponse = require('../../../utils/errorResponse');

class Friendship extends Model {}

Friendship.init(
	{
		user_sender: {
			type: DataTypes.INTEGER,
			allowNull: false,
			require: true,
		},
		user_receiver: {
			type: DataTypes.INTEGER,
			allowNull: false,
			require: true,
		},
		status: {
			type: DataTypes.STRING,
			require: true,
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
		},
		updatedAt: {
			type: DataTypes.DATE,
		}
	},
	{
		sequelize: connection,
		modelName: 'friendship'
	}
);


const checkUsersRelationsDatas = async (friendship) => {
	if (friendship.user_sender === friendship.user_receiver) {
		throw new ErrorResponse('sender & receiver has same id', 422);
	}
};

Friendship.addHook('beforeCreate', checkUsersRelationsDatas);
Friendship.addHook('beforeUpdate', checkUsersRelationsDatas);

module.exports = Friendship;