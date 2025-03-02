import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import img from '../assets/img1.png';
import backgroundImage from '../assets/background.jpg';
import history from '../assets/history.jpg';
import modern from '../assets/modern.jpg';
import Footer from '../Components/Footer/Footer';
import gallery1 from '../assets/gallery1.jpg'; 
import gallery2 from '../assets/gallery2.jpg';
import gallery3 from '../assets/gallery3.jpg';
import gallery4 from '../assets/gallery4.jpg';
import gallery5 from '../assets/gallery5.jpg';
import gallery6 from '../assets/gallery6.jpg';
import LoadingOverlay from '../Utilities/LoadingOverlay';

const LandingPage = () => {

    const [loading, isLoading] = useState(false);
    const navigate = useNavigate();

    const handleLoginNavigation= async()=>{
        isLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate('/login');
        isLoading(false);
    }

    const handleSignupNavigation= async()=>{
        isLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate('/signup');
        isLoading(false);
    }
 
  const galleryImages = [
    { id: 1, src: gallery1, alt: 'Railway Station' },
    { id: 2, src: gallery2, alt: 'Mountain Train' },
    { id: 3, src: gallery3, alt: 'Coastal Railway' },
    { id: 4, src: gallery4, alt: 'Historic Train' },
    { id: 5, src: gallery5, alt: 'Modern Train' },
    { id: 6, src: gallery6, alt: 'Scenic Route' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
        {loading && <LoadingOverlay/>}
      
      <nav className="w-full">
        <div className="bg-Secondary flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 py-2">
          <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-0">
            <img src={img} className="w-15 h-20 sm:w-15 sm:h-20" alt="Railway Logo"/>
            <p className="text-xl sm:text-3xl text-white font-bold">Sri Lanka Railway</p>
          </div>
          <div className="flex gap-2 sm:gap-4">
            <button 
             onClick={handleLoginNavigation}
            className="bg-white text-Secondary px-4 sm:px-6 py-2 rounded-md hover:bg-gray-200 transition text-sm sm:text-base"
            >
              Login
            </button>
            <button
             className="bg-transparent text-white border-2 border-white px-4 sm:px-6 py-2 rounded-md hover:bg-white/10 transition text-sm sm:text-base"
             onClick={handleSignupNavigation}
             >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 sm:py-16 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">Welcome to Sri Lanka Railway</h1>
          <p className="text-base sm:text-xl">Embark on a journey through paradise with Sri Lanka's premier rail service.</p>
        </div>
      </div>

      <section className="py-8 sm:py-16 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto mt-6 sm:mt-12">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-8 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Experience the Beauty of Sri Lanka by Rail</h2>
              <p className="text-gray-600">
                Sri Lanka Railway offers a unique way to explore the island's breathtaking landscapes, 
                from misty mountains to pristine coastlines. Our modern booking system makes it easier 
                than ever to plan your journey through paradise.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img 
                src={backgroundImage} 
                alt='background image' 
                className='w-full h-48 sm:h-64 object-cover rounded-lg'
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-16 px-4 sm:px-8 bg-gray-100">
        <div className="max-w-6xl mx-auto mt-3 sm:mt-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 mt-4">Our Rich History</h2>
          
          
          <div className="grid md:grid-cols-2 gap-4 sm:gap-8 items-center mb-8 sm:mb-16">
            <div className="rounded-lg w-full">
              <img 
                src={history} 
                alt='history image' 
                className='rounded-lg w-full h-48 sm:h-64 object-cover'
              />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4">The Beginning (1864)</h3>
              <p className="text-gray-600">
                The story of Sri Lanka Railway began in 1864 with the construction of the first 
                railway line from Colombo to Kandy. This marked the beginning of a new era in 
                transportation for the island nation.
              </p>
            </div>
          </div>

         
          <div className="grid md:grid-cols-2 gap-4 sm:gap-8 items-center">
            <div className="md:order-2 rounded-lg w-full">
              <img 
                src={modern} 
                alt='modern image' 
                className='rounded-lg w-full h-48 sm:h-64 object-cover'
              />
            </div>
            <div className="md:order-1">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">Modern Era</h3>
              <p className="text-gray-600">
                Today, Sri Lanka Railway operates over 1,500 kilometers of track, connecting major 
                cities and scenic destinations across the island, offering both convenience and 
                unforgettable travel experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-16 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image) => (
              <div key={image.id} className="rounded-lg overflow-hidden">
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer showAdminPortal={true}/>
    </div>
  );
};

export default LandingPage;