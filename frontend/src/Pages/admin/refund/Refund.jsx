import {
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../Utilities/axiosInstance";
import { CircleCheckBig } from "lucide-react";
import Toast from "../../../Utilities/Toast";
import Swal from "sweetalert2";

const Refund = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refunds, setRefunds] = useState([]);
  const [isAcceptRefund, setIsAcceptRefund] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const getAllRefunds = async () => {
    try {
      const response = await axiosInstance.get("/api/admin/bookings/all");
      const appliedRefunds = response.data.filter(
        (refund) =>
          refund.refundStatus === "applied" ||
          refund.refundAccept === "accepted"
      );
      setRefunds(appliedRefunds);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllRefunds();
  }, []);

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "error" });
  };

  const handleAcceptRefund = async (bookingId) => {
    const result = await Swal.fire({
      title: "Process Refund",
      text: "Are you sure you want to process this refund request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, process refund",
      cancelButtonText: "No, cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsAcceptRefund(true);
    try {
      const response = await axiosInstance.post(
        `/api/admin/${bookingId}/process-refund`,
        { action: "accepted" }
      );

      if (response.data.success) {
        // Update local state more comprehensively
        setRefunds((prevRefunds) =>
          prevRefunds.map((refund) =>
            refund.bookingId === bookingId
              ? {
                  ...refund,
                  refundAccept: response.data.refundAccept,
                  refundStatus: response.data.refundStatus,
                }
              : refund
          )
        );
        showToast("Refund processed successfully", "success");
        getAllRefunds(); // Refresh the list after processing
      } else {
        showToast(response.data.message || "Failed to process refund", "error");
      }
    } catch (error) {
      setError(error);
      showToast("Error processing refund", "error");
    } finally {
      setIsAcceptRefund(false);
    }
  };

  return (
    <div>
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
      <h1 className="text-xl text-slate-800 font-bold">Find Refunds</h1>
      <div className="min-h-screen">
        <Table stickyHeader sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ background: "action.hover" }}>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                Booking Id
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                Train Name
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                Compartment
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                Travel Date
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                Refund Status
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress size={24} />
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Loading refunds...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="error">{error}</Typography>
                </TableCell>
              </TableRow>
            ) : refunds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2">No Refunds found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              refunds.map((refund) => (
                <TableRow
                  key={refund._id}
                  sx={{ "&hover": { backgroundColor: "action.hiver" } }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {refund.bookingId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {refund.trainName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {refund.compartment}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {new Date(refund.selectedDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {refund.refundStatus}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {refund.refundStatus.toLowerCase() === "applied" && (
                      <IconButton
                        color="primary"
                        size="small"
                        title="accept refund"
                        onClick={() => handleAcceptRefund(refund.bookingId)}
                      >
                        <CircleCheckBig />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Refund;
