const express =  require('express');
const userController = require('../controllers/usercontoller');
const router =  express.Router();
// const checkAuth = require('../middlewares/check-auth');


// unauthenticated 
router.post('/signup',userController.userSignup);
router.post('/login',userController.userLogin);
// router.post('/postblog',userController.postBlog);
// // authenticated
// router.get('/getuser',userController.getBlog);
// router.get('/getblog',userController.getUser);

module.exports=router;