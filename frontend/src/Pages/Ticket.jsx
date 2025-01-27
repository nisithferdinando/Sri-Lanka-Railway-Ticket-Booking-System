import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import { Download } from 'lucide-react';

const generateTicketId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `TKT-${timestamp.toUpperCase()}-${randomStr.toUpperCase()}`;
};

const Ticket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const ticketRef = useRef(null);

  useEffect(() => {
    const { bookingDetails, paymentId } = location.state || {};
    
    if (!bookingDetails) {
      navigate('/');
      return;
    }

    // Generate tickets for each passenger
    const generatedTickets = bookingDetails.passengers.map((passenger, index) => {
      const ticketId = generateTicketId();
      return {
        ticketId,
        paymentId,
        passengerName: passenger.name,
        trainName: bookingDetails.trainDetails.trainName,
        compartment: bookingDetails.compartment,
        seatNumber: bookingDetails.selectedSeats[index],
        travelDate: bookingDetails.selectedDate,
        bookingDate: new Date().toLocaleDateString()
      };
    });

    setTickets(generatedTickets);
  }, [location, navigate]);

  const downloadTicketsPDF = async () => {
    const doc = new jsPDF();
    
    for (let [index, ticket] of tickets.entries()) {
      // Generate QR Code for each ticket
      const qrData = JSON.stringify({
        ticketId: ticket.ticketId,
        trainName: ticket.trainName,
        travelDate: ticket.travelDate
      });
      const qrCodeUrl = await QRCode.toDataURL(qrData);

      // Add a new page for each ticket except the first
      if (index > 0) doc.addPage();

      // Ticket Design
      doc.setFontSize(16);
      doc.text('Train Ticket', 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(`Ticket ID: ${ticket.ticketId}`, 105, 30, { align: 'center' });

      // Ticket Details
      doc.autoTable({
        body: [
          ['Passenger Name', ticket.passengerName],
          ['Train Name', ticket.trainName],
          ['Compartment', ticket.compartment],
          ['Seat Number', ticket.seatNumber],
          ['Travel Date', ticket.travelDate],
          ['Booking Date', ticket.bookingDate]
        ],
        startY: 50,
        theme: 'plain'
      });

      // Add QR Code
      doc.addImage(qrCodeUrl, 'PNG', 160, 10, 30, 30);
    }

    doc.save('Train_Tickets.pdf');
  };

  if (tickets.length === 0) return null;

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 mt-14">
        <div className="flex justify-end gap-4 mb-4">
          <button 
            onClick={downloadTicketsPDF}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Download size={18} /> Download Tickets
          </button>
        </div>

        {tickets.map((ticket, index) => (
          <div 
            key={ticket.ticketId}
            className="bg-white shadow-lg rounded-lg p-8 border mb-6"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-blue-600">Train Ticket</h1>
                <p className="text-gray-600">Ticket ID: {ticket.ticketId}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-700">Passenger Details</h3>
                <p>Name: {ticket.passengerName}</p>
                <p>Train Name: {ticket.trainName}</p>
                <p>Compartment: {ticket.compartment}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Journey Details</h3>
                <p>Seat Number: {ticket.seatNumber}</p>
                <p>Travel Date: {ticket.travelDate}</p>
                <p>Booking Date: {ticket.bookingDate}</p>
              </div>
            </div>

            <div className="mt-6 text-center text-gray-500 text-sm">
              Payment ID: {ticket.paymentId}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Ticket;