const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const {connectDB} = require('./db');

const morgan = require('morgan');

const listingRoutes = require('./routes/listingRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const {authorize} = require("./middleware/authentication");

const app = express();

const port = process.env.PORT;

app.use(morgan('dev'));
app.use(morgan('method :url -> status=:status :response-time ms'));

app.use(express.json());

app.use("/api", listingRoutes);
app.use("/api", userRoutes);
app.use("/api", adminRoutes);
//app.use(authorize);
// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Redirect root to landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'landing.html'));
});

app.get('/opret/bolig', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'createListing.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'admin.html'));
});

app.get('/boligere', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'listings.html'));
})

connectDB();

app.listen(port, () => console.log('Server klar på http://localhost:3000'));