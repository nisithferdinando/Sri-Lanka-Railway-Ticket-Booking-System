import React from 'react'

const LandingPage = () => {
  return (
    <div>
            < div className=' container flex flex-col max-w-md justify-center mt-32 pl-10 py-8 ml-[600px] bg-[#F7F2F2] border rounded-lg shadow-md'>

            <p className='text-purple-600 text-center font-semibold text-xl'>Log in to your account</p>
            <div className='flex justify-start'>
                <form>
                    <div className='mt-4'>
                    <p className='text-xl font-semibold'>Email</p>
                    <input type='email'name='email' placeholder="Enter your name" className='w-[300px] h-12 border-2 border-[#D9D9D9] rounded-lg mt-2 px-2'/>
                    </div>
                    <div className='mt-4'>
                    <p className='text-xl font-semibold'>Password</p>
                    <input type='password' name='password' placeholder="Enter your password" className='w-[300px] h-12 border-2 border-[#D9D9D9] rounded-lg mt-2 px-2'/>
                    </div>
                    <button className='text-white bg-blue-700 text-center text-lg font-sans mt-5 w-full py-2 rounded-lg hover:bg-blue-600'>Login</button>
                    <p className='text-center pt-4'>Don't have an account</p>
                    <button className='text-white text-lg font-sans bg-green-500 px-4 py-1 rounded-lg w-full mt-4 hover:bg-green-400'>Create an account</button>
                    <p className='text-blue-500 underline text-lg text-center mt-4'>Forgot Password</p>
                </form>
            </div>

            </div>
            

        </div>

  )
}

export default LandingPage