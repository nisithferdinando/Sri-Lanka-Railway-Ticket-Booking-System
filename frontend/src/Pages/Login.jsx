import React, { useState } from 'react'
import PasswordInput from '../Components/Input/PasswordInput';
import { Link } from 'react-router-dom';

const Login = () => {

  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("");
  const [error, setError]=useState(null);
   
    
  const handleLogin = async(e)=>{
    e.preventDefault();

    if(!email){
      setError("Please enter your email");
      return;
    }

    if(!password){
      setError("Please enter the password");
      return;
    }

    setError("");

    //Login Api call


  };

  return (
    <div>
            <div className='container max-w-md mt-20 py-8 ml-[600px] bg-[#F7F2F2] border rounded-lg drop-shadow-sm outline-none'>
            <div className='flex justify-center'>
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
                    {error && <p className='text-base text-red-500  text-center'>{error}</p>}
                    <button className='text-white bg-blue-700 text-center text-base mt-7 w-full py-2 rounded-lg hover:bg-blue-600'>Login</button>
                    <p className='text-center pt-4'>Don't have an account</p>
                    <div className='flex justify-center'>
                   <Link to="/signup"><button className='text-white text-base font-sans bg-green-500 px-4 py-1 rounded-lg w-64 mt-7 hover:bg-green-400'>Create an account</button>
                   </Link> 
                    </div>
                    <a href='#'><p className='text-blue-500 underline text-lg text-center mt-4 hover:text-purple-800'>Forgot Password</p> </a>
                </form>
            </div>

            </div>
            

        </div>

  )
}

export default Login;