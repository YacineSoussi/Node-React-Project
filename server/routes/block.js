const { Router } = require('express');
const checkAuthentication = require('../middlewares/checkAuthentication');
const {
	blockUser,
    unblockUser,
	showBlockedUsers,
} = require('../controllers/block');

const router = new Router();

router.route('/yes').post(checkAuthentication, blockUser);
router.route('/no').post(checkAuthentication, unblockUser);
router.route('/all').get(checkAuthentication, showBlockedUsers);




module.exports = router;
