import React from 'react'
import img from '../../assets/img1.png'

const Navbar = ({showAdminPortalNavbar}) => {
  return (
    <div>
        <div className='w-full'>
            <div className='bg-Secondary flex justify-start gap-4 items-center'>
                <img src={img} className='w-15 h-20 ml-8'/>
                <p className='text-3xl text-white font-bold ml-24'>Sri Lanka Railway</p>
                {
                  showAdminPortalNavbar &&(
                  
                    <h2 className='text-lg text-slate-100'>Admin Portal</h2>
                    
                  )
                }
            </div>
            

        </div>
    </div>
  )
}

export default Navbar