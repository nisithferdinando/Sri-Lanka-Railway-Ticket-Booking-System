import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../Components/Footer/Footer';
import LoadingOverlay from '../../Utilities/LoadingOverlay';
import Navbars from './Navbars';


const ReviewBookingS = () => {
  const location = useLocation();
  const bookingDetails = location.state;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    // Preserve the form data in session storage when going back
    if (bookingDetails?.passengers) {
      sessionStorage.setItem('passengerFormData', JSON.stringify(bookingDetails.passengers));
    }
    navigate(-1);
  };

  const handleProceedToPayment = async () => {
    setLoading(true);
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    sessionStorage.removeItem('passengerFormData');
    setLoading(false);
    navigate('/paymentS', { 
      state: {
        ...bookingDetails,
        trainDetails: bookingDetails.trainDetails,
        passengers: bookingDetails.passengers,
        compartment: bookingDetails.compartment,
        selectedDate: bookingDetails.selectedDate,
      }
    });
  };

  if (!bookingDetails || !bookingDetails.trainDetails) {
    return (
      <div>
        <Navbars />

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
          <p className="mb-2"><span className="font-bold text-sm">නම:</span> {passenger.title} {passenger.name}</p>
          <p className="mb-2"><span className="font-bold text-sm">විද්‍යුත් ලිපිනය:</span> {passenger.email}</p>
          <p className="mb-2"><span className="font-bold text-sm">ස්ත්‍රී/පුරුෂ:</span> {passenger.gender}</p>
          <p className="mb-2"><span className="font-bold text-sm">දුරකථන අංකය:</span> {passenger.mobile}</p>
          <p className="mb-2"><span className="font-bold text-sm">හැඳුනුම්පත් වර්ගය:</span> {passenger.idType}</p>
          <p className="mb-2"><span className="font-bold text-sm">හැඳුනුම්පත් අංකය:</span> {passenger.idNumber}</p>
        </>
      );
    } else if (passenger.isDependent) {
      return (
        <>
          <p className="mb-2"><span className="font-semibold text-sm">නම:</span> {passenger.title} {passenger.name}</p>
          <p className="mb-2"><span className="font-semibold text-sm">ස්ත්‍රී/පුරුෂ:</span> {passenger.gender}</p>
          <p className="mb-2"><span className="font-semibold text-sm">හැඳුනුම්පත් අංකය:</span> Dependent</p>
        </>
      );
    } else {
      return (
        <>
          <p className="mb-2"><span className="font-semibold text-sm">නම:</span> {passenger.title} {passenger.name}</p>
          <p className="mb-2"><span className="font-semibold text-sm">ස්ත්‍රී/පුරුෂ:</span> {passenger.gender}</p>
          <p className="mb-2"><span className="font-semibold text-sm">හැඳුනුම්පත් වර්ග:</span> {passenger.idType}</p>
          <p className="mb-2"><span className="font-semibold text-sm">හැඳුනුම්පත් අංකය:</span> {passenger.idNumber}</p>
        </>
      );
    }
  };

  return (
    <div>
      <Navbars />
      {loading && <LoadingOverlay/>}
      <div className="max-w-4xl mx-auto p-6 mt-14">
        <h1 className="text-2xl font-semibold text-center mb-6 text-slate-700">විස්තර පරීක්ෂා කරන්න</h1>

        {/* Train Details Card */}
        <div className="bg-slate-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">දුම්රිය විස්තර</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">දුම්රිය:</span> {bookingDetails.trainDetails.trainNameS}</p>
            <p><span className="font-semibold">දිනය:</span> {bookingDetails.selectedDate}</p>
            <p><span className="font-semibold">මැදිරිය:</span> {bookingDetails.compartment}</p>
          </div>
        </div>

        {/* Passenger Information */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-slate-800 ml-4">මගී විස්තර</h2>
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
            විස්තර යාවත්කාලීන කිරීමට
          </button>
          <button
            onClick={handleProceedToPayment} // Add your payment route
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          >
           මුදල් ගෙවීම
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReviewBookingS;