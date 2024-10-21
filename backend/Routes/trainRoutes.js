const express = require('express');
const router = express.Router();
const Train = require('../models/Train'); 

router.post('/search', async (req, res) => {
    const { startStation, endStation, selectedDate} = req.body;
    const dayOfWeek = new Date(selectedDate).toLocaleString('en-US', { weekday: 'long' });

    try {
        
        const matchingTrains = await Train.find({
            route: { $all: [startStation, endStation] }, 
            operatingDays: dayOfWeek
        });

          const filteredTrains = matchingTrains.filter(train => {
            const startIndex = train.route.indexOf(startStation);
            const endIndex = train.route.indexOf(endStation);
            return startIndex !== -1 && endIndex !== -1 && startIndex < endIndex;
        });

        
        if (filteredTrains.length === 0) {
            return res.status(404).json({ error: true, message: 'No trains available for the specified route.' });
        }

        
        const response = filteredTrains.map(train => ({
            id: train._id,
            trainName: train.trainName,
            route: train.route.join(' - '),
            startStation: startStation,
            endStation: endStation,
            operatingDays: train.operatingDays,
            compartments: train.compartments,
            departs: train.departs,
            arrives: train.arrives,
            start: train.start,
            
        }));

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching trains from the database.' });
    }
});

  //train search sinhala 
     router.post('/searchS', async (req, res) => {
    const { startStationS, endStationS, selectedDateS} = req.body;
    const dayOfWeek = new Date(selectedDateS).toLocaleString('en-US', { weekday: 'long' });

    try {
        
        const matchingTrains = await Train.find({
            routeS: { $all: [startStationS, endStationS] },
            operatingDays: dayOfWeek
        });

        const filteredTrains = matchingTrains.filter(train => {
            const startIndex = train.routeS.indexOf(startStationS);
            const endIndex = train.routeS.indexOf(endStationS);
            return startIndex !== -1 && endIndex !== -1 && startIndex < endIndex;
        });

        
        if (filteredTrains.length === 0) {
            return res.status(404).json({ error: true, message: 'No trains available for the specified route.' });
        }

          const response = filteredTrains.map(train => ({
            id: train._id,
            trainNameS:train.trainNameS,
            routeS: train.routeS.join(' - '),
            operatingDays: train.operatingDays,
            compartments: train.compartments,
            departs: train.departs,
            arrives: train.arrives,
            startS: train.startS,
        }));

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching trains from the database.' });
    }
});

module.exports = router;