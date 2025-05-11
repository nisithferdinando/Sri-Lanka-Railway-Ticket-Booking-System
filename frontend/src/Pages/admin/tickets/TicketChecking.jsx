import React, { useState, useEffect, useRef } from "react";
import { QrReader } from "react-qr-reader";
import { Check, X, RotateCcw, Loader, Ticket } from "lucide-react";
import axiosInstance from "../../../Utilities/axiosInstance";

const TicketChecking = () => {
  const [scanResult, setScanResult] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [cameraError, setCameraError] = useState(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const qrReaderRef = useRef(null);

  // Check if running on mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Request camera permission explicitly
  const requestCameraPermission = async () => {
    try {
      setLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode, 
          width: { ideal: isMobile ? 1280 : 720 },
          height: { ideal: isMobile ? 720 : 480 }
        } 
      });
      
      // Just to check if permission is granted
      stream.getTracks().forEach(track => track.stop());
      setPermissionGranted(true);
      setCameraStarted(true);
      setLoading(false);
    } catch (err) {
      console.error("Camera permission error:", err);
      setCameraError(`Cannot access camera: ${err.message || "Permission denied"}. Please check your browser settings.`);
      setLoading(false);
    }
  };

  // Effect for initial permission check
  useEffect(() => {
    // Check if browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Your browser doesn't support camera access. Please try a different browser.");
      return;
    }

    // Don't automatically request on component mount
    // Instead, wait for user action
  }, []);

  const handleScan = async (result) => {
    if (result?.text && scanning) {
      // Process the scan result
      console.log("QR code detected:", result.text);
      setScanning(false);
      setScanResult(result.text);
      
      try {
        setLoading(true);
        await verifyTicket(result.text);
      } catch (error) {
        setError("Failed to verify ticket. Please try again.");
        console.error("Ticket verification error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleError = (error) => {
    console.error("QR Scanner error:", error);
    if (error.name === "NotAllowedError") {
      setCameraError("Camera access was denied. Please check your browser settings and permissions.");
    } else {
      setCameraError(`Camera error: ${error.message || "Could not access camera"}`);
    }
    setCameraStarted(false);
  };

  const verifyTicket = async (ticketId) => {
    try {
      // API call to verify ticket
      const response = await axiosInstance.get(
        `/api/admin/bookings/verify/${ticketId}`
      );

      if (response.data.success) {
        setBookingDetails(response.data.booking);
      } else {
        setError("Ticket not found in system");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to verify ticket");
      throw error;
    }
  };

  const approveTicket = async () => {
    try {
      setLoading(true);

      // API call to approve ticket
      const response = await axiosInstance.post(`/api/admin/bookings/approve`, {
        ticketId: scanResult,
        bookingId: bookingDetails.bookingId,
      });

      if (response.data.success) {
        setApprovalStatus("approved");
      } else {
        setError("Failed to approve ticket");
        setApprovalStatus("rejected");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Approval process failed");
      setApprovalStatus("rejected");
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    // Reset all states
    setScanResult(null);
    setBookingDetails(null);
    setError(null);
    setApprovalStatus(null);
    setScanning(true);
    
    // Adding a small delay before reactivating camera
    setTimeout(() => {
      setCameraStarted(true);
    }, 500);
  };

  const toggleCamera = () => {
    if (cameraStarted) {
      // Briefly stop camera to switch facing mode
      setCameraStarted(false);
      
      // Switch camera facing mode
      setFacingMode(prev => prev === "environment" ? "user" : "environment");
      
      // Restart camera after a brief delay
      setTimeout(() => {
        setCameraStarted(true);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-md mx-auto">
      <div className="w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center flex items-center justify-center">
          <Ticket className="mr-2" />
          Ticket Approval Scanner
        </h2>

        {scanning && (
          <>
            {/* Camera Scanner */}
            <div className="relative mb-4">
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-black">
                {loading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-75">
                    <Loader className="animate-spin mb-2" size={36} />
                    <p className="text-sm">Initializing camera...</p>
                  </div>
                ) : cameraError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-75 p-4 text-center">
                    <X size={48} className="mb-2 text-red-500" />
                    <p className="font-bold text-lg mb-1">Camera Error</p>
                    <p className="text-sm mb-4">{cameraError}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Refresh Page
                    </button>
                  </div>
                ) : !permissionGranted ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-75 p-4 text-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-16 w-16 mb-4 text-blue-400"
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
                      />
                    </svg>
                    <p className="font-bold text-lg mb-1">Camera Access Required</p>
                    <p className="text-sm mb-4">Please allow camera access to scan QR codes</p>
                    <button
                      onClick={requestCameraPermission}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Start Camera
                    </button>
                  </div>
                ) : !cameraStarted ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-75 p-4 text-center">
                    <button
                      onClick={() => setCameraStarted(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Resume Camera
                    </button>
                  </div>
                ) : (
                  <QrReader
                    ref={qrReaderRef}
                    constraints={{
                      facingMode,
                      width: { ideal: isMobile ? 1280 : 720 },
                      height: { ideal: isMobile ? 720 : 480 }
                    }}
                    onResult={handleScan}
                    onError={handleError}
                    scanDelay={500}
                    videoId="qr-video-element"
                    videoStyle={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover",
                      transform: facingMode === "user" ? "scaleX(-1)" : "none"
                    }}
                    ViewFinder={() => (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-3/4 h-3/4 border-2 border-white border-dashed rounded-lg"></div>
                      </div>
                    )}
                  />
                )}
              </div>
              
              {/* Camera toggle button - only show when camera is active */}
              {permissionGranted && cameraStarted && (
                <button
                  onClick={toggleCamera}
                  className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md"
                  aria-label="Switch camera"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              )}
            </div>

            {permissionGranted && cameraStarted && (
              <div className="text-center text-sm text-gray-600 mb-4">
                <p>Position QR code in the center of the frame</p>
              </div>
            )}
          </>
        )}

        {loading && !scanning && (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader className="animate-spin text-blue-500 mb-2" size={36} />
            <p className="text-gray-600">Processing ticket...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 flex items-center">
              <X className="mr-2" size={18} />
              {error}
            </p>
          </div>
        )}

        {bookingDetails && !approvalStatus && (
          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-lg mb-2">Ticket Information</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Ticket ID:</span>{" "}
                {bookingDetails.ticketId}
              </p>
              <p>
                <span className="font-medium">Train:</span>{" "}
                {bookingDetails.trainName}
              </p>
              <p>
                <span className="font-medium">Compartment:</span>{" "}
                {bookingDetails.compartment}
              </p>
              <p>
                <span className="font-medium">Seat:</span>{" "}
                {bookingDetails.seatNumbers}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(bookingDetails.selectedDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Status:</span>
                <span
                  className={`ml-1 ${
                    bookingDetails.status === "active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {bookingDetails.status}
                </span>
              </p>
              <p>
                <span className="font-medium">Approval Status:</span>{" "}
                {bookingDetails.bookingApproval}
              </p>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={approveTicket}
                disabled={
                  bookingDetails.status !== "active" ||
                  bookingDetails.bookingApproval === "approved"
                }
                className={`px-4 py-2 rounded-lg flex items-center ${
                  bookingDetails.status === "active" &&
                  bookingDetails.bookingApproval !== "approved"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                <Check className="mr-2" size={18} />
                Approve Ticket
              </button>
            </div>
          </div>
        )}

        {approvalStatus && (
          <div
            className={`rounded-lg p-6 mb-4 text-center ${
              approvalStatus === "approved"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {approvalStatus === "approved" ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-green-700 mb-2">
                  Ticket Approved
                </h3>
                <p className="text-green-600">
                  This ticket has been successfully approved.
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-red-700 mb-2">
                  Approval Failed
                </h3>
                <p className="text-red-600">
                  {error || "Unable to approve ticket"}
                </p>
              </>
            )}
          </div>
        )}

        {!scanning && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={resetScanner}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
            >
              <RotateCcw className="mr-2" size={18} />
              Scan Another Ticket
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketChecking;