import React, { useState } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Trains from './trains/Trains';
import Users from './users/Users';
import Bookings from './bookings/Bookings';
import { useNavigate } from 'react-router';
import Dashboard from './dashboard/Dashboard';
import LoadingOverlay from '../../Utilities/LoadingOverlay';

const AdminDashboard = () => {

  const [activeItem, setActiveItem] = useState('Dashboard');
  const [loading, setLoading] =useState(false);
  const navigate =useNavigate();

  const handleNavigation = (item) => {
    setActiveItem(item);
  };
  const handleLogout =async () => {

   setLoading(true);
   localStorage.removeItem('adminToken');
   await new Promise(resolve => setTimeout(resolve, 1000));
   navigate('/adminPortalLogin');
   setLoading(false);
   
  };
  const renderComponent = () => {
    switch (activeItem) {
      case 'Trains':
        return <Trains />;
      case 'Users':
        return <Users/>;
      case "Bookings":
        return <Bookings/>;
      case "Dashboard":
        return <Dashboard/>;
      default:
        return <p>Welcome to the Admin Dashboard</p>;
    }
  }
 
  return (
    <div>
      {loading && <LoadingOverlay/>}
      <Navbar showAdminPortalNavbar={true} />
    <div className="flex h-full bg-gray-100">
     
      <div className="w-64 bg-blue-900/90 text-white">
        <div className="p-4 text-xl font-bold">Admin Panel</div>
        <div>
          <div className='mt-4'>
            <div className={`px-4 py-4 hover:bg-gray-700 cursor-pointer ${activeItem === 'Dashboard' ? 'bg-gray-700' : ''}`}
                onClick={() => handleNavigation('Dashboard')}>
              Dashboard
            </div>
            <div className={`px-4 py-4 hover:bg-gray-700 cursor-pointer ${activeItem === 'Trains' ? 'bg-gray-700' : ''}`}
                onClick={() => handleNavigation('Trains')}>
              Trains
            </div>
            <div className={`px-4 py-3 hover:bg-gray-700 cursor-pointer ${activeItem === 'Users' ? 'bg-gray-700' : ''}`}
                onClick={() => handleNavigation('Users')}>
              Users
            </div>
            <div className={`px-4 py-4 hover:bg-gray-700 cursor-pointer ${activeItem === 'Bookings' ? 'bg-gray-700' : ''}`}
                onClick={() => handleNavigation('Bookings')}>
              Bookings
            </div>
            <div className="px-4 py-4 text-red-400 hover:bg-gray-700 cursor-pointer mt-auto"
                onClick={handleLogout}>
              Logout
            </div>
          </div>
        </div>
      </div>
  
      <div className="flex-auto px-4 pt-4">
       
        <div>
          {renderComponent()}
        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminDashboard;