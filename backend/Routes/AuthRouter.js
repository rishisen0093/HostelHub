const { signup, login ,adminSignup ,adminLogin} = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');


const router = require('express').Router();

router.post('/login', login);
router.post('/signup', signupValidation, signup);
router.post('/admin/signup',signupValidation, adminSignup);
router.post('/admin/login',loginValidation, adminLogin);

module.exports = router;