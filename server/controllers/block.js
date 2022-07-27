const { Op } = require('sequelize');
const Friendship = require('../models/postgres/entities/Friendship');
const User = require('../models/postgres/entities/User');

const { asyncHandler } = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');



exports.blockUser = asyncHandler(async (req, res, next) => {
	if (!req.body.user_to_block)
		return next(new ErrorResponse('Request cannot be processed.', 400));

	if (req.user.id === parseInt(req.body.user_to_block))
		return next(new ErrorResponse('Same ids!', 400));

	const friendshipUp = await Friendship.findOne({
		where: {
			[Op.or]: [
				{
					[Op.and]: [
						{ user_sender: req.user.id },
						{ user_receiver: req.body.user_to_block },
					],
				},
				{
					[Op.and]: [
						{ user_sender: req.body.user_to_block },
						{ user_receiver: req.user.id },
					],
				},
			],
		},
	});
	
	if (friendshipUp) {
		req.user.id < req.body.user_to_block
			? friendshipUp.update({ status: 'user_blocked' })
			: friendshipUp.update({ status: 'user_blocked' });
		return res.json({ friendshipUp });
	} else {
		req.user.id < req.body.user_to_block
			? await Friendship.create({
					user_sender: req.user.id,
					user_receiver: req.body.user_to_block,
					status: 'user_blocked',
			  })
			: await Friendship.create({
					user_sender: req.body.user_to_block,
					user_receiver: req.user.id,
					status: 'user_blocked',
			  });
		res.json({}, 201);
	}
	next();
});

exports.unblockUser = asyncHandler(async (req, res, next) => {
	if (!req.body.user_to_unblock)
		return next(new ErrorResponse('Request cannot be processed.', 400));

	if (req.user.id === parseInt(req.body.user_to_unblock))
		return next(new ErrorResponse('Same ids!', 400));

	const friendshipUp = await Friendship.findOne({
		where: {
			[Op.or]: [
				{
					[Op.and]: [
						{ user_sender: req.user.id },
						{ user_receiver: req.body.user_to_unblock },
						{ status: 'user_blocked' },
					],
				},
				{
					[Op.and]: [
						{ user_sender: req.body.user_to_unblock },
						{ user_receiver: req.user.id },
						{ status: 'user_blocked' },
					],
				},
			],
		},
	});

	if (friendshipUp) {
		friendshipUp.destroy();
		return res.json({}, 204);
	}
	return next(new ErrorResponse('#NR', 400));
});

exports.showBlockedUsers = asyncHandler(async (req, res, next) => {
	const friendships = await getFriendships(req.user.id);
	const usersBlockedId = [];
	friendships.forEach((friendship) => {
		if (
			
			friendship.dataValues.status === 'user_blocked'
		) {
			usersBlockedId.push(friendship.dataValues.user_receiver);
		}
	});

	const blockedUsers = [];
	for (let i = 0; i < usersBlockedId.length; i++) {
		const userFound = await User.findByPk(usersBlockedId[i]);
		blockedUsers.push({
			email: userFound.dataValues.email,
			firstName: userFound.dataValues.firstName,
			lastName: userFound.dataValues.lastName,
			id: userFound.dataValues.id,
		});
	}
	res.json({ users_blocked: blockedUsers });
});

const getFriendships = async (id) => {
	const friendships = await Friendship.findAll({
		
	});
	return friendships;
};

