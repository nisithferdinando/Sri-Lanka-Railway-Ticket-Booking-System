import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import { Loader } from 'lucide-react';
import LoadingOverlay from '../Utilities/LoadingOverlay';

const ReviewBooking = () => {
  const location = useLocation();
  const bookingDetails = location.state;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleBack = async () => {
    // Preserve the form data in session storage when going back
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 700));
    sessionStorage.removeItem('passengerFormData');
    if (bookingDetails?.passengers) {
      sessionStorage.setItem('passengerFormData', JSON.stringify(bookingDetails.passengers));
    }
    navigate(-1);
    setLoading(false);
  };
  const handleProceedToPayment = async () => {
    setLoading(true);
    try {
      // Remove form data from session storage
      await new Promise(resolve => setTimeout(resolve, 700));
      sessionStorage.removeItem('passengerFormData');
      
      // Navigate to payment with all required booking details
      navigate('/payment', { 
        state: {
          trainDetails: bookingDetails.trainDetails,
          passengers: bookingDetails.passengers,
          compartment: bookingDetails.compartment,
          selectedDate: bookingDetails.selectedDate,
          selectedSeats: bookingDetails.selectedSeats,
          trainId: bookingDetails.trainId // Make sure trainId is included
        }
      });
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!bookingDetails || !bookingDetails.trainDetails) {
    return (
      <div>
        <Navbar />

        <div className="max-w-4xl mx-auto p-6 mt-14">
          <h1 className="text-3xl font-bold text-center mb-6">Error Loading Booking Details</h1>
          <p className="text-center">Please go back and try again.</p>
          <div className="flex justify-center mt-8">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const renderPassengerDetails = (passenger) => {
    if (passenger.type === 'primary') {
      return (
        <>
          <p className="mb-2"><span className="font-semibold">Name:</span> {passenger.title} {passenger.name}</p>
          <p className="mb-2"><span className="font-semibold">Email:</span> {passenger.email}</p>
          <p className="mb-2"><span className="font-semibold">Gender:</span> {passenger.gender}</p>
          <p className="mb-2"><span className="font-semibold">Mobile:</span> {passenger.mobile}</p>
          <p className="mb-2"><span className="font-semibold">ID Type:</span> {passenger.idType}</p>
          <p className="mb-2"><span className="font-semibold">ID Number:</span> {passenger.idNumber}</p>
        </>
      );
    } else if (passenger.isDependent) {
      return (
        <>
          <p className="mb-2"><span className="font-semibold">Name:</span> {passenger.title} {passenger.name}</p>
          <p className="mb-2"><span className="font-semibold">Gender:</span> {passenger.gender}</p>
          <p className="mb-2"><span className="font-semibold">ID Number:</span> Dependent</p>
        </>
      );
    } else {
      return (
        <>
          <p className="mb-2"><span className="font-semibold">Name:</span> {passenger.title} {passenger.name}</p>
          <p className="mb-2"><span className="font-semibold">Gender:</span> {passenger.gender}</p>
          <p className="mb-2"><span className="font-semibold">ID Type:</span> {passenger.idType}</p>
          <p className="mb-2"><span className="font-semibold">ID Number:</span> {passenger.idNumber}</p>
        </>
      );
    }
  };

  return (
    <div>
      <Navbar />
      {loading && <LoadingOverlay/>}
      <div className="max-w-4xl mx-auto p-6 mt-14">
        <h1 className="text-3xl font-bold text-center mb-6 text-slate-700">Review Booking Details</h1>

        {/* Train Details Card */}
        <div className="bg-slate-200 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Train Details</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Train Name:</span> {bookingDetails.trainDetails.trainName}</p>
            <p><span className="font-semibold">Date:</span> {bookingDetails.selectedDate}</p>
            <p><span className="font-semibold">Compartment:</span> {bookingDetails.compartment}</p>
          </div>
        </div>

        {/* Passenger Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-800 ml-4">Passenger Information</h2>
          {bookingDetails.passengers.map((passenger, index) => (
            <div key={index} className="bg-white shadow-md rounded px-6 py-4">
              <h3 className="text-lg font-semibold mb-4 text-slate-800">
                {passenger.type === 'primary' ? 'Primary' : 'Secondary'} Passenger 
                <span className="text-blue-700 bg-slate-100 px-2 py-2 rounded-lg text-base ml-3"> Seat {passenger.seatNumber}</span>
              </h3>
              {renderPassengerDetails(passenger)}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          >
            Back to Update Details
          </button>
          <button
            onClick={handleProceedToPayment} // Add your payment route
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReviewBooking;