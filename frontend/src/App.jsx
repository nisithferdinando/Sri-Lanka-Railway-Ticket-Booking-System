import React from 'react'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import LandingPage from './Pages/LandingPage'
import SignUp from './Pages/SignUp'

const App = () => {
  return (
    <main className='overflow-hidden'>
      <Navbar/>
      <SignUp/>
      <Footer/>
    </main>
  )
}

export default App