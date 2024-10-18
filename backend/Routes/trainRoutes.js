const express = require('express');
const router = express.Router();
const { Trains } = require('../Utilities/trainData');

router.post('/api/search-trains', (req, res) => {
  const { startStation, endStation, selectedDate } = req.body;
  const dayOfWeek = new Date(selectedDate).toLocaleString('en-US', { weekday: 'long' });

  const matchingTrains = Trains.filter((train) => {
    const trainRoute = train.route;
    const userStartIndex = trainRoute.indexOf(startStation);
    const userEndIndex = trainRoute.indexOf(endStation);

    const isWithinRoute = userStartIndex !== -1 && userEndIndex !== -1 && userStartIndex < userEndIndex;

    const runsOnSelectedDate = train.travelDays.includes(dayOfWeek);

    return isWithinRoute && runsOnSelectedDate;
  });

  res.json(matchingTrains);
});

module.exports = router;
