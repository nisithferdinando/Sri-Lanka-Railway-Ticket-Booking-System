import { Loader } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import LoadingOverlay from '../../Utilities/LoadingOverlay';


const Footer = ({showAdminPortal}) => {

  const [loading, setLoading]=useState("");
const navigate=useNavigate();

const handleAdminNavigate= async()=>{
  setLoading(true);
  await new Promise(resolve => setTimeout(resolve, 700));
  navigate('/adminPortalLogin')
  setLoading(false);
}
  return (
    <div>
      {loading && <LoadingOverlay/>}
        <div className='w-full'>
            <div className='bg-Secondary w-full p-7'>
                <p className='text-white italic text-sm text-center'>@Copyright All Right Reserved</p>
                {
                  showAdminPortal &&(
                    <div className='flex justify-end '>
                      <button className='text-white text-base font-sans bg-green-500 px-3 py-2 rounded-lg w-64 hover:bg-green-400'
                      onClick={handleAdminNavigate}
                      >
                        Admin Portal
                      </button>
                    </div>
                  )
                }

            </div>

        </div>
    </div>
  )
}

export default Footer