const express = require('express');
const { search, searchS } = require('../Controllers/trainController');
const router = express.Router();

router.post('/search',search);
router.post('/searchS', searchS);

module.exports=router;

