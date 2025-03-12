import React, { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Station, Stationsin } from '../../../Utilities/trainData'; // Ensure you have this import
import axiosInstance from '../../../Utilities/axiosInstance';


const AddTrains = ({onSuccess}) => {
 
  const [trainName, setTrainName] = useState('');
  const [trainNameSinhala, setTrainNameSinhala] = useState('');
  const [operatingDays, setOperatingDays] = useState([]);
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [startStation, setStartStation] = useState('');
  const [endStation, setEndStation] = useState('');
  const [startStationS, setStartStationS]=useState('');
  const [routes, setRoutes] = useState([]);
  const [currentRoute, setCurrentRoute] = useState({
    english: '',
    sinhala: ''
  });

  const [compartments, setCompartments] = useState([]);
  const [currentCompartment, setCurrentCompartment] = useState({
    name: '',
    totalSeats: '',
    price: '',
    arrivalTime: ''
  });

  const generateSeats = (totalSeats) => {
    const seats = [];
    const halfSeats = totalSeats / 2;
    
    for (let i = 1; i <= halfSeats; i++) {
      seats.push({
        seatNumber: `R${i}`,
        exp: []
      });
    }
    
    for (let i = 1; i <= halfSeats; i++) {
      seats.push({
        seatNumber: `L${halfSeats + i}`,
        exp: []
      });
    }
    
    return seats;
  };
 
  const addRoute = () => {
    if (currentRoute.english && currentRoute.sinhala) {
      setRoutes([...routes, {
        english: currentRoute.english,
        sinhala: currentRoute.sinhala
      }]);
      setCurrentRoute({ english: '', sinhala: '' });
    }
  };

  const removeRoute = (index) => {
    const newRoutes = routes.filter((_, i) => i !== index);
    setRoutes(newRoutes);
  };

  const addCompartment = () => {
    if (currentCompartment.name && currentCompartment.totalSeats) {
      const seatsForCompartment = generateSeats(parseInt(currentCompartment.totalSeats));
      
      const newCompartment = {
        ...currentCompartment,
        seats: seatsForCompartment,
        availableSeats: parseInt(currentCompartment.totalSeats)
      };

      setCompartments([...compartments, newCompartment]);
      
      
      setCurrentCompartment({
        name: '',
        totalSeats: '',
        price: '',
        arrivalTime: ''
      });
    }
  };
  
  const removeCompartment = (index) => {
    const newCompartments = compartments.filter((_, i) => i !== index);
    setCompartments(newCompartments);
  };

  const handleSubmit = async () => {
    try{
    const trainData = {
      trainName,
      trainNameS: trainNameSinhala,
      route: routes.map(r => r.english),
      routeS: routes.map(r => r.sinhala),
      start: startStation,
      end: endStation,
      startS:startStationS,
      operatingDays,
      departs: departureTime,
      arrives: arrivalTime,
      compartments
    };
    
    const response=await axiosInstance.post('/api/admin/trains/new', trainData);

    resetForm();
    if (onSuccess) {
      onSuccess();
    }
    
  }
  catch(error){
    console.log("Error adding train", error);
    const errorMessage=error.response?.data?.message || error.message || "Failed to add train";
    
   }
  };

  const resetForm = () => {
    setTrainName('');
    setTrainNameSinhala('');
    setOperatingDays([]);
    setDepartureTime('');
    setArrivalTime('');
    setStartStation('');
    setEndStation('');
    setRoutes([]);
    setCurrentRoute({ english: '', sinhala: '' });
    setCompartments([]);
    setCurrentCompartment({
      name: '',
      totalSeats: '',
      price: '',
      arrivalTime: ''
    });
  };

  return (
    <div>
       
      <div className="mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-6 text-center text-gray-500">Add New Train</h1>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Train Name (English)</label>
            <input
              placeholder="Enter train name"
              value={trainName}
              onChange={(e) => setTrainName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Train Name (Sinhala)</label>
            <input
              placeholder="ට්‍රේන් නාමය"
              value={trainNameSinhala}
              onChange={(e) => setTrainNameSinhala(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Station</label>
            <select
              value={startStation}
              onChange={(e) => setStartStation(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select Start Station</option>
              {Station.map((station, index) => (
                <option key={index} value={station}>{station}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Station</label>
            <select
              value={endStation}
              onChange={(e) => setEndStation(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select End Station</option>
              {Station.map((station, index) => (
                <option key={index} value={station}>{station}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Station (Sinhala)</label>
            <select
              value={startStationS}
              onChange={(e) => setStartStationS(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select start Station (Sinhala)</option>
              {Stationsin.map((station, index) => (
                <option key={index} value={station}>{station}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
            <input
              type="time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Operating Days</label>
          <div className="flex flex-wrap gap-2">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <label key={day} className="flex items-center">
                <input
                  type="checkbox"
                  value={day}
                  checked={operatingDays.includes(day)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setOperatingDays([...operatingDays, day]);
                    } else {
                      setOperatingDays(operatingDays.filter(d => d !== day));
                    }
                  }}
                  className="mr-1"
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Routes</h2>
          
          <div className="mb-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Station (English)</label>
                <select
                  value={currentRoute.english}
                  onChange={(e) => setCurrentRoute({...currentRoute, english: e.target.value})}
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-200"
                  >
                  <option value="">Select Station</option>
                  {Station.map((station, index) => (
                    <option key={index} value={station}>{station}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Station (Sinhala)</label>
                <select
                  placeholder="ස්ථානය"
                  value={currentRoute.sinhala}
                  onChange={(e) => setCurrentRoute({...currentRoute, sinhala: e.target.value})}
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-200"
                >
                   <option value="">Select Station</option>
                  {Stationsin.map((station, index) => (
                    <option key={index} value={station}>{station}</option>
                  ))}
                  </select>
              </div>
            </div>
            
            <div className="mt-3 flex justify-end">
              <button 
                onClick={addRoute}
                disabled={!currentRoute.english || !currentRoute.sinhala}
                className="bg-blue-500 text-white p-2 rounded flex items-center disabled:bg-gray-300"
              >
                <PlusCircle className="mr-2" /> Add Route
              </button>
            </div>
          </div>
        
          <div className="max-h-40 overflow-y-auto">
            {routes.map((route, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-100 p-2 mb-2 rounded">
                <div>
                  <span className="font-medium">{route.english}</span>
                  <span className="mx-2">-</span>
                  <span className="text-gray-600">{route.sinhala}</span>
                </div>
                <button 
                  onClick={() => removeRoute(index)}
                  className="text-red-500"
                >
                  <Trash2 />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Compartments</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compartment Name</label>
              <input
                placeholder="AC, Second Class, etc."
                value={currentCompartment.name}
                onChange={(e) => setCurrentCompartment({
                  ...currentCompartment,
                  name: e.target.value
                })}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats</label>
              <input
                type="number"
                placeholder="Number of seats"
                value={currentCompartment.totalSeats}
                onChange={(e) => setCurrentCompartment({
                  ...currentCompartment,
                  totalSeats: e.target.value
                })}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                placeholder="Ticket price"
                value={currentCompartment.price}
                onChange={(e) => setCurrentCompartment({
                  ...currentCompartment,
                  price: e.target.value
                })}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
          
          <div className="flex justify-end mb-4">
            <button 
              onClick={addCompartment}
              disabled={!currentCompartment.name || !currentCompartment.totalSeats}
              className="bg-blue-500 text-white p-2 rounded flex items-center disabled:bg-gray-300"
            >
              <PlusCircle className="mr-2" /> Add Compartment
            </button>
          </div>
          
          <div className="max-h-40 overflow-y-auto">
            {compartments.map((compartment, index) => (
              <div key={index} className="bg-gray-100 p-3 mb-2 rounded flex justify-between items-center">
                <div>
                  <div className="font-medium">{compartment.name}</div>
                  <div className="text-sm text-gray-600">
                    Seats: {compartment.totalSeats} | Price: {compartment.price}
                  </div>
                </div>
                <button 
                  onClick={() => removeCompartment(index)}
                  className="text-red-500"
                >
                  <Trash2 />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 transition"
        >
          Submit Train
        </button>
      </div>
    </div>
  );
};

export default AddTrains;