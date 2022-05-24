const express = require('express');
const router = express.Router();
const UserControllers = require('../controllers/users');
const { isAuth, generateSendJWT } = require('../service/auth');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/sign_up', UserControllers.signUp);

router.post('/sign_in', UserControllers.signIn);

router.post('/updatePassword', isAuth, UserControllers.updatePassword);

router.get('/profile/', isAuth, UserControllers.getProfile);

router.patch('/editProfile/:id', isAuth, UserControllers.updateProfile);

module.exports = router;
