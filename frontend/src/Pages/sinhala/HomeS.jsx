import React, { useEffect, useState } from 'react';
import { TbWorld } from "react-icons/tb";
import {Stationsin } from '../../Utilities/trainData';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../../Utilities/axiosInstance'
import Navbars from './Navbars';
import Footer from '../../Components/Footer/Footer';
import { Link } from 'react-router-dom';

const HomeS = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [startStationS, setStartStationS] = useState('');
  const [endStationS, setEndStationS] = useState('');
  const [selectedDateS, setSelectedDateS] = useState('');
  const [trainResults, setTrainResults] = useState([]);
  const [error, setError] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
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

    const handleSearch= async (e)=>{
      e.preventDefault();
      setError('');
    setTrainResults([]);

      
      if (!startStationS || !endStationS|| !selectedDateS) {
        setError('Please fill in all fields');
        return;
      }

      const currentDate = new Date();
    const selectedDateObj = new Date(selectedDateS);
    if (selectedDateObj < currentDate.setHours(0, 0, 0, 0)) {
      setError('Please select a future date');
      return;
    }

    try {

      const response = await axiosInstance.post("/api/trains/searchS", {
        startStationS,
        endStationS,
        selectedDateS,
      });

      if (response.data.length === 0) {
        setError("No trains available for the specified route.");

      } else {
        const resultsWithId = response.data.map((train) => ({
          id: train._id || train.trainNameS + train.routeS, 
          ...train,

      }));

      setTrainResults(resultsWithId);
      }

    } catch (error) {
        if (error.response && error.response.data) {
            setError(error.response.data.message || "Error fetching trains, please try again.");
        } else {
            setError("Error fetching trains, please try again.");
        }
      }

    };

    const columns = [
      //{ field: 'id', headerName: 'ID', width: 90 },
      { field: 'trainNameS', headerName: 'දුම්රිය', width: 200 },
       { field: 'startS', headerName: 'ආරම්භය', width: 150 },

     {field:'departs', headerName:"පිටවීම", width:150},

     {field:'arrives', headerName:"පැමිණීම", width:150},
      
    ];

  return (
    
    <div>
          
      <Navbars/>
      <div className='w-full'>
        <div className='flex justify-end mt-4 mr-24 gap-4 items-center'>
          <p className='text-lg font-sans text-blue-500 underline cursor-pointer hover:text-blue-400'>{userName}</p>
          <p className='text-lg font-sans text-blue-500 cursor-pointer' onClick={handleLogout}>Logout</p>
          <div className='flex justify-center items-center gap-2 cursor-pointer'>
           <Link to='/'><TbWorld size={24} /></Link> 
            <p className='text-base text-blue-500'>Sin</p>
          </div>
        </div>
        <div className='flex items-center justify-center mt-12 flex-col'>
          <div className='md:w-[650px] border-[1px] bg-white drop-shadow-md px-5 py-11'>
            <form onSubmit={handleSearch}>
              <p className='text-center text-xl font-semibold text-slate-800'> දුම්රිය සෙවීම</p>
              <div className='grid md:grid-cols-2 mt-10 pl-4 xs:grid-cols-1 justify-center'>
                <div className='flex flex-col py-2'>
                  <p className='text-black text-lg font-medium'>ආරම්භය</p>
                  <select className='w-64 mt-4 input-box' value={startStationS} onChange={(e) => setStartStationS(e.target.value)}>
                  <option value="" disabled>ආරම්භ ස්ථානය තෝරන්න</option>
                    {Stationsin.map((station) => (
                      <option key={station} value={station}>
                        {station}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='flex flex-col py-2'>
                  <p className='text-black text-lg'>ගමනාන්තය</p>
                  <select className='w-64 mt-4 input-box' value={endStationS} onChange={(e)=>setEndStationS(e.target.value)}>
                  <option value="" disabled>ගමනාන්තය තෝරන්න</option>
                    {Stationsin.map((station) => (
                      <option key={station} value={station}>
                        {station}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='flex flex-col py-2'>
                  <p className='text-slate-900 text-lg '>දිනය</p>
                  <input type='date'
                   className='input-box w-64 mt-4'
                   value={selectedDateS}
                    onChange={(e) => setSelectedDateS(e.target.value)}
                   />
                </div>
              </div>
              {error && <p className='text-red-600 text-center mt-2'>{error}</p>}
              <div className='flex flex-row ml-4 gap-x-7 mt-8 justify-center md:justify-start'>
                <button type='submit' className='text-white px-5 py-2 text-sm bg-blue-700 rounded hover:bg-blue-600'>
                සොයන්න
                </button>
                <button type='reset' className='text-white px-5 py-2 text-sm bg-slate-900 rounded hover:bg-slate-800'>
                නැවත සකසන්න
                </button>
              </div>
            </form>
          </div>
      </div>
           {trainResults.length > 0 && (
           
              <div className='flex flex-col justify-center items-center w-auto mt-10'>
                <div className='bg-white drop-shadow-sm px-14 pb-8 border-[1.5px]'>
                 <h1 className='text-2xl font-medium text-slate-800 mt-8'>සෙවීමේ ප්‍රතිඵල</h1>
                 <div className='grid grid-cols-2 mt-8 gap-x-4'>
                  <p className='text-xl text-slate-950 font-semibold '>ආරම්භය: <span className=' font-medium'> {startStationS}</span> </p>
                  <p className='text-xl text-slate-950 font-semibold'>අවසානය: <span className='font-medium'>{endStationS}</span></p>
                  <p className='text-sm font-medium text-slate-700 mt-4'>දිනය {selectedDateS}</p>
                  </div>
                  
                <DataGrid
                   rows={trainResults}
                   columns={columns.map((column) => ({ ...column, sortable: false }))}
                   pageSize={5}
                   rowsPerPageOptions={[5]}
                   className='mt-8'
                   hideFooter={true}
                   disableSelectionOnClick={false} 
                   onRowClick={(params) => {
                     setSelectedRow(params.row); 
                   }}
                   selectionModel={[selectedRow?.id]} 
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
      <Footer/>
      </div>
     </div>
     
   
  );
};

export default HomeS;
