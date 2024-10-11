import React from 'react'

const SignUp = () => {
  return (
    <div>
        <div className='flex justify-center items-center'>
            <form className='bg-[#F7F2F2] bg-opacity-60 border rounded-lg px-16 py-10 mt-16 drop-shadow-lg'>
                <h1 className='text-center text-xl font-semibold text-purple-700'>Sign up here</h1>
                <div className='flex flex-col'>
                <input type='text' name='fname' placeholder='First Name' className='text-md px-2 py-2 rounded-md border border-gray-300 mt-8 w-96'/>
                <input type='text' name='lname' placeholder='Last Name' className='text-md px-2 py-2 rounded-md border border-gray-300 mt-4 w-96'/>
                <input type='text' name='semail' placeholder='Email' className='text-md px-2 py-2 rounded-md border border-gray-300 mt-4 w-96'/>
                <input type='text' name='spassword' placeholder='Password' className='text-md px-2 py-2 rounded-md border border-gray-300 mt-4 w-96'/>
                <input type='text' name='scpassword' placeholder='Confirm password' className='text-md px-2 py-2 rounded-md border border-gray-300 mt-4 w-96'/>
                <button className='text-center text-lg font-sans bg-green-600 px-4 py-1 rounded-lg  text-white mt-8 hover:bg-green-500'>Sign Up</button>
                <p className='text-center text-lg font-sans mt-4'>I have an account</p>
                <button className='text-center text-white font-sans text-lg bg-blue-700 px-2 py-1 rounded-lg mt-4 w-[200px] mx-auto hover:bg-blue-800'>Login</button>
                </div>
            </form>
         
        </div>
    </div>
  )
}

export default SignUp