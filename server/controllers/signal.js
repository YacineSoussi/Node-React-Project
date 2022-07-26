
const Signal = require('../models/postgres/entities/Signal');
const { asyncHandler } = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/postgres/entities/User');


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
