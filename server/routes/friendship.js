const { Router } = require('express');
const checkAuthentication = require('../middlewares/checkAuthentication');
const {
	sendFriendRequest,
	showFriendsList,
	showPendingFriendsList,
	showBlockedUsers,
	answerFriendsRequest,
	blockUser,
	unblockUser,
} = require('../controllers/friendship');

const router = new Router();

router.route('/add').post(checkAuthentication, sendFriendRequest);
router.route('/pendings').get(checkAuthentication, showPendingFriendsList);
router.route('/show/:id').get(checkAuthentication, showFriendsList);
router.route('/request-answer').post(checkAuthentication, answerFriendsRequest);

module.exports = router;
