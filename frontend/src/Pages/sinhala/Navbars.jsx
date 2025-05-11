import React from 'react'
import img from '../../assets/img1.png'

const Navbars = () => {
  return (
    <div>
        <div className='w-full'>
            <div className='bg-blue-950 flex justify-start gap-4 items-center'>
                <img src={img} className='w-15 h-20 ml-8'/>
                <p className='text-2xl text-white font-bold ml-24'>ශ්‍රී ලංකා දුම්රිය සේවය</p>

            </div>
            

        </div>
    </div>
  )
}

export default Navbars;