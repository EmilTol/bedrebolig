const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const {connectDB} = require('./db');

const morgan = require('morgan');

const listingRoutes = require('./routes/listingRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

const port = process.env.PORT;

app.use(morgan('dev'));
app.use(morgan('method :url -> status=:status :response-time ms'));

app.use(express.json());

app.use("/api", listingRoutes);
app.use("/api", userRoutes);

app.use(express.static(path.join(__dirname, 'public')));


connectDB();

app.listen(port, () => console.log('Server klar på http://localhost:3000'));