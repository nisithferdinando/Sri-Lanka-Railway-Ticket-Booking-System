import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Utilities/axiosInstance";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Divider,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  Check,
  Edit,
  Close,
  CancelOutlined,
  Person,
  Email,
  MoneyOff,
} from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import Toast from "../Utilities/Toast";
import LoadingOverlay from "../Utilities/LoadingOverlay";
import Swal from "sweetalert2";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

const Account = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });
  const [bookings, setBookings] = useState([]);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [isApplyingRefund, setIsApplyingRefund] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleHomeClick = async () => {
    setIsNavigating(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    navigate("/");
  };

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "error" });
  };

  useEffect(() => {
    const fetchAccount = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        navigate("/login");
        return;
      }
      try {
        const response = await axiosInstance.get("/api/auth/account");
        const userData = response.data.user;
        setUser(userData);
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        });
      } catch (error) {
        console.error("Error fetching account:", error);
        showToast("Failed to load account details", "error");
        navigate("/login");
      }
    };
    fetchAccount();
  }, [navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoadingBookings(true);
      try {
        const response = await axiosInstance.get("/api/booking/history");
        setBookings(response.data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        showToast("Failed to load booking history", "error");
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await axiosInstance.put("/api/auth/account", formData);
      setUser(response.data.user);
      showToast("Account updated successfully", "success");
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating account:", error);
      showToast(
        error.response?.data?.message || "Failed to update account",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsCancelling(true);
    try {
      const response = await axiosInstance.post(
        `/api/booking/${bookingId}/cancel`
      );

      if (response.data.success) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.bookingId === bookingId
              ? { ...booking, status: "cancelled" }
              : booking
          )
        );

        showToast("Booking cancelled successfully", "success");
      } else {
        showToast(response.data.message || "Failed to cancel booking", "error");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      showToast(
        error.response?.data?.message || "Failed to cancel booking",
        "error"
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const handleApplyRefund = async (bookingId) => {
    const result = await Swal.fire({
      title: "Apply for Refund",
      text: "Are you sure you want to apply for a refund for this booking?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, apply for refund",
      cancelButtonText: "No, cancel",
    });
    if (!result.isConfirmed) {
      return;
    }
    setIsApplyingRefund(true);
    try {
      const response = await axiosInstance.post(
        `/api/booking/${bookingId}/apply-refund`
      );

      if (response.data.success) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.bookingId === bookingId
              ? {
                  ...booking,
                  refundStatus: "applied",
                  refundAccept: "pending",
                }
              : booking
          )
        );

        showToast("Refund application submitted successfully", "success");
      } else {
        showToast(
          response.data.message || "Failed to apply for refund",
          "error"
        );
      }
    } catch (error) {
      console.error("Error applying for refund:", error);
      showToast(
        error.response?.data?.message || "Failed to apply for refund",
        "error"
      );
    } finally {
      setIsApplyingRefund(false);
    }
  };
  const isRefundPossible = (booking) => {
    if (booking.status.toLowerCase() !== "cancelled") {
      return false;
    }
    const travelDate = new Date(booking.travelDate);
    const currentDate = new Date();
    const refundEligibilityDate = new Date(travelDate);
    refundEligibilityDate.setDate(refundEligibilityDate.getDate() + 2);

    return (
      currentDate <= refundEligibilityDate &&
      (!booking.refundStatus || booking.refundStatus === "not_applied")
    );
  };

  const getStatusChipColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "expired":
        return "primary";
      case "cancelled":
        return "default";
      default:
        return "primary";
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        {isLoading}
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}

        <div className=" max-w-7xl mx-auto space-y-6 mt-8">
          {/* Home Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={
                isNavigating ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <HomeIcon />
                )
              }
              onClick={handleHomeClick}
              disabled={isNavigating}
              sx={{
                borderRadius: "8px",
                padding: "8px 16px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                },
              }}
            >
              {isNavigating ? "Going Home..." : "Go Home"}
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
                      <Typography variant="body1">{user.email}</Typography>
                    </div>
                  </Box>
                </Box>
              ) : (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <TextField
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    fullWidth
                    required
                  />
                  <TextField
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    fullWidth
                    required
                  />
                  <TextField
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
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
                      {isLoading ? "Saving..." : "Save Changes"}
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

          {/* Booking History */}
          <Card elevation={3}>
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
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Booking ID
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Booking Date
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Train Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Compartment
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Seat Numbers
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Travel Date
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Refund Status
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoadingBookings ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <CircularProgress size={24} />
                        </TableCell>
                      </TableRow>
                    ) : bookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Typography variant="body1" color="textSecondary">
                            No booking history found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      bookings.map((booking) => (
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
                          <TableCell>{booking.refundStatus}</TableCell>
                          <TableCell>
                            {booking.status.toLowerCase() === "active" && (
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() =>
                                  handleCancelBooking(booking.bookingId)
                                }
                                title="Cancel Booking"
                              >
                                <CancelOutlined />
                              </IconButton>
                            )}
                            {isRefundPossible(booking) && (
                              <IconButton
                                color="primary"
                                size="small"
                                onClick={() =>
                                  handleApplyRefund(booking.bookingId)
                                }
                                disabled={isApplyingRefund}
                                title="Apply for Refund"
                              >
                                <MoneyOff />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {error && (
            <Alert severity="error" className="mt-4">
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" className="mt-4">
              {success}
            </Alert>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Account;
