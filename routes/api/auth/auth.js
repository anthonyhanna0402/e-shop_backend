const express = require('express');
const router = express.Router();

const {verifySignUp} = require('../../../middlewares');
const authController = require('../../../controller/auth');

router.use((req, res, next)=> {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept"
  );
  next();
});

router.post('/signup', [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted], authController.signup);
router.post('/signin', authController.signin);
router.post('/signout', authController.signout);

module.exports = router;