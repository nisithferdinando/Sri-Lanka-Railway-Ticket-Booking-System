const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const qrcode = require("qrcode");

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Compile the email template
const compileTemplate = (templateName, data) => {
  const templatePath = path.join(
    __dirname,
    "..",
    "templates",
    `${templateName}.html`
  );
  const source = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(source);
  return template(data);
};

// Generate QR code data URL
const generateQRCode = async (ticketData) => {
  try {
    return await qrcode.toBuffer(JSON.stringify(ticketData), {
      width: 128,
      margin: 2,
      errorCorrectionLevel: "H",
    });
  } catch (error) {
    console.error("QR code generation error:", error);
    throw error;
  }
};

// Send ticket email
const sendTicketEmail = async (emailData) => {
  try {
    const { to, subject, tickets } = emailData;
    let attachments = [];

    for (let i = 0; i < tickets.length; i++) {
      const qrBuffer = await generateQRCode({
        ticketId: tickets[i].ticketId,
        passengerName: tickets[i].passengerName,
        trainName: tickets[i].trainName,
        seatNumber: tickets[i].seatNumber,
        compartment: tickets[i].compartment,
        travelDate: tickets[i].travelDate,
      });

      const cid = `qrcode-${i}@trainbooking`;

      attachments.push({
        filename: `qrcode-${i}.png`,
        content: qrBuffer,
        encoding: "base64",
        cid: cid,
      });

      tickets[i].qrCode = `cid:${cid}`;
    }

    // Compile the email template
    const html = compileTemplate("ticket-email", {
      tickets,
      bookingDate: new Date().toLocaleDateString(),
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"Train Booking" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });

    console.log("Email sent: %s", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendTicketEmail,
};
