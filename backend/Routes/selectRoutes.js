const express = require('express');
const { selectTrain, trainBooking } = require('../Controllers/selectController');
const router = express.Router();

router.get('/:trainId', selectTrain);
router.post("/:trainId/compartment/:compartmentName/book", trainBooking);

module.exports=router;
