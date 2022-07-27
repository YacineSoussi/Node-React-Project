
const Signal = require('../models/postgres/entities/Signal');
const { asyncHandler } = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/postgres/entities/User');
const { Op } = require('sequelize');



exports.signalRequest = asyncHandler(async (req, res, next) => {
	if (!req.body.user_id_to_signal || !req.body.reason) {
		return next(new ErrorResponse('Unprocessable entity', 422));
	}

	if (req.user.id === parseInt(req.body.user_id_to_signal))
		return next(new ErrorResponse('Same ids.', 422));

	if (!(await User.findByPk(req.body.user_id_to_signal)))
		return next(new ErrorResponse('User does not exist.', 422));

	const relationAlreadyExists = await Signal.findOne({
		where: {
			user_id_requester: req.user.id,
			user_id_to_signal: req.body.user_id_to_signal,
		},
	});
	if (relationAlreadyExists)
		return next(new ErrorResponse('Already requested.', 422));

	const data = {
		user_id_requester: req.user.id,
		user_id_to_signal: req.body.user_id_to_signal,
		reason: req.body.reason,
		comment: req.body.comment,
	};
	const result = await Signal.create(data);
	if (result) res.json(result, 201);
	res.json('Blocking request not sent.', 400);
});

exports.showSignaledUsers = asyncHandler(async (req, res, next) => {
	const signals = await getSignaled(req.user.id);
	const usersSignaledId = [];
	signals.forEach((signal) => {
		usersSignaledId.push(signal.dataValues.user_id_to_signal);
	});

	const SignaledUsers = [];
	for (let i = 0; i < usersSignaledId.length; i++) {
		const userFound = await User.findByPk(usersSignaledId[i]);
		SignaledUsers.push({
			email: userFound.dataValues.email,
			firstName: userFound.dataValues.firstName,
			lastName: userFound.dataValues.lastName,
			id: userFound.dataValues.id,
		});
	}
	res.json({ SignaledUsers: SignaledUsers });
});

const getSignaled = async (id) => {
	const friendships = await Signal.findAll({
		
	});
	return friendships;
};