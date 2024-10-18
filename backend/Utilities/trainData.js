const Station = [
    "Colombo Fort", "Maradana", "Peliyagoda", "Polgahawela", "Matara", "Galle"
  ];
  
  const Trains = [
    {
      id: 1,
      name: "1025-Udarata Menike",
      routeName: "Colombo-Badulla",
      route: ["Colombo Fort", "Maradana", "Peliyagoda", "Polgahawela", "Matara"],
      travelDays: ["Monday", "Wednesday"],
      compartments: {
        "First Class Observation":1000,
        "Second Class Reserved": 800,
        "Sleeper Berths": null // Assuming this train doesn't have sleeper berths
      },
      departs:"21:25",
      arrives:"7:16",

    },
    {
      id: 2,
      name: "1025-Podi Menike",
      routeName: "Colombo-Badulla",
      route: ["Colombo Fort", "Maradana", "Peliyagoda", "Polgahawela", "Galle"],
      travelDays: ["Monday", "Wednesday", "Sunday"],
      departs:"08:05",
     arrives:"7:25",

    },

    {
        id:3,
        name: "1025-Podi Menike",
        routeName: "Colombo-Badulla",
        route: ["Colombo Fort", "Maradana", "Peliyagoda", "Polgahawela", "Matara"],
        travelDays: ["Monday", "Wednesday", "Sunday"],
        departs:"10:25",
       arrives:"8:20",
  
      },
    
    
  ];
  
  module.exports = { Station, Trains };
  