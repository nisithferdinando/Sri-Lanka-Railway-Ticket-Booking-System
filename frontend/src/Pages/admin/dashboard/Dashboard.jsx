import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../Utilities/axiosInstance';

const Dashboard = () => {

    const [trainCount, setTrainCount]= useState(0);
    const [bookingCount, setBookingCount]=useState(0);
    const [userCount, setUserCount]=useState(0);
 
  const getTotalTrainCount= async()=>{
    try{
        const trainCount= await axiosInstance.get('/api/admin/trains/count');
        setTrainCount(trainCount.data);

        const bookingCount= await axiosInstance.get('/api/admin/bookings/count');
        setBookingCount(bookingCount.data);

        const userCount=await axiosInstance.get('/api/admin/users/count')
        setUserCount(userCount.data);
        
    }
    catch(error){
        console.log(error);
    }
  };

  useEffect(()=>{
    getTotalTrainCount();
    
  }, []);
  
  return (
    <div className="p-6 h-screen">
      <h1 className="text-2xl text-slate-700 font-semibold mb-6">Welcome to Admin Dashboard</h1>
      
      <div className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Trains Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="bg-blue-500 px-4 py-2">
              <h2 className="text-xl font-medium text-white">Trains</h2>
            </div>
            <div className="p-6 flex flex-col items-center">
              <span className="text-4xl font-bold text-slate-700">{trainCount}</span>
              <span className="text-sm text-slate-500 mt-2">Total Trains</span>
            </div>
          </div>
          
          {/* Bookings Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="bg-green-500 px-4 py-2">
              <h2 className="text-xl font-medium text-white">Bookings</h2>
            </div>
            <div className="p-6 flex flex-col items-center">
              <span className="text-4xl font-bold text-slate-700">{bookingCount}</span>
              <span className="text-sm text-slate-500 mt-2">Total Bookings</span>
            </div>
          </div>
          
          {/* Users Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="bg-purple-500 px-4 py-2">
              <h2 className="text-xl font-medium text-white">Users</h2>
            </div>
            <div className="p-6 flex flex-col items-center">
              <span className="text-4xl font-bold text-slate-700">{userCount}</span>
              <span className="text-sm text-slate-500 mt-2">Total Users</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;