import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Typography,CircularProgress} from '@mui/material';
import axiosInstance from '../../../Utilities/axiosInstance';

const UserBooking = ({ userId, userName }) => {
  const [open, setOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOpen = async () => {
    setOpen(true);
    await fetchUserBookings(userId);
  };

  const handleClose = () => {
    setOpen(false);
    setBookings([]);
    setError(null);
  };

  const fetchUserBookings = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/api/admin/users/booking/${userId}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const formatSeatNumbers=(seatNumbers)=>{
    if(!seatNumbers && seatNumbers.length===0){
        return "None";
    }
        return seatNumbers.join(", ");

  }

  return (
    <div>
      <Button
        variant="contained"
        sx={{ 
          backgroundColor: 'grey', 
          color: 'white', 
          '&:hover': { backgroundColor: 'darkgreen' } 
        }}
        onClick={handleOpen}
      >
        View 
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          Bookings for {userName || 'User'}
        </DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <CircularProgress />
            </div>
          ) : error ? (
            <Typography color="error" align="center">
              {error}
            </Typography>
          ) : bookings.length === 0 ? (
            <Typography align="center">No bookings found for this user</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Booking ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Train Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Travel Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Booked Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Compartment</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Seats</TableCell>
                    
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>{booking._id}</TableCell>
                      <TableCell>{booking.trainName}</TableCell>
                      <TableCell>{new Date(booking.selectedDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(booking.bookingDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: 
                            booking.status === 'confirmed' ? '#e6f7ea' : 
                            booking.status === 'cancelled' ? '#ffebee' : '#fff8e1',
                          color: 
                            booking.status === 'confirmed' ? '#1b5e20' : 
                            booking.status === 'cancelled' ? '#b71c1c' : '#f57f17',
                        }}>
                          {booking.status}
                        </span>
                      </TableCell>
                      <TableCell>{booking.compartment}</TableCell>
                      <TableCell>{formatSeatNumbers(booking.seatNumbers)}</TableCell>
                      
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserBooking;