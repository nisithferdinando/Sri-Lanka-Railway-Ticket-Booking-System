const express = require('express');
const { getAllTrains, getTrainById, addTrain, updateTrain, deleteTrain, updateTrainStatus, getTotallTrainCount, getTotalTrainCount } = require('../../Controllers/admin/addTrainController');
const router = express.Router();

router.get('/trains/all', getAllTrains);
router.get('/trains/count', getTotalTrainCount);
router.get('/trains/:id', getTrainById);
router.post('/trains/new', addTrain);
router.put('/trains/:id', updateTrain);
router.delete('/trains/:id', deleteTrain);


module.exports=router;
