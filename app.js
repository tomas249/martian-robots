const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const path = require('path');

// Routes index
const routes = require('./routes/index');
const routesViews = require('./routes/indexViews');

// Load env vars
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

// Connect to database
connectDB();

// Load express
const app = express();

// Body parser
app.use(express.json({ limit: '10MB' }));
app.use(express.urlencoded({ extended: true }));

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Set static folders
app.use(express.static(path.join(__dirname, 'instruction_files')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));

// Mount routes
app.use('/', routesViews);
app.use('/api', routes);

app.use('**', (req, res) => {
  res.send({ Error: 'Page was not found' });
});

// Run server
const PORT = process.env.PORT || 3000;
const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
