import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Footer from "../../Components/Footer/Footer";
import { CreditCard, Loader } from 'lucide-react';
import LoadingOverlay from '../../Utilities/LoadingOverlay';
import Navbars from './Navbars';
import axiosInstance from '../../Utilities/axiosInstance';

const stripePromise = loadStripe('pk_test_51QDRwlCv9h4sHdoFbCahB7FUr4J7Due8oEsyMxlfvSQF0WmxhwRwXS8OG4aWTmqrotwOB6watlY3i6q5aOZxHGVS00sLiQFPF2');

const cardStyle = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  }
};
const PaymentForm = ({ bookingDetails, calculateTotals }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !agreed) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');
      const { total } = calculateTotals();

      // Create payment intent
      const intentResponse = await axiosInstance.post('/api/payment/create-payment-intent', {
        amount: Math.round(total * 100), // Convert to cents
        currency: 'inr'
      });

      // Confirm card payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        intentResponse.data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: username,
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      // book the seats
      const bookingResponse = await axiosInstance.post(
        `/api/trains/${bookingDetails.trainId}/compartment/${bookingDetails.compartment}/book`,
        {
          seatNumbers: bookingDetails.selectedSeats,
          selectedDate: bookingDetails.selectedDate,
          userId,
          username,
          paymentIntentId: paymentIntent.id
        }
      );

      if (bookingResponse.data.success) {
        // Save booking details
        const savedBooking = await axiosInstance.post('/api/booking/saveBooking', {
          userId,
          trainName: bookingDetails.trainDetails.trainName,
          compartment: bookingDetails.compartment,
          seatNumbers: bookingDetails.selectedSeats,
          selectedDate: bookingDetails.selectedDate,
          status: 'active',
          paymentIntentId: paymentIntent.id,
          amount: total
        });

        // Navigate to tickets page
        navigate('/tickets', {
          state: {
            bookingDetails,
            bookingResponse: bookingResponse.data,
            bookingId: savedBooking.data.bookingId,
            paymentId: paymentIntent.id
          }
        });
      } else {
        throw new Error('Booking failed after payment');
      }
    } catch (error) {
      console.error('Payment/Booking Error:', error);
      setError(error.message || 'An error occurred during payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border rounded-md p-4">
        <CardElement 
          options={cardStyle}
          onChange={(e) => setCardComplete(e.complete)}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="terms"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I agree to the terms and conditions
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading || !agreed || !cardComplete}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 
                 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed
                 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pay Rs. {calculateTotals().total.toFixed(2)}
          </>
        )}
      </button>
    </form>
  );
};

const BookingPaymentS = () => {
  const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const bookingDetails = location.state;

  useEffect(() => {
     if (!bookingDetails || !bookingDetails.trainDetails) {
       navigate('/');
     }
   }, [bookingDetails, navigate]);


  const getCompartmentPrice = () => {
    try {
      const compartment = bookingDetails.trainDetails.compartments.find(
        comp => comp.compartmentName === bookingDetails.compartment
      );
      return compartment ? compartment.price : 0;
    } catch (error) {
      console.error('Error calculating compartment price:', error);
      return 0;
    }
  };

  const calculateTotals = () => {
    try {
      const pricePerTicket = getCompartmentPrice();
      const subtotal = pricePerTicket * bookingDetails.passengers.length;
      const processingFee = subtotal * 0.10;
      const total = subtotal + processingFee;
      return { pricePerTicket, subtotal, processingFee, total };
    } catch (error) {
      console.error('Error calculating totals:', error);
      return { pricePerTicket: 0, subtotal: 0, processingFee: 0, total: 0 };
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/');
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

 /* const renderSeatNumbers = () => {
    return bookingDetails.passengers.map(p => p.seatNumber).join(', ');
  }; */

  return (
    <div>
      <Navbars />
      {loading && <LoadingOverlay/>}
      <div className="max-w-6xl mx-auto p-6 mt-14 pb-40">
        <h1 className="text-2xl font-bold text-center mb-8 text-slate-800">ඔබගේ ගෙවීම සම්පූර්ණ කරන්න</h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">ගමන් සාරාංශය</h2>
            <div className="space-y-3 mb-6">
              <p><span className="font-semibold text-sm">දුම්රිය:</span> {bookingDetails.trainDetails.trainName}</p>
              <p><span className="font-semibold text-sm">මැදිරිය:</span> {bookingDetails.compartment}</p>
              <p><span className="font-semibold text-sm">ආසන අංක:</span> {bookingDetails.selectedSeats.join(', ')}</p>
              <p><span className="font-semibold text-sm">ගමන් දිනය:</span> {bookingDetails.selectedDate}</p>
              <p><span className="font-semibold text-sm">අනවුම් දිනය:</span> {bookingDate}</p>
              <p><span className="font-semibold text-sm">මූලික සම්බන්ධාකරුවා:</span> {bookingDetails.passengers[0].email}</p>
            </div>
            <div className="border-t pt-4 space-y-2">
              <p className="flex justify-between">
                <span>ටිකට් පතක මිල</span>
                <span>Rs. {pricePerTicket.toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <span>මගීන් ගණන</span>
                <span>× {bookingDetails.passengers.length}</span>
              </p>
              <p className="flex justify-between font-semibold">
                <span>මුදල</span>
                <span>රු. {subtotal.toFixed(2)}</span>
              </p>
              <p className="flex justify-between text-gray-600">
                <span>සැකසුම් ගාස්තුව (10%)</span>
                <span>රු. {processingFee.toFixed(2)}</span>
              </p>
              <p className="flex justify-between text-lg font-bold border-t pt-2">
                <span>මුළු මුදල </span>
                <span>රු. {total.toFixed(2)}</span>
              </p>
            </div>
          </div>

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

export default BookingPaymentS;
