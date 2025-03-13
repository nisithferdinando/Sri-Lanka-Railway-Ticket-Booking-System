import React, { useState } from 'react'
import axiosInstance from '../../Utilities/axiosInstance';
import { useNavigate } from 'react-router';
import LoadingOverlay from '../../Utilities/LoadingOverlay';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';

const AdminLogin = () => {

 const [adminCode, setAdminCode] = useState("");
 const [password, setPassword]= useState("");
 const [loading, setLoading]= useState();
 const navigate=useNavigate();
 const [error, setError]=useState(null);

 const handleAdminLogin= async(e)=>{
  e.preventDefault();
  setLoading(true);
  
  try{
    const response= await axiosInstance.post("/api/adminAuth/adminLogin",{
      adminCode,
      password,
    });

    
    await new Promise(resolve => setTimeout(resolve, 400));
    setLoading(false);

    localStorage.setItem('adminToken', response.data.token);
    navigate('/adminDashboard');
    
  }
  catch(error){
    setLoading(false);
    if(error.response && error.response.status===404){
      setError(error.response.data.message);
    }
    else{
      setError(error.response?.data?.message || "Login failed. Please try again.");
    }
  }

 };

 const handleHome= async()=>{
  setLoading(true);
  await new Promise(resolve => setTimeout(resolve, 400));
  navigate('/landing');
  setLoading(false);
};


  return (
    <div className='bg-gray-100'>
      <Navbar showAdminPortalNavbar={true} />
       {loading && <LoadingOverlay/>}
       <div className='flex justify-end'>
          <button className='bg-slate-800 px-4 py-2 text-base text-slate-100 mt-8 mr-8 rounded-lg'
          onClick={handleHome}
          >Home</button>
        </div>
      <div className="flex justify-center items-center h-[700px]">
      <div className="bg-white p-12 shadow-md rounded-lg w-96">
        <div className="text-2xl font-bold text-center mt-4 mb-8">Admin Portal</div>
        <form onSubmit={handleAdminLogin}>
          <div className="mb-4">
            <div className="text-gray-700 mt-4">Admin Code</div>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mt-4"
             value={adminCode}
             onChange={(e) => setAdminCode(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <div className="text-gray-700">Password</div>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded mt-4"
              value={password}
             onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <div className="text-center">
            <button
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500 mt-4"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
    <Footer/>
    </div>
  )
}

export default AdminLogin;