import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../Utilities/axiosInstance';
import { Card, CardContent, CardHeader, Button, TextField, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Divider, Typography, Box, CircularProgress } from '@mui/material';
import { Check, Edit, Close, CancelOutlined, Person, Email } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import Toast from '../Utilities/Toast';
import LoadingOverlay from '../Utilities/LoadingOverlay';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const Account = () => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });

    // Rest of your existing state and bookings data...
    const [bookings] = useState([
        {
            bookingId: "BK001",
            bookingDate: "2025-01-14",
            trainName: "Express 123",
            compartment: "A1",
            seatNumbers: "15, 16",
            travelDate: "2025-02-01",
            status: "active",
        },
        {
            bookingId: "BK002",
            bookingDate: "2025-01-10",
            trainName: "Super Fast 456",
            compartment: "B2",
            seatNumbers: "23",
            travelDate: "2025-01-12",
            status: "expired",
        },
    ]);

    const handleHomeClick = async () => {
        setIsNavigating(true);
        // Simulate a small delay for the loader to be visible
        await new Promise(resolve => setTimeout(resolve, 800));
        navigate('/');
    };

    // Your existing functions...
    const showToast = (message, type = 'error') => {
        setToast({ show: true, message, type });
    };
    
    const hideToast = () => {
        setToast({ show: false, message: '', type: 'error' });
    };

    useEffect(() => {
        const fetchAccount = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No token found in localStorage");
                navigate('/login');
                return;
            }
            try {
                const response = await axiosInstance.get('/api/auth/account');
                const userData = response.data.user;
                setUser(userData);
                setFormData({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                });
            } catch (error) {
                console.error(error);
                navigate('/login');
            }
        };

        fetchAccount();
    }, [navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axiosInstance.put('/api/auth/account', formData);
            setUser(response.data.user);
            showToast('Account updated successfully', 'success');
            await new Promise(resolve => setTimeout(resolve, 800));
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            showToast('email already exists', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelBooking = (bookingId) => {
        console.log('Cancelling booking:', bookingId);
    };

    const getStatusChipColor = (status) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'expired':
                return 'error';
            case 'canceled':
                return 'default';
            default:
                return 'primary';
        }
    };

    return (
        <div>
            <Navbar />
            <div className="p-6 bg-gray-100 min-h-screen">
                {/*isLoading && <LoadingOverlay />*/}
                {toast.show && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={hideToast}
                    />
                )}
                
                <div className="max-w-7xl mx-auto space-y-6 mt-8">
                    {/* Home Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={isNavigating ? <CircularProgress size={20} color="inherit" /> : <HomeIcon />}
                            onClick={handleHomeClick}
                            disabled={isNavigating}
                            sx={{ 
                                borderRadius: '8px',
                                padding: '8px 16px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                }
                            }}
                        >
                            {isNavigating ? 'Going Home...' : 'Go Home'}
                        </Button>
                    </Box>

                    {/* Profile Card */}
                    <Card elevation={3}>
                        <CardHeader 
                            title={
                                <Typography variant="h5" component="h2">
                                    Profile Information
                                </Typography>
                            }
                            action={
                                !isEditing && (
                                    <Button
                                        variant="outlined"
                                        startIcon={<Edit />}
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                )
                            }
                        />
                        <Divider />
                        {/* Rest of your existing CardContent for profile... */}
                        <CardContent>
                            {!isEditing ? (
                                <Box className="space-y-4">
                                    <Box className="flex items-center space-x-2">
                                        <Person color="primary" />
                                        <div>
                                            <Typography variant="body2" color="textSecondary">
                                                Full Name
                                            </Typography>
                                            <Typography variant="body1">
                                                {user.firstName} {user.lastName}
                                            </Typography>
                                        </div>
                                    </Box>
                                    <Box className="flex items-center space-x-2">
                                        <Email color="primary" />
                                        <div>
                                            <Typography variant="body2" color="textSecondary">
                                                Email
                                            </Typography>
                                            <Typography variant="body1">
                                                {user.email}
                                            </Typography>
                                        </div>
                                    </Box>
                                </Box>
                            ) : (
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <TextField
                                        label="First Name"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Last Name"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        fullWidth
                                        required
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            disabled={isLoading}
                                            startIcon={<Check />}
                                        >
                                            {isLoading ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFormData({
                                                    firstName: user.firstName,
                                                    lastName: user.lastName,
                                                    email: user.email,
                                                });
                                            }}
                                            startIcon={<Close />}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>

                    {/* Booking History Card */}
                    <Card elevation={3} sx={{ boxShadow: "revert" }}>
                        <CardHeader 
                            title={
                                <Typography variant="h5" component="h2">
                                    Booking History
                                </Typography>
                            }
                        />
                        <Divider />
                        <CardContent>
                            <TableContainer component={Paper} elevation={0}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Booking ID</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Booking Date</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Train Name</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Compartment</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Seat Numbers</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Travel Date</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Cancel Booking</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {bookings.map((booking) => (
                                            <TableRow key={booking.bookingId}>
                                                <TableCell>{booking.bookingId}</TableCell>
                                                <TableCell>{booking.bookingDate}</TableCell>
                                                <TableCell>{booking.trainName}</TableCell>
                                                <TableCell>{booking.compartment}</TableCell>
                                                <TableCell>{booking.seatNumbers}</TableCell>
                                                <TableCell>{booking.travelDate}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={booking.status}
                                                        color={getStatusChipColor(booking.status)}
                                                        size="small"
                                                        sx={{ cursor: "default" }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {booking.status === 'active' && (
                                                        <IconButton
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleCancelBooking(booking.bookingId)}
                                                            title="Cancel Booking"
                                                        >
                                                            <CancelOutlined />
                                                        </IconButton>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>

                    {error && <Alert severity="error" className="mt-4">{error}</Alert>}
                    {success && <Alert severity="success" className="mt-4">{success}</Alert>}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Account;