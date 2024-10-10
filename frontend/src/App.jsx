import React from 'react'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import LandingPage from './Pages/LandingPage'

const App = () => {
  return (
    <main className='overflow-hidden'>
      <Navbar/>
      <LandingPage/>
      <Footer/>
    </main>
  )
}

export default App