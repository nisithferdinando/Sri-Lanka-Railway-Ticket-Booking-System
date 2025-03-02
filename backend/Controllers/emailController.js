const { sendTicketEmail } = require('../services/emailservice');

// Send tickets via email
const sendTickets = async (req, res) => {
  try {
    const { email, tickets } = req.body;
    
    if (!email || !tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and ticket data are required' 
      });
    }
    
    // Send email with tickets
    const emailResult = await sendTicketEmail({
      to: email,
      subject: 'Your Train Tickets',
      tickets
    });
    
    if (emailResult.success) {
      return res.status(200).json({ 
        success: true, 
        message: 'Tickets sent successfully',
        messageId: emailResult.messageId
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send tickets via email',
        error: emailResult.error
      });
    }
  } catch (error) {
    console.error('Error sending tickets via email:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  sendTickets
};