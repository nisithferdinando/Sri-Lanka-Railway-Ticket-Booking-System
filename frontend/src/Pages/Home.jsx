import React, { useEffect, useState } from 'react';
import { TbWorld } from "react-icons/tb";
import { Station } from '../Utilities/trainData';
import { Link, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../Utilities/axiosInstance';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [startStation, setStartStation] = useState('');
  const [endStation, setEndStation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [trainResults, setTrainResults] = useState([]);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setTrainResults([]);

    if (!startStation || !endStation || !selectedDate) {
      setError('Please fill in all fields');
      return;
    }

    const currentDate = new Date();
    const selectedDateObj = new Date(selectedDate);
    if (selectedDateObj < currentDate.setHours(0, 0, 0, 0)) {
      setError('Please select a future date');
      return;
    }

    try {
      const response = await axiosInstance.post("/api/trains/search", {
        startStation,
        endStation,
        selectedDate,
      });

      if (response.data.length === 0) {
        setError("No trains available for the specified route.");
      } else {
        const resultsWithId = response.data.map((train) => ({
          id: train._id || train.trainName + train.route,
          ...train,
        }));
        setTrainResults(resultsWithId);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching trains, please try again.");
    }
  };

  const handleRowClick = (params) => {
    const selectedTrain = params.row;
    console.log("Selected Train ID:", selectedTrain.id); // Use `id` instead of `_id`
    navigate(`/seat-booking/${selectedTrain.id}`, { state: { selectedTrain } });
  };

  const columns = [
    { field: 'trainName', headerName: 'Train Name', width: 200 },
    { field: 'start', headerName: 'Start', width: 150 },
    { field: 'departs', headerName: 'Departs', width: 150 },
    { field: 'arrives', headerName: 'Arrives', width: 150 },
  ];

  return (
    <div>
      <Navbar />
      <div className='w-full'>
        <div className='flex justify-end mt-4 mr-24 gap-4 items-center'>
          <p className='text-lg font-sans text-blue-500 underline cursor-pointer hover:text-blue-400'>{userName}</p>
          <p className='text-lg font-sans text-blue-500 cursor-pointer' onClick={handleLogout}>Logout</p>
          <div className='flex justify-center items-center gap-2 cursor-pointer'>
            <Link to='/home-sin'><TbWorld size={24} /></Link>
            <p className='text-base text-blue-500'>En</p>
          </div>
        </div>
        <div className='flex items-center justify-center mt-12 flex-col'>
          <div className='md:w-[650px] border-[1px] bg-white drop-shadow-md px-5 py-11'>
            <form onSubmit={handleSearch}>
              <p className='text-center text-xl font-semibold text-slate-800'>Search Train</p>
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
                <button type='submit' className='text-white px-5 py-1 text-base bg-blue-700 rounded hover:bg-blue-600'>Search</button>
                <button type='reset' className='text-white px-5 py-1 text-base bg-slate-900 rounded hover:bg-slate-800'>Reset</button>
              </div>
            </form>
          </div>
        </div>
        {trainResults.length > 0 && (
          <div className='flex flex-col justify-center items-center w-auto mt-10'>
            <div className='bg-white drop-shadow-sm px-14 pb-8 border-[1.5px]'>
              <h1 className='text-3xl font-medium text-slate-800 mt-8'>Search Results</h1>
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
      </div>
      <div className='mt-36'>
        <Footer />
      </div>
    </div>
  );
};

export default Home;