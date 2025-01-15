import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import { Loader } from 'lucide-react';
import LoadingOverlay from '../Utilities/LoadingOverlay';

const PassengerForm = () => {
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
  const handleHomeClick = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    sessionStorage.removeItem('passengerFormData');
    navigate('/');
    setLoading(false);
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
          passengerErrors.email = 'Valid email is required';
        }
        if (!passenger.mobile || !passenger.mobile.match(/^\d{10}$/)) {
          passengerErrors.mobile = 'Mobile number must be 10 digits';
        }
        if (passenger.idType === 'ID' && 
          (!passenger.idNumber || 
          !((passenger.idNumber.length === 10 && passenger.idNumber.endsWith('V')) || passenger.idNumber.length === 12))) {
        passengerErrors.idNumber = 'ID must be 10 characters ending with V or 12 numerical characters';
      }
      if (passenger.idType === 'passport' && 
        (!passenger.idNumber || 
        !((passenger.idNumber.length === 9 )))) {
      passengerErrors.idNumber = 'Passport must be 9 digits';
    }
      } 
      if (passenger.idType === 'passport' && 
        (!passenger.idNumber || 
        !((passenger.idNumber.length === 9 )))) {
      passengerErrors.idNumber = 'Passport must be 9 digits';
    }

      if (!passenger.isDependent && passenger.idType === 'ID' && 
        (!passenger.idNumber || 
          !((passenger.idNumber.length === 10 && passenger.idNumber.endsWith('V')) || passenger.idNumber.length === 12))) {
        passengerErrors.idNumber = 'ID must be 10 characters ending with V or 12 numerical characters';
      }
        

      if (!passenger.name.trim()) {
        passengerErrors.name = 'Name is required';
      }
      if (!passenger.gender) {
        passengerErrors.gender = 'Gender is required';
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
        trainDetails
      };
      setLoading(false);
      navigate('/review-booking', { state: bookingDetails });
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
        <h1 className="text-3xl font-bold text-center mb-6 text-slate-700">Passenger Details</h1>
        <div className="mb-4 flex flex-col justify-center items-center bg-slate-200 rounded-lg p-4 text-slate-800">
          <div className="font-semibold flex justify-center">
            Train: <span className="font-normal ml-1">{trainDetails?.trainName}</span>
          </div>
          <div className="font-semibold flex justify-center">
            Date: <span className="font-normal ml-1">{selectedDate}</span>
          </div>
          <div className="font-semibold flex justify-center">
            Compartment: <span className="font-normal ml-1">{compartment}</span>
          </div>
        </div>

        {passengers.map((passenger, index) => (
          <div key={index} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 ">
              {passenger.type === 'primary' ? 'Primary' : 'Secondary'} Passenger - 
              <span className='text-blue-700 px-2 py-2 rounded-lg text-base ml-3 bg-slate-100 '> Seat {passenger.seatNumber}</span>
            </h2>
            
            <div className="flex gap-4 mb-4">
              <div className="w-1/4">
                <label className="block text-gray-700 text-base font-bold mb-2">
                  Title*
                </label>
                <select
                  value={passenger.title}
                  onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Miss">Miss</option>
                </select>
              </div>
              <div className="w-3/4">
                <label className="block text-gray-700 text-base font-bold mb-2">
                  Full Name*
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

            <div className="mb-4">
              <label className="block text-gray-700 text-base font-bold mb-2">
                Gender*
              </label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="male"
                    checked={passenger.gender === 'male'}
                    onChange={(e) => handleInputChange(index, 'gender', e.target.value)}
                    className="form-radio"
                  />
                  <span className="ml-2">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="female"
                    checked={passenger.gender === 'female'}
                    onChange={(e) => handleInputChange(index, 'gender', e.target.value)}
                    className="form-radio"
                  />
                  <span className="ml-2">Female</span>
                </label>
              </div>
              {formErrors[index]?.gender && (
                <p className="text-red-500 text-xs mt-2 italic">{formErrors[index].gender}</p>
              )}
            </div>

            {passenger.type === 'primary' && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-base font-bold mb-2">
                    Email*
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
                  <label className="block text-gray-700 text-base font-bold mb-2">
                    Mobile Number*
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
              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={passenger.isDependent}
                    onChange={(e) => handleInputChange(index, 'isDependent', e.target.checked)}
                    className="form-checkbox"
                  />
                  <span className="ml-2">Below 18 years (Dependent)</span>
                </label>
              </div>
            )}

            {(!passenger.isDependent || passenger.type === 'primary') && (
              <div className="flex gap-4 mb-4">
                <div className="w-1/3">
                  <label className="block text-gray-700 text-base font-bold mb-2">
                    ID Type*
                  </label>
                  <select
                    value={passenger.idType}
                    onChange={(e) => handleInputChange(index, 'idType', e.target.value)}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    disabled={passenger.isDependent}
                  >
                    <option value="ID">ID</option>
                    <option value="passport">Passport</option>
                  </select>
                </div>
                <div className="w-2/3">
                  <label className="block text-gray-700 text-base font-bold mb-2">
                    ID Number*
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
            Home
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Review Booking
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PassengerForm;