const express=require('express');
const {signup, login, getAccount, updateUserDetails}=require('../Controllers/authController');
const authenticateToken = require('../Utilities/utiliies');
const router=express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/account",authenticateToken, getAccount);
router.put('/account', authenticateToken, updateUserDetails); 

module.exports=router;