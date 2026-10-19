require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

  
const connectDB = require('./config/db');
const {
  notFound,
  errorHandler,
} = require('./middleware/errorMiddleware');

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Global middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hirely API is running',
    timestamp: new Date().toISOString(),
  });
});

// Authentication routes
app.use('/api/auth', require('./routes/authRoutes'));

// User profile routes
app.use('/api/users', require('./routes/userRoutes'));

// Freelancer browsing routes
app.use('/api/freelancers', require('./routes/freelancerRoutes'));

// Project management routes
app.use('/api/projects', require('./routes/projectRoutes'));

// Hiring request routes
app.use('/api/hiring-requests', require('./routes/hiringRoutes'));

// Contract and milestone routes
app.use('/api/contracts', require('./routes/contractRoutes'));

// Messaging routes
app.use('/api/messages', require('./routes/messageRoutes'));

// Notification routes
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Review and rating routes
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Saved freelancer routes
app.use('/api/saved-freelancers', require('./routes/savedFreelancerRoutes'));

// Dashboard routes
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Error handling middleware must be last
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `Hirely API listening on port ${PORT} [${
          process.env.NODE_ENV || 'development'
        }]`
      );
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

// Start the server when this file is executed directly.
// Export app for testing without automatically starting the server.
if (require.main === module) {
  startServer();
}

module.exports = app;
