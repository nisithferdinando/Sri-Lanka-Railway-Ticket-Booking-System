import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import { CreditCard, Loader, Lock } from "lucide-react";
import LoadingOverlay from "../Utilities/LoadingOverlay";
import axiosInstance from "../Utilities/axiosInstance";

const stripePromise = loadStripe(
  "pk_test_51QDRwlCv9h4sHdoFbCahB7FUr4J7Due8oEsyMxlfvSQF0WmxhwRwXS8OG4aWTmqrotwOB6watlY3i6q5aOZxHGVS00sLiQFPF2"
);

const cardStyle = {
  style: {
    base: {
      color: "#424770",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
      iconColor: "#6772e5",
    },
    invalid: {
      color: "#e53e3e",
      iconColor: "#e53e3e",
    },
  },
  hidePostalCode: true,
};

// Payment Form Component
const PaymentForm = ({ bookingDetails, calculateTotals }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [cardFocused, setCardFocused] = useState(false);

  const generateTicketId = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `TKT-${timestamp.toUpperCase()}-${randomStr.toUpperCase()}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !agreed) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem("userId");
      const username = localStorage.getItem("username");
      const { total } = calculateTotals();

      // Payment intent
      const intentResponse = await axiosInstance.post(
        "/api/payment/create-payment-intent",
        {
          amount: Math.round(total * 100), // Convert to cents
          currency: "inr",
        }
      );

      // Confirm card payment
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(intentResponse.data.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: username,
            },
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      // Book the seats
      const bookingResponse = await axiosInstance.post(
        `/api/trains/${bookingDetails.trainId}/compartment/${bookingDetails.compartment}/book`,
        {
          seatNumbers: bookingDetails.selectedSeats,
          selectedDate: bookingDetails.selectedDate,
          userId,
          username,
          paymentIntentId: paymentIntent.id,
        }
      );

      if (bookingResponse.data.success) {
        // Generate individual ticket IDs for each seat
        const ticketIds = bookingDetails.selectedSeats.map(() =>
          generateTicketId()
        );

        // Save separate booking details for each seat
        const bookingPromises = bookingDetails.selectedSeats.map(
          async (seatNumber, index) => {
            return axiosInstance.post("/api/booking/saveBooking", {
              userId,
              trainName: bookingDetails.trainDetails.trainName,
              compartment: bookingDetails.compartment,
              seatNumbers: seatNumber, // Just one seat per booking
              selectedDate: bookingDetails.selectedDate,
              email:
                bookingDetails.passengers[index].email ||
                bookingDetails.passengers[0].email,
              status: "active",
              paymentIntentId: paymentIntent.id,
              amount: calculateTotals().pricePerTicket, // Individual seat price
              ticketId: ticketIds[index],
              bookingApproval: "pending",
            });
          }
        );

        // Wait for all bookings to be saved
        const savedBookings = await Promise.all(bookingPromises);
        const bookingIds = savedBookings.map(
          (response) => response.data.bookingId
        );

        // Navigate to tickets page with all ticket information
        navigate("/tickets", {
          state: {
            ticketIds,
            bookingDetails,
            bookingResponse: bookingResponse.data,
            bookingIds,
            paymentId: paymentIntent.id,
            userId,
            startStation: bookingDetails.trainDetails.startStation,
            endStation: bookingDetails.trainDetails.endStation,
            email: bookingDetails.passengers[0].email,
          },
        });
      } else {
        throw new Error("Booking failed after payment");
      }
    } catch (error) {
      console.error("Payment/Booking Error:", error);
      setError(
        error.message || "An error occurred during payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <label className="block text-gray-700 font-medium">
            Card Details
          </label>
          <div className="flex items-center text-gray-500 text-sm">
            <Lock size={14} className="mr-1" />
            Secure Payment
          </div>
        </div>

        <div
          className={`border rounded-lg p-5 bg-white transition-all duration-200 ${
            cardFocused
              ? "shadow-md border-blue-400"
              : cardComplete
              ? "border-green-400"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <div className="flex items-center mb-4">
            <CreditCard className="text-gray-500 mr-2" size={24} />
            <span className="text-gray-700 font-medium">Credit/Debit Card</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <CardElement
              options={cardStyle}
              onChange={(e) => setCardComplete(e.complete)}
              onFocus={() => setCardFocused(true)}
              onBlur={() => setCardFocused(false)}
            />
          </div>

          <div className="mt-3 flex justify-between text-xs text-gray-500">
            <span>All card information is encrypted and secure</span>
            <div className="flex space-x-2">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>Amex</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
        <input
          type="checkbox"
          id="terms"
          className="h-5 w-5 text-blue-600 rounded"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <label htmlFor="terms" className="ml-2 block text-gray-700">
          I agree to the terms and conditions
        </label>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !cardComplete || !agreed || loading}
        className={`w-full flex justify-center items-center py-4 rounded-lg font-medium ${
          !stripe || !cardComplete || !agreed || loading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white transition-colors`}
      >
        {loading ? (
          <>
            <Loader className="animate-spin mr-2" size={20} />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2" size={20} />
            Pay Now Rs {calculateTotals().total.toFixed(2)}
          </>
        )}
      </button>

      <p className="text-center text-sm text-gray-500 mt-2">
        Your card will be charged after confirmation
      </p>
    </form>
  );
};

// Main BookingPayment Component
const BookingPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const bookingDetails = location.state;

  useEffect(() => {
    if (!bookingDetails || !bookingDetails.trainDetails) {
      navigate("/");
    }
  }, [bookingDetails, navigate]);

  const getCompartmentPrice = () => {
    try {
      const compartment = bookingDetails.trainDetails.compartments.find(
        (comp) => comp.compartmentName === bookingDetails.compartment
      );
      return compartment ? compartment.price : 0;
    } catch (error) {
      console.error("Error calculating compartment price:", error);
      return 0;
    }
  };

  const calculateTotals = () => {
    try {
      const pricePerTicket = getCompartmentPrice();
      const subtotal = pricePerTicket * bookingDetails.passengers.length;
      const processingFee = subtotal * 0.1;
      const total = subtotal + processingFee;
      return { pricePerTicket, subtotal, processingFee, total };
    } catch (error) {
      console.error("Error calculating totals:", error);
      return { pricePerTicket: 0, subtotal: 0, processingFee: 0, total: 0 };
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    navigate("/");
    setLoading(false);
  };

  if (!bookingDetails || !bookingDetails.trainDetails) {
    return (
      <div>
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 mt-14">
          <h1 className="text-3xl font-bold text-center mb-6">Loading...</h1>
        </div>
        <Footer />
      </div>
    );
  }

  const { pricePerTicket, subtotal, processingFee, total } = calculateTotals();
  const bookingDate = new Date().toLocaleDateString();

  return (
    <div>
      <Navbar />
      {loading && <LoadingOverlay />}

      <div className="max-w-6xl mx-auto p-6 mt-14 pb-40">
        <h1 className="text-3xl font-bold text-center mb-8">
          Complete Your Payment
        </h1>

        <div className="flex flex-col md:flex-row gap-8 min-h-screen">
          {/* Booking Summary Section */}
          <div className="md:w-1/2 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
            <div className="space-y-3 mb-6">
              <p>
                <span className="font-semibold">Train Name:</span>{" "}
                {bookingDetails.trainDetails.trainName}
              </p>
              <p>
                <span className="font-semibold">Compartment:</span>{" "}
                {bookingDetails.compartment}
              </p>
              <p>
                <span className="font-semibold">Seat Numbers:</span>{" "}
                {bookingDetails.selectedSeats.join(", ")}
              </p>
              <p>
                <span className="font-semibold">Travel Date:</span>{" "}
                {bookingDetails.selectedDate}
              </p>
              <p>
                <span className="font-semibold">Booking Date:</span>{" "}
                {bookingDate}
              </p>
              <p>
                <span className="font-semibold">Primary Contact:</span>{" "}
                {bookingDetails.passengers[0].email}
              </p>
            </div>

            <div className="border-t pt-4 space-y-2">
              <p className="flex justify-between">
                <span>Ticket Price (per person)</span>
                <span>Rs. {pricePerTicket.toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <span>Number of Passengers</span>
                <span>× {bookingDetails.passengers.length}</span>
              </p>
              <p className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </p>
              <p className="flex justify-between text-gray-600">
                <span>Processing Fee (10%)</span>
                <span>Rs. {processingFee.toFixed(2)}</span>
              </p>
              <p className="flex justify-between text-xl font-bold border-t pt-2">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </p>
            </div>
          </div>

          {/* Payment Section */}
          <div className="md:w-1/2 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            <Elements stripe={stripePromise}>
              <PaymentForm
                bookingDetails={bookingDetails}
                calculateTotals={calculateTotals}
              />
            </Elements>

            <button
              className="mt-4 w-full bg-red-500 text-white py-3 rounded-lg 
                     hover:bg-red-600 transition-colors"
              onClick={handleCancel}
            >
              Cancel Booking
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingPayment;
