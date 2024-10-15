import React from 'react'
import img from '../../assets/img1.png'

const Navbar = () => {
  return (
    <div>
        <div className='container'>
            <div className='bg-Secondary flex justify-start gap-4 items-center'>
                <img src={img} className='w-15 h-20 ml-8'/>
                <p className='text-3xl text-white font-bold ml-24'>Sri Lanka Railway</p>

            </div>
            

        </div>
    </div>
  )
}

export default Navbar