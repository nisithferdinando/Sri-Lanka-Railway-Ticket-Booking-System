import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from "../../Components/Footer/Footer";
import { CreditCard, Loader } from 'lucide-react';
import LoadingOverlay from '../../Utilities/LoadingOverlay';
import Navbars from './Navbars';

const BookingPaymentS = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state;
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!bookingDetails || !bookingDetails.trainDetails) {
      navigate('/review-booking');
    }
  }, [bookingDetails, navigate]);

  if (!bookingDetails || !bookingDetails.trainDetails) {
    return (
      <div>
        <Navbars />
        <div className="max-w-4xl mx-auto p-6 mt-14">
          <h1 className="text-3xl font-bold text-center mb-6">Loading...</h1>
        </div>
        <Footer />
      </div>
    );
  }

  const [paymentDetails, setPaymentDetails] = useState({
    cardHolder: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: ''
  });

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

  const { pricePerTicket, subtotal, processingFee, total } = calculateTotals();

  const bookingDate = new Date().toLocaleDateString();

  const validateForm = () => {
    const newErrors = {};

    if (!agreed) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    if (!paymentDetails.cardHolder.trim()) {
      newErrors.cardHolder = 'Card holder name is required';
    }

    if (!paymentDetails.cardNumber.match(/^\d{16}$/)) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    if (!paymentDetails.expiryMonth) {
      newErrors.expiryMonth = 'Expiry month is required';
    }

    if (!paymentDetails.expiryYear) {
      newErrors.expiryYear = 'Expiry year is required';
    }

    if (!paymentDetails.cvc.match(/^\d{3}$/)) {
      newErrors.cvc = 'CVC must be 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
      navigate('/confirmation');
    }
  };

  const renderSeatNumbers = () => {
    return bookingDetails.passengers.map(p => p.seatNumber).join(', ');
  };

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
              <p><span className="font-semibold text-sm">දුම්රිය:</span> {bookingDetails.trainDetails.trainNameS}</p>
              <p><span className="font-semibold text-sm">මැදිරිය:</span> {bookingDetails.compartment}</p>
              <p><span className="font-semibold text-sm">ආසන අංක:</span> {renderSeatNumbers()}</p>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Card Holder's Name</label>
                <input
                  type="text"
                  name="cardHolder"
                  className={`w-full border rounded-lg p-2 ${
                    errors.cardHolder ? 'border-red-500' : ''
                  }`}
                  value={paymentDetails.cardHolder}
                  onChange={handleInputChange}
                />
                {errors.cardHolder && <p className="text-red-500 text-sm">{errors.cardHolder}</p>}
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  <div className="flex justify-between items-center">
                    <span>Card Number</span>
                    <div className="flex gap-2">
                      <CreditCard className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  maxLength="16"
                  className={`w-full border rounded-lg p-2 ${
                    errors.cardNumber ? 'border-red-500' : ''
                  }`}
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={paymentDetails.cardNumber}
                  onChange={handleInputChange}
                  
                />
                
                {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
              </div>
              <div className="flex gap-4">
                <div className="w-2/3">
                  <label className="block text-gray-700 mb-2">Expiration Date</label>
                  <div className="flex gap-2">
                    <select
                      name="expiryMonth"
                      className={`w-full border rounded-lg p-2 ${
                        errors.expiryMonth ? 'border-red-500' : ''
                      }`}
                      value={paymentDetails.expiryMonth}
                      onChange={handleInputChange}
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <option key={month} value={month.toString().padStart(2, '0')}>
                          {month.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <select
                      name="expiryYear"
                      className={`w-full border rounded-lg p-2 ${
                        errors.expiryYear ? 'border-red-500' : ''
                      }`}
                      value={paymentDetails.expiryYear}
                      onChange={handleInputChange}
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="w-1/3">
                  <label className="block text-gray-700 mb-2">CVC</label>
                  <input
                    type="text"
                    name="cvc"
                    maxLength="3"
                    className={`w-full border rounded-lg p-2 ${
                      errors.cvc ? 'border-red-500' : ''
                    }`}
                    value={paymentDetails.cvc}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                  }}
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the terms and conditions
                </label>
              </div>
              {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                disabled={loading}
              >
                {`Pay Rs. ${total.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingPaymentS;
