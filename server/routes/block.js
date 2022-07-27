const { Router } = require('express');
const checkAuthentication = require('../middlewares/checkAuthentication');
const {
	blockUser,
    unblockUser,
	
} = require('../controllers/block');

const router = new Router();

router.route('/yes').post(checkAuthentication, blockUser);
router.route('/no').post(checkAuthentication, unblockUser);




module.exports = router;
