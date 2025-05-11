
const express=require('express');
const { verifyTicket, approveTicket } = require('../../Controllers/admin/ticketController');
const router= express.Router();

router.get('/verify/:ticketId', verifyTicket);
router.post('/approve', approveTicket);

module.exports=router;
