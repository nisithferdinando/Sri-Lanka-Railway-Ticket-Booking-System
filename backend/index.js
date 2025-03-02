const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const connectDB=require('./db/db');
const authRoutes=require('./Routes/authRoutes');
const trainRoutes = require('./Routes/trainRoutes');
const selectRoutes = require('./Routes/selectRoutes');
const bookingRoutes=require('./Routes/bookingRoutes')
const paymentRoutes= require('./Routes/paymentRoutes')
const emailRoutes=require('./Routes/emailRoutes')
const adminAuthRoutes=require('./Routes/admin/adminAuthRoutes')

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/auth',authRoutes);
app.use('/api/trains', trainRoutes); 
app.use('/api/trains',selectRoutes);
app.use('/api/booking',bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/adminAuth',adminAuthRoutes);


const PORT= process.env.PORT || 8000;
app.listen(PORT);


