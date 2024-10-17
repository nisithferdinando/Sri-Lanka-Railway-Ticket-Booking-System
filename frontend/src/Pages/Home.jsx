import React, { useEffect } from 'react';
import { TbWorld } from "react-icons/tb";
import { Station } from '../Utilities/trainData';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');

    navigate('/login');
  };

  return (
    <div>
      <div className='w-full'>
        <div className='flex justify-end mt-4 mr-24 gap-4 items-center'>
          <p className='text-lg font-sans text-blue-500 underline cursor-pointer hover:text-blue-400'>Account</p>
          <p className='text-lg font-sans text-blue-500 cursor-pointer' onClick={handleLogout}>Logout</p>
          <div className='flex justify-center items-center gap-2 cursor-pointer'>
            <TbWorld size={24} />
            <p className='text-base text-blue-500'>Sin</p>
          </div>
        </div>
        <div className='flex items-center justify-center mt-20'>
          <div className='w-[650px] border-[1px] bg-white drop-shadow-md px-5 py-10'>
            <form>
              <p className='text-center text-xl font-semibold text-slate-800'>Search Train</p>
              <div className='grid grid-cols-2 mt-10 pl-4'>
                <div className='flex flex-col py-2'>
                  <p className='text-slate-900 text-lg'>Start</p>
                  <select className='w-64 mt-4 input-box'>
                    {Station.map((station) => (
                      <option key={station} value={station}>
                        {station}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='flex flex-col py-2'>
                  <p className='text-slate-900 text-lg'>End</p>
                  <select className='w-64 mt-4 input-box'>
                    {Station.map((station) => (
                      <option key={station} value={station}>
                        {station}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='flex flex-col py-2'>
                  <p className='text-slate-900 text-lg '>Date</p>
                  <input type='date' className='input-box w-64 mt-4' />
                </div>
              </div>
              <div className='flex flex-row ml-4 gap-x-7 mt-8'>
                <button type='submit' className='text-white px-5 py-1 text-base bg-blue-700 rounded hover:bg-blue-600'>
                  Submit
                </button>
                <button type='reset' className='text-white px-5 py-1 text-base bg-slate-900 rounded hover:bg-slate-800'>
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
