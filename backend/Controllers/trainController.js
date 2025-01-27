const Train = require('../models/Train'); 

// Train search in English
exports.search= async (req, res) => {
    const { startStation, endStation, selectedDate } = req.body;

    const today = new Date();
  const selected = new Date(selectedDate);

    if (selected <= today) {
        return res.status(400).json({ error: true, message: 'Please select a future date.' });
    }

    const maxBookingDate = new Date(today);
    maxBookingDate.setDate(today.getDate() + 5);

    if (selected > maxBookingDate) {
        return res.status(400).json({ error: true, message: 'Booking is only allowed up to 5 days from today.' });
      }
    const dayOfWeek = selected.toLocaleString('en-US', { weekday: 'long' });

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
}

// Train search in Sinhala
exports.searchS= async (req, res) => {
    const { startStationS, endStationS, selectedDateS } = req.body;

    const today = new Date();
    const selected = new Date(selectedDateS);

    if (selected <= today) {
        return res.status(400).json({ error: true, message: 'Please select a future date.' });
    }

    const dayOfWeek = selected.toLocaleString('en-US', { weekday: 'long' });

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
            trainNameS: train.trainNameS,
            routeS: train.routeS.join(' - '),
            operatingDays: train.operatingDays,
            compartments: train.compartments,
            departs: train.departs,
            arrives: train.arrives,
            startS: train.startS,
            trainName:train.trainName,
        }));

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching trains from the database.' });
    }
}

