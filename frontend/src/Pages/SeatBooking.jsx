import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axiosInstance from "../Utilities/axiosInstance";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

const SeatBooking = () => {
  const { trainId } = useParams();
  const { state } = useLocation();
  const selectedTrain = state?.selectedTrain;

  const [train, setTrain] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedCompartment, setSelectedCompartment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/api/trains/${trainId}`);
        setTrain(response.data);
        setSelectedCompartment(response.data.compartments[0]?.compartmentName || ""); // Set default compartment
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

        if (seatInCompartment && !seatInCompartment.isBooked) {
          setSelectedSeats([...selectedSeats, seatNumber]);
        } else {
          alert("Seat is not available or already selected.");
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
      });

      alert(response.data.message);
      setSelectedSeats([]);
    } catch (error) {
      alert("Booking failed. Please try again.");
    }
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
      <div className="mt-20">
        <h1 className="text-3xl font-bold mx-auto text-center">
          Train Name: {train?.trainName || "Loading..."}
        </h1>
        <div className="text-2xl font-semibold flex gap-x-8 justify-center mt-8">
          <h2 className="text-slate-700 ">Start: {train?.startStation}</h2>
          <h2 className="text-slate-700">End: {train?.endStation}</h2>
        </div>
        <div className='text-lg font-normal flex gap-x-8 justify-center items-center mt-2'>
          <h2 className='text-slate-900'>Departs: {train?.departs}</h2>
          <h2 className='text-slate-900'>Arrives: {train?.arrives}</h2>
        </div>
        {train?.compartments ? (
          <div>
              <h1 className='mt-7 text-xl text-slate-900 font-bold text-center'>Please Select Compartment</h1>
            <div className="flex justify-center items-center">
              <select
                className="border-2 p-2 mt-4 outline-blue-400 border-blue-500 rounded-lg"
                onChange={(e) => {
                  setSelectedCompartment(e.target.value);
                  setSelectedSeats([]);
                }}
                value={selectedCompartment}
              >
                <option value="">Select Compartment</option>
                {train.compartments.map((compartment) => (
                  <option key={compartment.compartmentName} value={compartment.compartmentName}>
                    {compartment.compartmentName} - {compartment.availableSeats} seats left - Rs.{compartment.price}
                  </option>
                ))}
              </select>
            </div>
            {selectedCompartment && (
              <div className="mt-8 w-[800px] mx-auto pb-10">
                <h3 className="text-lg text-center">*Select Seats (Maximum 5)</h3>
                <div className="grid grid-cols-11 gap-2 mt-4">
                  {train.compartments
                    .find((comp) => comp.compartmentName === selectedCompartment)
                    ?.seats.map((seat) => (
                      <button
                        key={seat.seatNumber}
                        className={`p-2 rounded ${
                          selectedSeats.includes(seat.seatNumber)
                            ? "bg-blue-900 text-white"
                            : seat.isBooked
                            ? "bg-red-500 text-white cursor-not-allowed"
                            : "bg-gray-200"
                        }`}
                        onClick={() => !seat.isBooked && handleSeatSelect(seat.seatNumber)}
                        disabled={seat.isBooked}
                      >
                        {seat.seatNumber}
                      </button>
                    ))}
                </div>
                <button
                  className="bg-blue-500 text-white px-5 py-2 rounded mt-10 hover:bg-blue-600"
                  onClick={handleBookSeats}
                >
                  Next
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

export default SeatBooking;