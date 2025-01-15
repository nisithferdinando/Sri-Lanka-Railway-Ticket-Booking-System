
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../Utilities/axiosInstance';
import Footer from '../../Components/Footer/Footer';
import LoadingOverlay from '../../Utilities/LoadingOverlay';
import Navbars from './Navbars';
import Toast from '../../Utilities/Toast';


const SeatBookingS = () => {
    const { trainId } = useParams();
    const { search, state } = useLocation();
    const selectedTrain = state?.selectedTrain;
  
    const [train, setTrain] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedCompartment, setSelectedCompartment] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
    const params = new URLSearchParams(search);
    const dateParam = params.get('date');
    const navigate = useNavigate();
    
    const selectedDate = dateParam; 
    
    const showToast = (message, type = 'error') => {
      setToast({ show: true, message, type });
    };
  
    const hideToast = () => {
      setToast({ show: false, message: '', type: 'error' });
    };
  
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

    const handleSearchAgain = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/home-sin');
      setLoading(false);
    };
  
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
          showToast("ආසනය ලබා ගත නොහැක හෝ දැනටමත් වෙන් කර ඇත.");
      }
    } else {
       showToast("අවලංගු මැදිරිය තේරීම.");
    }
  } else {
      showToast("ඔබට ආසන 5 ක් දක්වා පමණක් තේරිය හැක.");
  }
};
  
    
  
    const handleBookSeats = async () => {
      if (selectedSeats.length === 0) {
        showToast("අවම වශයෙන් එක් ආසනයක්වත් තෝරන්න.");
        return;
      }
  
     /* try {
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
        */

      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    navigate('/contact-formS', {
      state: {
        selectedSeats,
        trainId,
        compartment: selectedCompartment,
        selectedDate,
        trainDetails: train,
        
      }
    });
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
  
  
    if (error) {
      return <p>{error}</p>;
    }
  
    return (
      <div>
        <Navbars />
        {loading && <LoadingOverlay/>}
        {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
        <div className="mt-14">
          <h1 className="text-3xl font-bold mx-auto text-center">
           දුම්රිය: {train?.trainNameS || "Loading..."}
          </h1>
          <h2 className='text-lg text-center font-sans text-blue-700 mt-4'>දිනය: {selectedDate}</h2>
          <div className="text-xl font-semibold flex gap-x-8 justify-center mt-8">
            <h2 className="text-slate-700 ">ආරම්භය: {train?.startS}</h2>
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
                  <div className="flex justify-between gap-4 mt-10">
                  <button
                    className="bg-gray-600 text-white px-5 py-2 mt-10 rounded hover:bg-gray-700 transition-colors"
                    onClick={handleSearchAgain}
                  >
                    නැවත සොයන්න
                  </button>
                  <button
                    className="bg-blue-500 text-white px-5 py-2 rounded mt-10 hover:bg-blue-600"
                    onClick={handleBookSeats}
                  >
                    ඉදිරියට
                  </button>
                  </div>
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
  