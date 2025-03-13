const Train = require('../../models/Train'); // Adjust path as needed


  exports.getAllTrains= async (req, res) => {
    try {
      const trains = await Train.find();
      res.status(200).json(trains);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  exports.getTrainById=async (req, res) => {
    try {
      const train = await Train.findById(req.params.id);
      if (!train) {
        return res.status(404).json({ message: 'Train not found' });
      }
      res.status(200).json(train);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

 
  exports.addTrain=async (req, res) => {
    try {
      const {
        trainName,
        trainNameS,
        route,
        routeS,
        start,
        end,
        startS,
        operatingDays,
        departs,
        arrives,
        compartments
      } = req.body;

      
      if (!trainName || !trainNameS || !route || !routeS || !start || !end|| !startS||
          !operatingDays || !departs || !arrives || !compartments) {
        return res.status(400).json({ message: 'All required fields must be provided' });
      }

      
      const processedCompartments = compartments.map(compartment => {
       
        if (!compartment.seats) {
          compartment.seats = generateSeats(compartment.totalSeats);
        }

        return {
          compartmentName: compartment.name,
          totalSeats: parseInt(compartment.totalSeats),
          availableSeats: parseInt(compartment.totalSeats),
          price: parseFloat(compartment.price) || 0,
          seats: compartment.seats,
          arrivalTime: compartment.arrivalTime || ''
        };
      });

      
      const newTrain = new Train({
        trainName,
        trainNameS,
        route,
        routeS,
        start,
        end,
        startS,
        operatingDays,
        departs,
        arrives,
        compartments: processedCompartments
      });

      const savedTrain = await newTrain.save();
      res.status(201).json(savedTrain);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  
  exports.updateTrain= async (req, res) => {
    try {
      const {
        trainName,
        trainNameS,
        route,
        routeS,
        start,
        end,
        startS,
        operatingDays,
        departs,
        arrives,
        compartments
      } = req.body;

      
      let processedCompartments;
      if (compartments) {
        processedCompartments = compartments.map(compartment => {
          return {
            compartmentName: compartment.name,
            totalSeats: parseInt(compartment.totalSeats),
            availableSeats: parseInt(compartment.availableSeats || compartment.totalSeats),
            price: parseFloat(compartment.price) || 0,
            seats: compartment.seats || generateSeats(compartment.totalSeats),
            arrivalTime: compartment.arrivalTime || ''
          };
        });
      }

     
      const updatedTrain = await Train.findByIdAndUpdate(
        req.params.id,
        {
          ...(trainName && { trainName }),
          ...(trainNameS && { trainNameS }),
          ...(route && { route }),
          ...(routeS && { routeS }),
          ...(start && { start }),
          ...(end && { end }),
          ...(startS && { startS }),
          ...(operatingDays && { operatingDays }),
          ...(departs && { departs }),
          ...(arrives && { arrives }),
          ...(processedCompartments && { compartments: processedCompartments })
        },
        { new: true }
      );

      if (!updatedTrain) {
        return res.status(404).json({ message: 'Train not found' });
      }
      
      res.status(200).json(updatedTrain);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

 
 exports.deleteTrain= async (req, res) => {
    try {
      const deletedTrain = await Train.findByIdAndDelete(req.params.id);
      if (!deletedTrain) {
        return res.status(404).json({ message: 'Train not found' });
      }
      res.status(200).json({ message: 'Train deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

const generateSeats = (totalSeats) => {
  const seats = [];
  const halfSeats = totalSeats / 2;
  
  for (let i = 1; i <= halfSeats; i++) {
    seats.push({
      seatNumber: `R${i}`,
      isBooked: false,
      exp: []
    });
  }
  
  for (let i = 1; i <= halfSeats; i++) {
    seats.push({
      seatNumber: `L${halfSeats + i}`,
      isBooked: false,
      exp: []
    });
  }
  
  return seats;
};

exports.getTotalTrainCount = async(req, res) => {
  try {
    const count = await Train.countDocuments({});
    res.status(200).json(count);
  }
  catch(error) {
    console.log("error fetching", error);
    res.status(500).json({error: true, message: "error in fetching total count"});
  }
};
