import { CircularProgress, Paper, TableBody, TableCell, Table, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../../../Utilities/axiosInstance';

const Bookings = () => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tableContainerRef = useRef(null);
  const [bookings, setBookings]=useState([])

  const getAllBooking = async () => {
    try {
      setLoading(true); 
      const response = await axiosInstance.get('/api/admin/bookings/all');
      setBookings(response.data);
      setError(null);
    } catch (error) {
      setError(error.message);
      
    } finally {
      setLoading(false);
    }
  };

   useEffect(()=>{
        getAllBooking();

   },[]);

  return (
    <div>

<div className='flex min-h-screen'>
      <TableContainer
        component={Paper}
        elevation={2}
        ref={tableContainerRef}
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          maxHeight: 'calc(100vh - 150px)',
          '&::-webkit-scrollbar': {
            width: '10px',
            height: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0,0,0,0.05)',
          }
        }}
      >
        <Table stickyHeader sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Booking Id</TableCell>
              <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Train Name</TableCell>
              <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Compartment</TableCell>
              <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Travel Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <CircularProgress size={24} />
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Loading users...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography color="error">{error}</Typography>
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body2">No users found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow
                  key={booking._id}
                  sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {booking.bookingId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {booking.trainName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {booking.compartment}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(booking.selectedDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                 
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    </div>
  )
}

export default Bookings