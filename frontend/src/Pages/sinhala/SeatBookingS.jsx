
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axiosInstance from "../../Utilities/axiosInstance";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

const SeatBookingS = () => {
    const { trainId } = useParams();
    const { search, state } = useLocation();
    const selectedTrain = state?.selectedTrain;
  
    const [train, setTrain] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedCompartment, setSelectedCompartment] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const params = new URLSearchParams(search);
    const dateParam = params.get('date');
    
    const selectedDate = dateParam; 
    
    console.log("Selected Date:", selectedDate); 
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get(`/api/trains/${trainId}`);
          setTrain(response.data);
          setSelectedCompartment(response.data.compartments[0]?.compartmentName || "");
        } catch (error) {
          console.error("Error fetching train data:", error);
          setError("Error fetching train data. Please try again.");
        } finally {
          setLoading(false);
        }
      };
  
      if (selectedTrain) {
        setTrain(selectedTrain);
        setLoading(false);
        setSelectedCompartment(selectedTrain.compartments[0]?.compartmentName || "");
      } else {
        fetchData();
      }
    }, [selectedTrain, trainId]);
  
    const handleSeatSelect = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      
      setSelectedSeats((prev) => prev.filter((seat) => seat !== seatNumber));
    } else if (selectedSeats.length < 5) {
      
      const selectedCompartmentData = train.compartments.find(
        (compartment) => compartment.compartmentName === selectedCompartment
      );
      
      if (selectedCompartmentData) {
        const seatInCompartment = selectedCompartmentData.seats.find(
          (seat) => seat.seatNumber === seatNumber
        );
  
        if (
          seatInCompartment &&
          Array.isArray(seatInCompartment.exp) &&
          !seatInCompartment.exp.some((exp) => exp === selectedDate)
        ) {
          setSelectedSeats((prev) => [...prev, seatNumber]);
        } else {
          alert("Seat is not available or already booked.");
        }
      } else {
        alert("Invalid compartment selection.");
      }
    } else {
      alert("You can select up to 5 seats only.");
    }
  };
  
    
  
    const handleBookSeats = async () => {
      if (selectedSeats.length === 0) {
        alert("Please select at least one seat.");
        return;
      }
  
      try {
        const response = await axiosInstance.post(`/api/trains/${trainId}/compartment/${selectedCompartment}/book`, {
          seatNumbers: selectedSeats,
          selectedDate:selectedDate
        });
        console.log(selectedDate);
        alert(response.data.message);
        setSelectedSeats([]);
      } catch (error) {
        alert("Booking failed. Please try again.");
        console.log(error);
      }
    };
  
    const isSeatBooked = (expTimes) => {
      if (!Array.isArray(expTimes) || expTimes.length === 0) return false; 
      
      return expTimes.some(exp => {
          if (!exp) return false; 
          const expirationTime = new Date(exp).toISOString().split('T')[0];
          console.log(selectedDate === expirationTime, selectedDate,expirationTime);
          return selectedDate === expirationTime; 
      });
  };
  
    
  
    if (loading) {
      return <p>Loading train data...</p>;
    }
  
    if (error) {
      return <p>{error}</p>;
    }
  
    return (
      <div>
        <Navbar />
        <div className="mt-14">
          <h1 className="text-3xl font-bold mx-auto text-center">
           දුම්රිය: {train?.trainNameS || "Loading..."}
          </h1>
          <h2 className='text-lg text-center font-sans text-blue-700 mt-4'>දිනය: {selectedDate}</h2>
          <div className="text-xl font-semibold flex gap-x-8 justify-center mt-8">
            <h2 className="text-slate-700 ">ආරම්භය: {train?.startStationS}</h2>
            <h2 className="text-slate-700">ගමනාන්තය: {train?.endStationS}</h2>
          </div>
          <div className='text-lg font-normal flex gap-x-8 justify-center items-center mt-2'>
            <h2 className='text-slate-900'>පිටවීම: {train?.departs}</h2>
            <h2 className='text-slate-900'>පැමිණීම: {train?.arrives}</h2>
          </div>
          {train?.compartments ? (
            <div>
                <h1 className='mt-7 text-lg text-slate-900 font-bold text-center'>කරුණාකර තෝරන්න</h1>
                
              <div className="flex justify-center items-center">
                <select
                  className="border-2 px-10 py-2 mt-4 outline-blue-400 border-blue-500 rounded-lg"
                  onChange={(e) => {
                    setSelectedCompartment(e.target.value);
                    setSelectedSeats([]);
                  }}
                  value={selectedCompartment}
                >
                  
                  {train.compartments.map((compartment) => (
                    <option key={compartment.compartmentName} value={compartment.compartmentName}>
                      {compartment.compartmentName} - price  Rs.{compartment.price}
                    </option>
                  ))}
                </select>
                
              </div>
              <div className='flex justify-center mt-8 gap-x-8 '>
                  <div className='flex gap-x-4'>
                    <div className='px-8 py-4 rounded bg-gray-200'>
                      </div>
                      <p className='text-lg text-slate-800'>ආසන ඇත </p>
                    </div>
                    <div className='flex gap-x-4'>
                      <div className='px-8 py-4 rounded bg-blue-900'>
                        </div>
                        <p className='text-lg text-slate-800'>සැකසීම </p>
                      </div>
                      <div className='flex gap-x-4'>
                        <div className='px-8 py-4 rounded bg-red-500'>
                          </div>
                          <p className='text-lg text-slate-800'>ඇණවුම් කළ</p>
                        </div>
                </div>
              {selectedCompartment && (
                <div className="mt-8 w-[800px] mx-auto pb-14">
                  <h3 className="text-base text-center">*ආසන තෝරන්න(සීමාව 5)</h3>
                  
                  <div className="grid grid-cols-11 gap-2 mt-4">
                    {train.compartments
                      .find((comp) => comp.compartmentName === selectedCompartment)
                      ?.seats.map((seat) => (
                        <button
                          key={seat.seatNumber}
                          className={`p-2 rounded ${
                            selectedSeats.includes(seat.seatNumber)
                              ? "bg-blue-900 text-white"
                              : isSeatBooked(seat.exp)
                              ? "bg-red-500 text-white cursor-not-allowed"
                              : "bg-gray-200"
                          }`}
                          onClick={() => handleSeatSelect(seat.seatNumber)}
                          disabled={isSeatBooked(seat.exp)}
                        >
                          {seat.seatNumber}
                        </button>
                      ))}
                  </div>
                  
                  <button
                    className="bg-blue-500 text-white px-5 py-2 rounded mt-10 hover:bg-blue-600"
                    onClick={handleBookSeats}
                  >
                    ඉදිරියට
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p>Loading compartments...</p>
          )}
        </div>
        <Footer/>
      </div>
    );
  };
  
  export default SeatBookingS;
  