const express=require('express');
const { getAllBookings, getAllBookingCount, processRefund } = require('../../Controllers/admin/bookingAllController');
const authenticateToken = require('../../Utilities/utiliies');
const router=express.Router();

router.get('/bookings/all', getAllBookings);
router.get('/bookings/count', getAllBookingCount);
router.post('/:bookingId/process-refund', processRefund);


module.exports=router;