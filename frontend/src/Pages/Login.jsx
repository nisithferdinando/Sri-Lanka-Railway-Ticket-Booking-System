import React, { useState } from 'react'
import PasswordInput from '../Components/Input/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../Utilities/Helper';
import axiosInstance from '../Utilities/axiosInstance'
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import LoadingOverlay from '../Utilities/LoadingOverlay';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
   
  const handleLogin = async(e) => {
    e.preventDefault();

    if(!validateEmail(email)){
      setError("Please enter your email");
      return;
    }
    
    if(!password){
      setError("Please enter the password");
      return;
    }

    setError("");
    setLoading(true); 
    

    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });
      
      localStorage.setItem("userName", `${response.data.firstName}`);
      localStorage.setItem("token", response.data.token);
      
      
      await new Promise(resolve => setTimeout(resolve, 400));
      setLoading(false); 
      navigate('/?login=success');
    } catch(error) {
      setLoading(false); 
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError(error.response?.data?.message || "Login failed. Please try again.");
      }
    }
  };

  return (
    <div>
      <Navbar/>
      {loading && <LoadingOverlay/>}
      
      <div className='flex justify-center items-center'>
        <div className='bg-white border-[1.5px] drop-shadow-md rounded-lg px-16 py-16 mt-24 outline-none'>
          <form onSubmit={handleLogin}>
            <div className='mt-4'>
              <p className='text-xl font-medium text-gray-500 mb-4'>Email</p>
              <input
                type='email'
                placeholder="Enter your email"
                className='input-box'
                value={email}
                onChange={(e)=>{setEmail(e.target.value)}}
              />
            </div>
            <div className='mt-4'>
              <p className='text-xl font-medium text-gray-500 mb-4'>Password</p>
              <PasswordInput
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}
              />
            </div>
            {error && <p className='text-base text-red-500 text-center'>{error}</p>}
            <button 
              type="submit"
              className='text-white bg-blue-700 text-center text-base mt-7 w-full py-2 rounded-lg hover:bg-blue-600'
            >
              Login
            </button>
            <p className='text-center pt-4'>Don't have an account</p>
            <div className='flex justify-center'>
              <Link to="/signup">
                <button className='text-white text-base font-sans bg-green-500 px-4 py-1 rounded-lg w-64 mt-7 hover:bg-green-400'>
                  Create an account
                </button>
              </Link> 
            </div>
          </form>
        </div>
      </div>
      <div className='mt-20'>
        <Footer />
      </div>
    </div>
  );
}

export default Login;