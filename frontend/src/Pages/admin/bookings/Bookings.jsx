import { CircularProgress, Paper, TableBody, TableCell, Table, TableContainer, TableHead, TableRow, Typography, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../../Utilities/axiosInstance';
import Footer from '../../../Components/Footer/Footer';

const Bookings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tableContainerRef = useRef(null);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [trainNames, setTrainNames] = useState([]);
  
  const [selectedTrain, setSelectedTrain] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const getAllBooking = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/admin/bookings/all');
      const sortedBookings = response.data.sort(
        (a, b) => new Date(b.selectedDate) - new Date(a.selectedDate)
      );
  
      setBookings(sortedBookings);
      setFilteredBookings(sortedBookings);
      
      const uniqueTrainNames = [...new Set(response.data.map(booking => booking.trainName))];
      setTrainNames(uniqueTrainNames);
      
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBooking();
  }, []);

  const handleTrainChange = (event) => {
    setSelectedTrain(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const applyFilters = () => {
    let filtered = [...bookings];
    
    if (selectedTrain) {
      filtered = filtered.filter(booking => booking.trainName === selectedTrain);
    }
    
    if (selectedDate) {
      const filterDate = new Date(selectedDate).toDateString();
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.selectedDate).toDateString();
        return bookingDate === filterDate;
      });
    }
    
    setFilteredBookings(filtered);
  };

  const resetFilters = () => {
    setSelectedTrain('');
    setSelectedDate('');
    setFilteredBookings(bookings);
  };

  return (
    
    <div>
      <h1 className='text-xl mt-4 text-slate-700 font-semibold'>Find Bookings</h1>
      <Box sx={{ paddingY:4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="train-select-label">Train Name</InputLabel>
          <Select
            labelId="train-select-label"
            id="train-select"
            value={selectedTrain}
            label="Train Name"
            onChange={handleTrainChange}
          >
            <MenuItem value="">
              <em>All Trains</em>
            </MenuItem>
            {trainNames.map((train) => (
              <MenuItem key={train} value={train}>{train}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <TextField
          label="Travel Date"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ minWidth: 200 }}
        />
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={applyFilters}
          >
            Search
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={resetFilters}
          >
            Reset
          </Button>
        </Box>
      </Box>

      <div className='flex min-h-screen'>
        <TableContainer
          component={Paper}
          elevation={2}
          ref={tableContainerRef}
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            maxHeight: 'calc(100vh - 200px)', 
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
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold'}}>Booking Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      Loading bookings...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="error">{error}</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2">No bookings found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
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
                    <TableCell>
                      <Typography variant="body2">
                        {booking.status}
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
    
  );
};

export default Bookings;