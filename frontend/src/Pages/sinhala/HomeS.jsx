import React, { useEffect, useState } from 'react';
import { TbWorld } from "react-icons/tb";
import {Stationsin } from '../../Utilities/trainData';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../../Utilities/axiosInstance'
import Navbars from './Navbars';
import Footer from '../../Components/Footer/Footer';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import PersonIcon from '@mui/icons-material/Person';
import LoadingOverlay from '../../Utilities/LoadingOverlay';


const HomeS = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [startStationS, setStartStationS] = useState('');
  const [endStationS, setEndStationS] = useState('');
  const [selectedDateS, setSelectedDateS] = useState('');
  const [trainResults, setTrainResults] = useState([]);
  const [error, setError] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(true);

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);
  const handleAcccount= async()=>{

    const userName= localStorage.getItem("userName");

    if(!userName){
      navigate("/login");
      return;

    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate(`/account/${userName}`);
    setIsLoading(false);
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

    const handleSearch= async (e)=>{
      e.preventDefault();
      setError('');
      setTrainResults([]);
      setIsLoading(true);

      
      if (!startStationS || !endStationS|| !selectedDateS) {
        setError('Please fill in all fields');
        setIsLoading(false);
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (response.data.length === 0) {
        setError("No trains available for the specified route.");

      } else {
        const resultsWithId = response.data.map((train) => ({
          id: train._id || train.trainNameS + train.routeS, 
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

  const handleEditSearch = () => {
    
    setShowSearchForm(true);
    setTrainResults([]);
  };

    const handleRowClick =  async(params) => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const selectedTrain = params.row;
      console.log("Selected Train ID:", selectedTrain.id);
      navigate(`/seat-bookingS/${selectedTrain.id}?date=${selectedDateS}`, { state: { selectedTrain } });
      setIsLoading(false);
    };

    const columns = [
      
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
        <div className="flex items-center gap-2">
    
    <button
        className="text-lg font-sans text-blue-500 cursor-pointer hover:text-blue-400 flex gap-1 items-center"
        onClick={handleAcccount}
    >
      <PersonIcon fontSize="large" style={{ color: '#8000ff', marginTop:"1" }} />
        {userName}
    </button>
     </div>     
      <p
    className="flex items-center gap-2 text-lg font-sans text-red-600 cursor-pointer hover:text-red-500"onClick={handleLogout}>  <LogOut fontSize="medium" />පිටවීම
        </p>
          <div className='flex justify-center items-center gap-2 cursor-pointer'>
           <Link to='/'><TbWorld size={24} /></Link> 
            <p className='text-base text-blue-500'>සිං</p>
          </div>
        </div>
        {showSearchForm ? (
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
                <button type='submit' className='text-white px-5 py-2 text-sm bg-blue-700 rounded hover:bg-blue-600' disabled={isLoading}>
                {isLoading ? 'සොයමින්...' : 'සෙවීම'}
                </button>
                <button type='reset' className='text-white px-5 py-2 text-sm bg-slate-900 rounded hover:bg-slate-800'>
                නැවත සකසන්න
                </button>
              </div>
            </form>
          </div>
      </div>
       ) : (
           
            <div className='flex flex-col justify-center items-center w-auto mt-10'>
            <div className='bg-white drop-shadow-sm px-14 pb-8 border-[1.5px]'>
              <div className='flex justify-between items-center mt-8'>
                 <h1 className='text-2xl font-medium text-slate-800 mt-8'>සෙවීමේ ප්‍රතිඵල</h1>
                 <button 
                  onClick={handleEditSearch}
                  className='text-white px-4 py-2 text-base bg-blue-700 rounded hover:bg-blue-600'
                >
                  සෙවීම සංස්කරණය කරන්න
                </button>
                </div>
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
      <div className='mt-36'>
      <Footer/>
      </div>
    </div>
  );
};

export default HomeS;
