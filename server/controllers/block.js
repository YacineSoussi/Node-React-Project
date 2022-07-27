const { Op } = require('sequelize');
const Friendship = require('../models/postgres/entities/Friendship');
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