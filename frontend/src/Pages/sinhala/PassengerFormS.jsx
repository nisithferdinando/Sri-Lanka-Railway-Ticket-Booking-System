import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingOverlay from '../../Utilities/LoadingOverlay';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';

const PassengerFormS = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { selectedSeats, trainId, compartment, selectedDate, trainDetails } = location.state;
  
  const loadFormData = () => {
    const savedData = sessionStorage.getItem('passengerFormData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return initialFormData();
  };
  
  const saveFormData = (data) => {
    sessionStorage.setItem('passengerFormData', JSON.stringify(data));
  };

  const initialFormData = () => {
    const initialPrimary = {
      type: 'primary',
      seatNumber: selectedSeats[0],
      title: 'Mr',
      name: '',
      email: '',
      gender: '',
      idType: 'ID',
      idNumber: '',
      mobile: '',
      errors: {}
    };

    const initialSecondary = selectedSeats.slice(1).map(seatNumber => ({
      type: 'secondary',
      seatNumber,
      title: 'Mr',
      name: '',
      gender: '',
      idType: 'ID',
      idNumber: '',
      isDependent: false,
      errors: {}
    }));

    return [initialPrimary, ...initialSecondary];
  };

  const [passengers, setPassengers] = useState(loadFormData);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const errors = {};
    
    passengers.forEach((passenger, index) => {
      const passengerErrors = {};
      
      if (passenger.type === 'primary') {
        if (!passenger.email || !passenger.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          passengerErrors.email = 'විද්‍යුත් ලිපිනය අවශ්‍යයි';
        }
        if (!passenger.mobile || !passenger.mobile.match(/^\d{10}$/)) {
          passengerErrors.mobile = 'දුරකථන අංකය 10 අංකයින් යුතුයි';
        }
        if (passenger.idType === 'ID' && 
          (!passenger.idNumber || 
          !((passenger.idNumber.length === 10 && passenger.idNumber.endsWith('V')) || passenger.idNumber.length === 12))) {
        passengerErrors.idNumber = 'හැඳුනුම්පත V කින් අවසන් වන අක්ෂර 10 ක් හෝ සංඛ්‍යාත්මක අක්ෂර 12 ක් විය යුතුය.';
      }
      
      } /* else if (!passenger.isDependent && passenger.idType === 'ID' && 
                 (!passenger.idNumber || !passenger.idNumber.match(/^.{9}V$/))) {
        passengerErrors.idNumber = 'ID must be 9 characters ending with V';
      }
        */

      if (!passenger.name.trim()) {
        passengerErrors.name = 'නම අවශ්‍යයි';
      }
      if (!passenger.gender) {
        passengerErrors.gender = 'ස්ත්‍රී/පුරුෂ අවශ්‍යයි';
      }

      if (Object.keys(passengerErrors).length > 0) {
        errors[index] = passengerErrors;
        isValid = false;
      }
    });

    if (isSubmitting) {
      setFormErrors(errors);
    }
    return isValid;
  };

  const handleInputChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };

    if (field === 'isDependent' && value === true) {
      updatedPassengers[index].idType = 'dependent';
      updatedPassengers[index].idNumber = '';
    }

    setPassengers(updatedPassengers);
    saveFormData(updatedPassengers);
  };

  const handleHomeClick= async()=>{
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/home-sin');
    setLoading(false);
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (validateForm()) {
      setLoading(true);
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      const bookingDetails = {
        passengers,
        trainId,
        compartment,
        selectedDate,
        trainDetails,
        selectedSeats,
      };
      setLoading(false);
      navigate('/review-bookingS', { state: bookingDetails });
    }
  };

  useEffect(() => {
    return () => {
      const currentPath = window.location.pathname;
      if (currentPath !== '/review-booking') {
        sessionStorage.removeItem('passengerFormData');
      }
    };
  }, []);

  return (
    <div>
      <Navbar />
      {loading && <LoadingOverlay/>}

      <div className="max-w-4xl mx-auto p-6 mt-14">
        <h1 className="text-2xl font-bold text-center mb-6 text-slate-700">මගී විස්තර</h1>
        <div className="mb-4 flex flex-col justify-center items-center bg-slate-200 rounded-lg p-4 text-slate-800">
          <div className="font-semibold flex justify-center">
          දුම්රිය: <span className="font-normal ml-1">{trainDetails?.trainName}</span>
          </div>
          <div className="font-semibold flex justify-center">
          දිනය: <span className="font-normal ml-1">{selectedDate}</span>
          </div>
          <div className="font-semibold flex justify-center">
          මැදිරිය: <span className="font-normal ml-1">{compartment}</span>
          </div>
        </div>

        {passengers.map((passenger, index) => (
          <div key={index} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 ">
              {passenger.type === 'primary' ? 'Primary' : 'Secondary'} Passenger - 
              <span className='text-blue-700 px-2 py-2 rounded-lg text-base ml-3 bg-slate-100'> Seat {passenger.seatNumber}</span>
            </h2>
            
            <div className="flex gap-4 mb-4">
              <div className="w-1/4">
                <label className="block text-gray-700 text-base font-bold mb-1">
                  Title*
                </label>
                <select
                  value={passenger.title}
                  onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="Mr">මහතා</option>
                  <option value="Mrs">මහත්මිය</option>
                  <option value="Miss">මෙණෙවිය</option>
                </select>
              </div>
              <div className="w-3/4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                සම්පූර්ණ නම*
                </label>
                <input
                  type="text"
                  value={passenger.name}
                  onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-blue-400"
                />
                {formErrors[index]?.name && (
                  <p className="text-red-500 text-xs mt-2 italic">{formErrors[index].name}</p>
                )}
              </div>
            </div>

            <div className="mb-4 mt-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
              ස්ත්‍රී/පුරුෂ*
              </label>
              <div className="flex gap-4 mt-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="පුරුෂ"
                    checked={passenger.gender === 'පුරුෂ'}
                    onChange={(e) => handleInputChange(index, 'gender', e.target.value)}
                    className="form-radio"
                  />
                  <span className="ml-2">පුරුෂ</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="ස්ත්‍රී"
                    checked={passenger.gender === 'ස්ත්‍රී'}
                    onChange={(e) => handleInputChange(index, 'gender', e.target.value)}
                    className="form-radio"
                  />
                  <span className="ml-2">ස්ත්‍රී</span>
                </label>
              </div>
              {formErrors[index]?.gender && (
                <p className="text-red-500 text-xs mt-2 italic">{formErrors[index].gender}</p>
              )}
            </div>

            {passenger.type === 'primary' && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                  විද්‍යුත් ලිපිනය*
                  </label>
                  <input
                    type="email"
                    value={passenger.email}
                    onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-blue-400"
                  />
                  {formErrors[index]?.email && (
                    <p className="text-red-500 text-xs mt-2 italic">{formErrors[index].email}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                  දුරකථන අංකය*
                  </label>
                  <input
                    type="tel"
                    value={passenger.mobile}
                    onChange={(e) => handleInputChange(index, 'mobile', e.target.value)}
                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-blue-400"
                  />
                  {formErrors[index]?.mobile && (
                    <p className="text-red-500 text-xs mt-2 italic">{formErrors[index].mobile}</p>
                  )}
                </div>
              </>
            )}

            {passenger.type === 'secondary' && (
              <div className="mb-4 mt-5">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={passenger.isDependent}
                    onChange={(e) => handleInputChange(index, 'isDependent', e.target.checked)}
                    className="form-checkbox"
                  />
                  <span className="ml-2 font-bold ">වසර 18 අඩු (Dependent)</span>
                </label>
              </div>
            )}

            {(!passenger.isDependent || passenger.type === 'primary') && (
              <div className="flex gap-4 mb-4">
                <div className="w-1/3">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                  හැඳුනුම්පත් වර්ගය*
                  </label>
                  <select
                    value={passenger.idType}
                    onChange={(e) => handleInputChange(index, 'idType', e.target.value)}
                    className="shadow border rounded w-full py-2 text-sm px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    disabled={passenger.isDependent}
                  >
                    <option value="ID">හැඳුනුම්පත</option>
                    <option value="passport">පාස්පෝට්</option>
                  </select>
                </div>
                <div className="w-2/3">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                  හැඳුනුම්පත් අංකය*
                  </label>
                  <input
                    type="text"
                    value={passenger.idNumber}
                    onChange={(e) => handleInputChange(index, 'idNumber', e.target.value)}
                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-blue-400"
                    disabled={passenger.isDependent}
                  />
                  {formErrors[index]?.idNumber && (
                    <p className="text-red-500 text-xs mt-2 italic">{formErrors[index].idNumber}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-between mt-6">
        <button
            onClick={handleHomeClick}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            මුල් පිටුව
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            විස්තර පරීක්ෂා කරන්න
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PassengerFormS;