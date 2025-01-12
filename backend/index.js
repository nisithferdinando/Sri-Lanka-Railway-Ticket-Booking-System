const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const connectDB=require('./db/db');
const authRoutes=require('./Routes/authRoutes');
const trainRoutes = require('./Routes/trainRoutes');
const selectRoutes = require('./Routes/selectRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/auth',authRoutes);
app.use('/api/trains', trainRoutes); 
app.use('/api/trains',selectRoutes);


const PORT= process.env.PORT || 8000;
app.listen(PORT);


