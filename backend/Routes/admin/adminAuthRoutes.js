const express=require('express');
const { adminLogin } = require('../../Controllers/admin/adminAuthController');
const router=express.Router();

router.post('/adminLogin', adminLogin);

module.exports=router;