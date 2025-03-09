import React, { useState } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Trains from './trains/Trains';

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const handleNavigation = (item) => {
    setActiveItem(item);
  };
  const handleLogout = () => {
   localStorage.removeItem('token');
   window.location.reload();
   
  };
  const renderComponent = () => {
    switch (activeItem) {
      case 'Trains':
        return <Trains />;
      case 'Users':
        return <Users />;
      default:
        return <p>Welcome to the Admin Dashboard</p>;
    }
  }
 
  return (
    <div>
      <Navbar showAdminPortalNavbar={true} />
    <div className="flex h-screen bg-gray-100">
     
      <div className="w-64 bg-blue-900/90 text-white">
        <div className="p-4 text-xl font-bold">Admin Panel</div>
        <div>
          <div>
            <div className={`px-4 py-3 hover:bg-gray-700 cursor-pointer ${activeItem === 'Dashboard' ? 'bg-gray-700' : ''}`}
                onClick={() => handleNavigation('Dashboard')}>
              Dashboard
            </div>
            <div className={`px-4 py-3 hover:bg-gray-700 cursor-pointer ${activeItem === 'Trains' ? 'bg-gray-700' : ''}`}
                onClick={() => handleNavigation('Trains')}>
              Trains
            </div>
            <div className={`px-4 py-3 hover:bg-gray-700 cursor-pointer ${activeItem === 'Users' ? 'bg-gray-700' : ''}`}
                onClick={() => handleNavigation('Users')}>
              Users
            </div>
            <div className={`px-4 py-3 hover:bg-gray-700 cursor-pointer ${activeItem === 'Bookings' ? 'bg-gray-700' : ''}`}
                onClick={() => handleNavigation('Bookings')}>
              Bookings
            </div>
            <div className="px-4 py-3 text-red-400 hover:bg-gray-700 cursor-pointer mt-auto"
                onClick={handleLogout}>
              Logout
            </div>
          </div>
        </div>
      </div>
  
      <div className="flex-auto p-8">
        <h1 className="text-2xl font-semibold mb-6">{activeItem}</h1>
        <div>
          {renderComponent()}
        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminDashboard;