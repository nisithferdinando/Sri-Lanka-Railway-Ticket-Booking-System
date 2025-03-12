const express=require('express');
const { getUsers } = require('../../Controllers/admin/userController');
const { getUserBooking } = require('../../Controllers/admin/userBookingController');
const router=express.Router();

router.get('/users/all',getUsers);
router.get('/users/booking/:userId', getUserBooking);

module.exports=router;