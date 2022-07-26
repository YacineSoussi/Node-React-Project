
const { Op } = require('sequelize');
const UsersRelations = require('../models/postgres/entities/Friendship');
const { asyncHandler } = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/postgres/entities/User');


exports.showFriendsList = asyncHandler(async (req, res, next) => {
	if ((await User.findOne({ where: { id: req.params.id } })) === null)
		return res.json({ error: 'User error !' }, 400);

	const relations = await getUserRelations(req.params.id);

	if (relations.length === 0) return res.json({ friends: [] }, 200);

	const friendsToParse = getSpecificUserRelation('friends', relations);

	const friendsIds = [];
	friendsToParse.forEach((friend) => {
		friend.dataValues.user_sender === parseInt(req.params.id)
			? friendsIds.push(friend.dataValues.user_receiver)
			: friendsIds.push(friend.dataValues.user_sender);
	});

	const myFriends = [];
	for (let i = 0; i < friendsIds.length; i++) {
		const userFound = await User.findByPk(friendsIds[i]);
		myFriends.push({
			email: userFound.dataValues.email,
			firstName: userFound.dataValues.firstName,
			lastName: userFound.dataValues.lastName,
			id: userFound.dataValues.id,
		});
	}

	res.json({ friends: myFriends });
});

exports.showPendingFriendsList = asyncHandler(async (req, res, next) => {
	const relations = await getUserRelations(req.user.id);
	const usersIdPendings = [];
	relations.forEach((relation) => {
		if (
			relation.dataValues.user_receiver === req.user.id &&
			relation.dataValues.status === 'pending_request'
		) {
			usersIdPendings.push(relation.dataValues.user_sender);
		}
	});

	const pendingsRequests = [];
	for (let i = 0; i < usersIdPendings.length; i++) {
		const userFound = await User.findByPk(usersIdPendings[i]);
		pendingsRequests.push({
			email: userFound.dataValues.email,
			firstName: userFound.dataValues.firstName,
			lastName: userFound.dataValues.lastName,
			id: userFound.dataValues.id,
		});
	}
	res.json({ friends: pendingsRequests });
});




exports.sendFriendRequest = asyncHandler(async (req, res, next) => {
	if (req.user.id === parseInt(req.body.id_receiver))
		return next(new ErrorResponse('Same ids.', 422));

	if (!(await User.findByPk(req.body.id_receiver)))
		return next(new ErrorResponse('User does not exist.', 422));

	const datas = orderUsersIds({
		user_sender: req.user.id,
		user_receiver: req.body.id_receiver,
	});

	const relationAlreadyExists = await UsersRelations.findOne({
		where: { user_sender: datas.user_sender, user_receiver: datas.user_receiver },
	});
	if (relationAlreadyExists)
		return next(new ErrorResponse('Relation already exists.', 422));
	const result = await UsersRelations.create(datas);
	if (result) res.json(result, 201);
});


exports.answerFriendsRequest = asyncHandler(async (req, res, next) => {
	if (req.user.id === parseInt(req.body.id_sender))
		return next(new ErrorResponse('Same ids!', 422));

	if (!parseInt(req.body.id_sender) || !req.body.answer)
		return next(new ErrorResponse('Request cannot be processed.', 422));

	if (req.body.answer !== 'accept' && req.body.answer !== 'decline')
		return next(new ErrorResponse('#WRA.', 422)); // Wrong Response Answer

	const transmitterUser = await User.findOne({
		where: { id: req.body.id_sender },
	});
	if (!transmitterUser) return next(new ErrorResponse('#NO', 422)); // No User

	const friendship = await UsersRelations.findOne({
		where: {
			[Op.or]: [
				{
					[Op.and]: [
						{ user_sender: req.body.id_sender },
						{ user_receiver: req.user.id },
						{ status: 'pending_request' },
					],
				},
			],
		},
	});

	if (!friendship) return next(new ErrorResponse('#NFRF', 422)); // No Friend Request Found

	if (req.body.answer === 'accept') {
		friendship.update({ status: 'friends' });
		res.json({});
	} else if (req.body.answer === 'decline') {
		friendship.destroy();
		res.status(204).json({});
	} else {
		return next(new ErrorResponse('Unknown error', 412));
	}
});

const orderUsersIds = ({ user_sender, user_receiver }) => {
	
		return {
			user_sender: user_sender,
			user_receiver: user_receiver,
			status: 'pending_request',
		};
	
};

const getUserRelations = async (id) => {
	const relations = await UsersRelations.findAll({
		where: {
			[Op.or]: [{ user_sender: id }, { user_receiver: id }],
		},
	});
	return relations;
};

const getSpecificUserRelation = (status, relations) => {
	return relations.filter((friend) => friend.dataValues.status === status);
};

