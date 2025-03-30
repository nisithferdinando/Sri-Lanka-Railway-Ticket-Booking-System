const express=require('express');
const { getUsers, getAllUserCount } = require('../../Controllers/admin/userController');
const { getUserBooking } = require('../../Controllers/admin/userBookingController');
const authenticateToken = require('../../Utilities/utiliies');
const router=express.Router();

router.get('/users/all',getUsers);
router.get('/users/count',getAllUserCount);
router.get('/users/booking/:userId', getUserBooking);


module.exports=router;