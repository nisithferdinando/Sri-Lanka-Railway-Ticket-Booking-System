import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '../Pages/Home'
import HomeS from '../Pages/sinhala/HomeS'
import Login from '../Pages/Login'
import SignUp from '../Pages/SignUp'
import SeatBooking from '../Pages/SeatBooking'
import SeatBookingS from '../Pages/sinhala/SeatBookingS'
import PassengerForm from '../Pages/PassengerForm'
import ReviewBooking from '../Pages/ReviewBooking'

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
          <Route path='/seat-bookingS/:trainId' element={<SeatBookingS/>}/>
          <Route path="/contact-form" element={<PassengerForm />} />
          <Route path="/review-booking" element={<ReviewBooking />} />
        </Routes>
       
      </Router>
    </div>
  )
}

export default Routers