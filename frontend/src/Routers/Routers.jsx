import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '../Pages/Home'
import HomeS from '../Pages/sinhala/HomeS'
import Login from '../Pages/Login'
import SignUp from '../Pages/SignUp'
import SeatBooking from '../Pages/SeatBooking'

const Routers = () => {
  return (
    <div>
        <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/home-sin' element={<HomeS/>}/>
          <Route path='/seat-booking/:trainId' element={<SeatBooking/>}/>
         
        </Routes>
       
      </Router>
    </div>
  )
}

export default Routers