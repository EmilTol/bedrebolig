const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const {connectDB} = require('./db');

const morgan = require('morgan');

const app = express();

const port = process.env.PORT;

app.use(morgan('dev'));
app.use(morgan('method :url -> status=:status :response-time ms'));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// await connectDB();

connectDB();

app.listen(port, () => console.log('Server klar op http://localhost:3000'));