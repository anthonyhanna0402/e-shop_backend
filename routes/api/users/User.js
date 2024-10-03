const express= require('express');
const router = express.Router()

const {authJWT} = require('../../../middlewares');
const controller = require('../../../controller/user');

router.use((req, res, next)=> {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept"
  );
  next();
})

router.get('/all',controller.allAccess);
router.get('/user', [authJWT.verifyToken], controller.userBoard);
router.get('/moderator', [authJWT.verifyToken, authJWT.isModerator], controller.moderatorBoard);
router.get('/admin', [authJWT.verifyToken, authJWT.isAdmin], controller.adminBoard);

module.exports = router;