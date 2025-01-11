// ReviewBooking.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

const ReviewBooking = () => {
  const location = useLocation();
  const bookingDetails = location.state;
  const navigate= useNavigate();

  const handleBack=()=>{
    navigate(-1);
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 mt-14">
        <h1 className="text-3xl font-bold text-center mb-6 text-slate-700">Review Booking Details</h1>
        
        <div className="bg-blue-100 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Train Details</h2>
          <p><strong>Train Name:</strong> {bookingDetails.trainDetails.trainName}</p>
          <p><strong>Date:</strong> {bookingDetails.selectedDate}</p>
          <p><strong>Compartment:</strong> {bookingDetails.compartment}</p>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Passenger Information</h2>
          {bookingDetails.passengers.map((passenger, index) => (
            <div key={index} className="bg-white shadow-md rounded p-4">
              <h3 className="font-semibold mb-2">Passenger {index + 1} - Seat {passenger.seatNumber}</h3>
              <div className="grid grid-cols-2 gap-4">
                <p><strong>Name:</strong> {passenger.title} {passenger.name}</p>
                <p><strong>Email:</strong> {passenger.email}</p>
                <p><strong>Gender:</strong> {passenger.gender}</p>
                <p><strong>Mobile:</strong> {passenger.mobile}</p>
                <p><strong>ID Number:</strong> {passenger.idNumber}</p>
                
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Please verify all the information above. You can go back to make changes if needed.
          </p>
          <button 
            onClick={handleBack}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Details
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReviewBooking;