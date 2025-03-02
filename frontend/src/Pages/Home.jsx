import React, { useEffect, useState } from 'react';
import { TbWorld } from "react-icons/tb";
import { Station } from '../Utilities/trainData';
import { Link, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../Utilities/axiosInstance';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import Toast from '../Utilities/Toast';
import LoadingOverlay from '../Utilities/LoadingOverlay';
import { CircleUserRound, LogOut } from 'lucide-react';
import { AccountCircle, Logout } from '@mui/icons-material'; // Import the AccountCircle icon
import PersonIcon from '@mui/icons-material/Person';

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [startStation, setStartStation] = useState('');
  const [endStation, setEndStation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [trainResults, setTrainResults] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(true);
  const [showToast, setShowToast] = useState(false);
  
  
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
      const params = new URLSearchParams(window.location.search);
      if (params.get('login') === 'success') {
        setShowToast(true);
        
        navigate('/', { replace: true });
      }
    }
  }, [navigate]);

  const handleCloseToast = () => {
    setShowToast(false);
  };


  const handleLogout = async () => {
    setIsLoading(true);
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/login');
    setIsLoading(false);

  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setTrainResults([]);
    setIsLoading(true);

    if (!startStation || !endStation || !selectedDate) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const currentDate = new Date();
    const selectedDateObj = new Date(selectedDate);
    if (selectedDateObj <=currentDate) {
      setError('Please select a future date');
      setIsLoading(false);
      return;
    }
    const maxBookingDate = new Date(currentDate);
  maxBookingDate.setDate(currentDate.getDate() + 5);

  if (selectedDateObj > maxBookingDate) {
    setError('Booking is only allowed up to 5 days from today');
    setIsLoading(false);
    return;
  }

    try {
      const response = await axiosInstance.post("/api/trains/search", {
        startStation,
        endStation,
        selectedDate,
      });
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (response.data.length === 0) {
        setError("No trains available for the specified route.");
      } else {
        const resultsWithId = response.data.map((train) => ({
          id: train._id || train.trainName + train.route,
          ...train,
        }));
        setTrainResults(resultsWithId);
        setShowSearchForm(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching trains, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcccount = async () => {
    const userName = localStorage.getItem('userName'); 
    
    if (!userName) {
      navigate('/login');
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    navigate(`/account/${userName}`);
    setIsLoading(false);
  };
  

  const handleEditSearch = () => {
    setShowSearchForm(true);
    setTrainResults([]);
  };

  const handleRowClick =  async(params) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const selectedTrain = params.row;
    navigate(`/seat-booking/${selectedTrain.id}?date=${selectedDate}`, { state: { selectedTrain } });
    setIsLoading(false);
  };

  const columns = [
    { field: 'trainName', headerName: 'Train Name', width: 200 },
    { field: 'start', headerName: 'Start', width: 150 },
    { field: 'departs', headerName: 'Departs', width: 150 },
    { field: 'arrives', headerName: 'Arrives', width: 150 },
  ];  

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      
      {showToast && (
        <Toast
          message={`Welcome back, ${userName}!`}
          type="success"
          onClose={handleCloseToast}
          
        />
        
      )}
      <div className='w-full flex-grow'>
        <div className='flex justify-end mt-4 mr-24 gap-4 items-center'>
        <div className="flex items-center gap-2">
    
    <button
        className="text-lg font-sans bg-slate-100 px-3 py-1 rounded-lg text-blue-500 cursor-pointer hover:text-blue-400 flex gap-1 items-center"
        onClick={handleAcccount}
    >
      <PersonIcon fontSize="large" style={{ color: '#8000ff', marginTop:"1" }} />
        {userName}
    </button>
     </div>     
      <p
    className="flex items-center gap-2 text-lg font-sans text-red-600 cursor-pointer hover:text-red-500"onClick={handleLogout}>  <Logout fontSize="medium" />    Logout
        </p>
          <div className='flex justify-center items-center gap-2 cursor-pointer'>
            <Link to='/home-sin'><TbWorld size={24} /></Link>
            <p className='text-base text-blue-500'>En</p>
          </div>
        </div>
        
        {showSearchForm ? (
          <div className='flex items-center justify-center mt-12 flex-col'>
            <div className='md:w-[650px] border-[1px] bg-white drop-shadow-md px-5 py-11'>
              <form onSubmit={handleSearch}>
                <p className='text-center text-2xl font-sans text-slate-800'>Search Train</p>
                <div className='grid md:grid-cols-2 mt-10 pl-4 xs:grid-cols-1 justify-center'>
                  <div className='flex flex-col py-2'>
                    <p className='text-slate-900 text-lg'>Start</p>
                    <select className='w-64 mt-4 input-box' value={startStation} onChange={(e) => setStartStation(e.target.value)}>
                      <option value="" disabled>Select Start Station</option>
                      {Station.map((station) => (
                        <option key={station} value={station}>
                          {station}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='flex flex-col py-2'>
                    <p className='text-slate-900 text-lg'>End</p>
                    <select className='w-64 mt-4 input-box' value={endStation} onChange={(e) => setEndStation(e.target.value)}>
                      <option value="" disabled>Select End Station</option>
                      {Station.map((station) => (
                        <option key={station} value={station}>
                          {station}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='flex flex-col py-2'>
                    <p className='text-slate-900 text-lg'>Date</p>
                    <input type='date' className='input-box w-64 mt-4' value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                  </div>
                </div>
                {error && <p className='text-red-600 text-center mt-2'>{error}</p>}
                <div className='flex flex-row ml-4 gap-x-7 mt-8 justify-center md:justify-start'>
                  <button type='submit' className='text-white px-5 py-1 text-base bg-blue-700 rounded hover:bg-blue-600' disabled={isLoading}>
                    {isLoading ? 'Searching...' : 'Search'}
                  </button>
                  <button type='reset' className='text-white px-5 py-1 text-base bg-slate-900 rounded hover:bg-slate-800'>Reset</button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className='flex flex-col justify-center items-center w-auto mt-10'>
            <div className='bg-white drop-shadow-sm px-14 pb-8 border-[1.5px]'>
              <div className='flex justify-between items-center mt-8'>
                <h1 className='text-3xl font-medium text-slate-800'>Search Results</h1>
                <button 
                  onClick={handleEditSearch}
                  className='text-white px-4 py-2 text-base bg-blue-700 rounded hover:bg-blue-600'
                >
                  Edit Search
                </button>
              </div>
              <div className='grid grid-cols-2 mt-8 gap-x-4'>
                <p className='text-2xl text-slate-950 font-semibold'>Start: <span className='font-medium'>{startStation}</span></p>
                <p className='text-2xl text-slate-950 font-semibold'>End: <span className='font-medium'>{endStation}</span></p>
                <p className='text-base font-medium text-slate-700 mt-4'>Date {selectedDate}</p>
              </div>
              <DataGrid
                rows={trainResults}
                columns={columns.map((column) => ({ ...column, sortable: false }))}
                pageSize={5}
                rowsPerPageOptions={[5]}
                className='mt-8'
                hideFooter={true}
                disableSelectionOnClick={false}
                onRowClick={handleRowClick}
                sx={{
                  '& .MuiDataGrid-columnHeaders': {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  },
                  '& .MuiDataGrid-cell': {
                    cursor: 'pointer',
                  },
                }}
              />
            </div>
          </div>
        )}

        {isLoading && <LoadingOverlay/>}
      </div>
      
        <Footer />
      
    </div>
  );
};

export default Home;