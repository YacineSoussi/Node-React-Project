const { Router } = require('express');
const checkAuthentication = require('../middlewares/checkAuthentication');
const { signalRequest } = require('../controllers/signal');

const router = new Router();

router.route('/new-request').post(checkAuthentication, signalRequest);

module.exports = router;