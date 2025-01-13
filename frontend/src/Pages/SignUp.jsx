import React, { useState } from 'react'
import PasswordInput from '../Components/Input/PasswordInput'
import {Link, useNavigate} from 'react-router-dom';
import { validateEmail } from '../Utilities/Helper';
import axiosInstance from '../Utilities/axiosInstance'
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import LoadingOverlay from '../Utilities/LoadingOverlay';

const SignUp = () => {

  const [firstName, setFirstName]=useState("");
  const [lastName, setLastName]=useState("");
  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("");
  const [error, setError]=useState(null);
  const [loading, setLoading] = useState(false); // Initialize as false
  
  const navigate=useNavigate();
  

  const handleSignUp= async (e)=>{
    e.preventDefault();

    if(!firstName){
      setError("Please enter your first name");
      return
    }
    
    if(!lastName){
      setError("Please enter your last name");
      return
    }

    if(!validateEmail(email)){
      setError("Please enter your email");
      return
    }
    if(!password){
      setError("Please enter your password");
      return
    }
    setError("");
    setLoading(true);

    //Signup api call

    try{
       const response= await axiosInstance.post("/api/auth/signup",
        {
          firstName,
          lastName,
          email,
          password,
        }
       );
       localStorage.setItem("userName", `${response.data.firstName}`);
       localStorage.setItem("token", response.data.token);
       await new Promise(resolve => setTimeout(resolve, 400));
      setLoading(false);
       navigate('/?login=success');

    }

    catch(error){
      setLoading(false);
      setError(error.response?.data?.message || "Sign up error" );
    }
  };

  return (
    <div>
      <Navbar/>
      {loading && <LoadingOverlay/>}
        <div className='flex justify-center items-center'>
          <div className='bg-white border-[1.5px] drop-shadow-md rounded-lg px-16 py-11 mt-20 outline-none'>
            <form onSubmit={handleSignUp}>
                <h1 className='text-center text-xl font-semibold text-purple-950'>Sign up here</h1>
                <div className='flex flex-col'>
                <input 
                type='text'
                 placeholder='First Name' 
                 className='input-box mt-7'
                 value={firstName}
                 onChange={(e)=>{setFirstName(e.target.value)}}
                 />
                <input 
                 type='text'
                 placeholder='Last Name' 
                 className='input-box'
                 value={lastName}
                 onChange={(e)=>{setLastName(e.target.value)}}
                 />
                <input type='text'
                 placeholder='Email' 
                 className='input-box'
                 value={email}
                 onChange={(e)=>{setEmail(e.target.value)}}
                 />
                <PasswordInput
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}

                />
                {error && <p className='text-sm text-red-500 text-center'>{error}</p>}
                <button type="submit" className='text-center text-base bg-green-600 px-4 py-2 rounded-lg  text-white mt-5 hover:bg-green-500'>Sign Up</button>
                <p className='text-center text-lg font-sans mt-4'>I have an account</p>
                <Link to="/login"> <button className='flex justify-center text-center text-white font-sans text-lg bg-blue-700 px-2 py-1 rounded-lg mt-4 w-[200px] mx-auto hover:bg-blue-800'>Login</button>
                </Link>
                </div>
            </form>
            </div>
         
        </div>
        <div className='mt-20'>
        <Footer/>
        </div>
    </div>
  )
}

export default SignUp