import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, Train, User, Calendar, CreditCard } from 'lucide-react';
import jsPDF from 'jspdf';
import qrcode from 'qrcode';
import img from "../assets/img1.png";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

const generateTicketId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `TKT-${timestamp.toUpperCase()}-${randomStr.toUpperCase()}`;
};

const Ticket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [qrCodes, setQrCodes] = useState({});
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeTickets = async () => {
      try {
        const { bookingDetails, paymentId } = location.state || {};
        
        if (!bookingDetails) {
          navigate('/');
          return;
        }

        const generatedTickets = bookingDetails.passengers.map((passenger, index) => ({
          ticketId: generateTicketId(),
          paymentId,
          passengerName: passenger.name,
          trainName: bookingDetails.trainDetails.trainName,
          compartment: bookingDetails.compartment,
          seatNumber: bookingDetails.selectedSeats[index],
          travelDate: bookingDetails.selectedDate,
          startStation: bookingDetails.trainDetails.startStation,
          endStation: bookingDetails.trainDetails.endStation,
          bookingDate: new Date().toLocaleDateString()
        }));

        setTickets(generatedTickets);
        await generateQRCodes(generatedTickets);
        setLoading(false);
      } catch (err) {
        setError('Failed to initialize tickets');
        setLoading(false);
      }
    };

    initializeTickets();
  }, [location, navigate]);

  const generateQRCodes = async (tickets) => {
    try {
      const codes = {};
      for (const ticket of tickets) {
        const qrData = JSON.stringify({
          ticketId: ticket.ticketId,
          passengerName: ticket.passengerName,
          trainName: ticket.trainName,
          seatNumber: ticket.seatNumber,
          compartment: ticket.compartment,
          travelDate: ticket.travelDate
        });

        codes[ticket.ticketId] = await qrcode.toDataURL(qrData, {
          width: 128,
          margin: 2,
          errorCorrectionLevel: 'H'
        });
      }
      setQrCodes(codes);
    } catch (error) {
      console.error('Error generating QR codes:', error);
      setError('Failed to generate QR codes');
    }
  };

  const downloadSingleTicket = async (ticket) => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a5'
      });

      // White background
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

      // logo
      doc.addImage(img, 'PNG', 15, 15, 20, 20);

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(25, 103, 210);
      doc.text('Train Ticket', 40, 28);

      // Ticket ID
      doc.setFontSize(12);
      doc.setTextColor(100, 116, 139);
      doc.text(`Ticket ID: ${ticket.ticketId}`, 40, 35);

      // QR Code
      const qrCode = qrCodes[ticket.ticketId];
      if (qrCode) {
        doc.addImage(qrCode, 'PNG', 180, 15, 25, 25);
      }

      // Seat Number 
      doc.setFillColor(59, 130, 246);
      doc.roundedRect(15, 45, 60, 50, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text('Seat Number', 45, 60, { align: 'center' });
      doc.setFontSize(24);
      doc.text(ticket.seatNumber, 45, 75, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Compartment: ${ticket.compartment}`, 45, 85, { align: 'center' });

      // Passenger Details
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(85, 45, 55, 50, 3, 3, 'F');
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(14);
      doc.text('Passenger', 112.5, 55, { align: 'center' });
      doc.setFontSize(12);
      doc.text(ticket.passengerName, 112.5, 65, { align: 'center' });
      doc.text(`Booking Date:`, 112.5, 75, { align: 'center' });
      doc.text(ticket.bookingDate, 112.5, 82, { align: 'center' });

      // Journey Details
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(150, 45, 55, 50, 3, 3, 'F');
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(14);
      doc.text('Journey', 177.5, 55, { align: 'center' });
      doc.setFontSize(12);
      doc.text(ticket.trainName, 177.5, 65, { align: 'center' });
      doc.text(ticket.travelDate, 177.5, 75, { align: 'center' });

      // Payment ID
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(10);
      doc.text(`Payment ID: ${ticket.paymentId}`, 15, 105);

      doc.save(`Train_Ticket_${ticket.ticketId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF ticket');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className='flex justify-end mt-8 mr-12'>
          <button 
          onClick={() => navigate('/')}
          className='px-3 py-2 bg-slate-200 rounded-lg text-slate-800 text-lg hover:bg-slate-400 transition-colors duration-200 '>Home</button>
          </div>
      <div className="max-w-[875px] mx-auto p-6 mt-14">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-600 text-center">Your Train Tickets</h1>
          <p className="text-center text-gray-600 mt-2">Your journey begins here</p>
        </div>

        {tickets.map((ticket) => (
          <div 
            key={ticket.ticketId}
            className="bg-white shadow-lg rounded-xl p-8 border mb-6 hover:shadow-xl transition-shadow"
          >
            {/* Header with Logo and QR */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <img
                    src={img}
                    alt="Logo"
                    className="w-16 h-16 object-contain"
                  />
                  <div>
                    <h2 className="text-3xl font-bold text-blue-600">Train Ticket</h2>
                    <p className="text-gray-600">Ticket ID: {ticket.ticketId}</p>
                  </div>
                </div>
              </div>
              {qrCodes[ticket.ticketId] && (
                <img 
                  src={qrCodes[ticket.ticketId]} 
                  alt="Ticket QR Code"
                  className="w-24 h-24"
                />
              )}
            </div>

            {/* Ticket Content */}
            <div className="grid grid-cols-3 gap-6">
              {/* Seat Details */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg text-center shadow-md">
                <Train size={24} className="mx-auto mb-2" />
                <p className="text-md">Seat Number</p>
                <p className="text-2xl font-bold">{ticket.seatNumber}</p>
                <p className="text-md mt-2">Compartment: {ticket.compartment}</p>
              </div>

              {/* Passenger and Journey Details */}
              <div className="col-span-2 grid grid-cols-2 gap-4">
                
                <div className="bg-green-50 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={20} className="text-green-600" />
                    <h3 className="font-semibold text-gray-700">Journey</h3>
                  </div>
                  <p className="text-gray-800 font-medium">Train: {ticket.trainName}</p>
                  <p className="text-gray-700 text-base">Travel Date: {ticket.travelDate}</p>
                  <p className="text-gray-600 text-base">Start: {ticket.startStation}</p>
                  <p className="text-gray-600 text-base">End: {ticket.endStation}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={20} className="text-blue-600" />
                    <h3 className="font-semibold text-gray-700">Passenger</h3>
                  </div>
                  <p className="text-gray-600 font-medium"> Name: {ticket.passengerName}</p>
                  <p className="text-gray-600">Booking Date: {ticket.bookingDate}</p>
                </div>

              </div>
            </div>

            {/*Download Button */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <CreditCard size={16} />
                <span>Payment ID: {ticket.paymentId}</span>
              </div>
              <button 
                onClick={() => downloadSingleTicket(ticket)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
              >
                <Download size={18} /> Download Ticket
              </button>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Ticket;