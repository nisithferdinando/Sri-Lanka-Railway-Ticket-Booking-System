import React, { useState, useEffect, useRef } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Typography, 
  Box, 
  Chip, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  CircularProgress 
} from '@mui/material';
import { PlusCircle, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import AddTrains from './AddTrains';
import axiosInstance from '../../../Utilities/axiosInstance'; 

const Trains = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const tableContainerRef = useRef(null);
  
  const fetchTrains = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/admin/trains/all');
      setTrains(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load trains. Please try again later.');
      console.error('Error fetching trains:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTrains();
  }, []);
  
  const deleteTrain = async (trainId) => {
    if (window.confirm('Are you sure you want to delete this train?')) {
      try {
        await axiosInstance.delete(`/api/admin/trains/${trainId}`);
       
        setTrains(trains.filter(train => train._id !== trainId));
      } catch (err) {
        alert('Failed to delete train');
        console.error('Error deleting train:', err);
      }
    }
  };
  
  const handleEditTrain = (train) => {
    setSelectedTrain(train);
    setShowEditModal(true);
  };
  
  const updateTrain = async (updatedTrainData) => {
    try {
      const response = await axiosInstance.put(`/api/admin/trains/${selectedTrain._id}`, updatedTrainData);
      setTrains(trains.map(train => 
        train._id === selectedTrain._id ? response.data : train
      ));
      
      handleEditModalClose(true);
      
    } catch (err) {
      alert('Failed to update train');
      console.error('Error updating train:', err);
    }
  };

  const formatOperatingDays = (days) => {
    if (!days || days.length === 0) return 'None';
    
    if (days.length === 7) return 'Daily';
    
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    if (weekdays.every(day => days.includes(day)) && days.length === 5) {
      return 'Weekdays';
    }
    
    if (days.includes('Saturday') && days.includes('Sunday') && days.length === 2) {
      return 'Weekends';
    }
    
    return days.map(day => day.substring(0, 3)).join(', ');
  };
  
  const handleAddModalClose = (refreshData = false) => {
    setShowAddModal(false);
    if (refreshData) {
      fetchTrains();
    }
  };
  
  const handleEditModalClose = (refreshData = false) => {
    setShowEditModal(false);
    setSelectedTrain(null);
    if (refreshData) {
      fetchTrains();
    }
  };
  
  return (
    <Box sx={{ p: 4, maxWidth: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<PlusCircle size={20} />}
          onClick={() => setShowAddModal(true)}
        >
          Add New Train
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ p: 2, bgcolor: 'error.light', color: 'error.dark', borderRadius: 1 }}>
          <Typography>{error}</Typography>
        </Box>
      ) : trains.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography  color="text.secondary">
            No trains found. Add a new train to get started.
          </Typography>
        </Box>
      ) : (
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
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Train Name</TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Route</TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Departure</TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Operating Days</TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trains.map((train) => (
                <TableRow 
                  key={train._id} 
                  sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {train.trainName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {train.trainNameS}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {train.start} → {train.route[train.route.length - 1]}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {train.departs}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatOperatingDays(train.operatingDays)}
                    </Typography>
                  </TableCell>
                 
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                     
                      <IconButton 
                        size="small"
                        color="primary"
                        onClick={() => handleEditTrain(train)}
                        title="Edit"
                      >
                        <Edit size={20} />
                      </IconButton>
                      <IconButton 
                        size="small"
                        color="error"
                        onClick={() => deleteTrain(train._id)}
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      <Dialog 
        open={showAddModal} 
        onClose={() => handleAddModalClose()}
        maxWidth="lg"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography >Add New Train</Typography>
          <IconButton size="small" onClick={() => handleAddModalClose()}>
            ✕
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
          <AddTrains onSuccess={() => handleAddModalClose(true)} />
        </DialogContent>
      </Dialog>
      
      <Dialog 
        open={showEditModal} 
        onClose={() => handleEditModalClose()}
        maxWidth="lg"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography >Edit Train</Typography>
          <IconButton size="small" onClick={() => handleEditModalClose()}>
            ✕
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
          {selectedTrain && (
            <EditTrains 
              train={selectedTrain} 
              onSuccess={() => handleEditModalClose(true)} 
              onUpdate={updateTrain}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

const EditTrains = ({ train, onSuccess, onUpdate }) => {
  const [formData, setFormData] = useState({
    trainName: train.trainName || '',
    trainNameS: train.trainNameS || '',
    start: train.start || '',
    route: train.route || [],
    departs: train.departs || '',
    operatingDays: train.operatingDays || [],
    isActive: train.isActive || false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleOperatingDaysChange = (day) => {
    setFormData(prev => {
      const currentDays = [...prev.operatingDays];
      
      if (currentDays.includes(day)) {
        return {
          ...prev,
          operatingDays: currentDays.filter(d => d !== day)
        };
      } else {
        return {
          ...prev,
          operatingDays: [...currentDays, day]
        };
      }
    });
  };
  
  const handleRouteChange = (index, value) => {
    setFormData(prev => {
      const updatedRoute = [...prev.route];
      updatedRoute[index] = value;
      return {
        ...prev,
        route: updatedRoute
      };
    });
  };
  
  const addRouteStop = () => {
    setFormData(prev => ({
      ...prev,
      route: [...prev.route, '']
    }));
  };
  
  const removeRouteStop = (index) => {
    setFormData(prev => {
      const updatedRoute = [...prev.route];
      updatedRoute.splice(index, 1);
      return {
        ...prev,
        route: updatedRoute
      };
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await onUpdate(formData);
      onSuccess();
    } catch (err) {
      setError('Failed to update train. Please check your inputs and try again.');
      console.error('Error updating train:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const days = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];
  
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Box sx={{ p: 2, mb: 2, bgcolor: 'error.light', color: 'error.dark', borderRadius: 1 }}>
          <Typography>{error}</Typography>
        </Box>
      )}
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Train Information
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="body2" gutterBottom>Train Name</Typography>
            <input
              type="text"
              name="trainName"
              value={formData.trainName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </Box>
          <Box>
            <Typography variant="body2" gutterBottom>Train Name (Sinhala)</Typography>
            <input
              type="text"
              name="trainNameS"
              value={formData.trainNameS}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </Box>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>Departure Time</Typography>
          <input
            type="text"
            name="departs"
            value={formData.departs}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="e.g. 08:00 AM"
            required
          />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>Operating Days</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {days.map((day) => (
              <Chip 
                key={day}
                label={day}
                onClick={() => handleOperatingDaysChange(day)}
                color={formData.operatingDays.includes(day) ? 'primary' : 'default'}
                variant={formData.operatingDays.includes(day) ? 'filled' : 'outlined'}
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <Typography variant="body2">Active</Typography>
        </Box>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Route
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>Starting Station</Typography>
          <input
            type="text"
            name="start"
            value={formData.start}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </Box>
        
        <Typography variant="body2" gutterBottom>Route Stops</Typography>
        
        {formData.route.map((stop, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <input
                type="text"
                value={stop}
                onChange={(e) => handleRouteChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder={`Stop ${index + 1}`}
                required
              />
            </Box>
            <IconButton 
              color="error" 
              size="small"
              onClick={() => removeRouteStop(index)}
              disabled={formData.route.length <= 1}
            >
              <Trash2 size={18} />
            </IconButton>
          </Box>
        ))}
        
        <Button
          variant="outlined"
          size="small"
          onClick={addRouteStop}
          sx={{ mt: 1 }}
        >
          Add Stop
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => onSuccess()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Train'}
        </Button>
      </Box>
    </Box>
  );
};

export default Trains;