const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const appRoutes = require('./routes/appRoutes');
const path = require('path')
const fs = require('fs')

const app = express();
const port = 2354;

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

const iconsDir = path.join(__dirname, 'public', 'icons');

app.use('/icons', express.static(iconsDir));

// Use Routes
app.use('/', appRoutes);

app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
});
