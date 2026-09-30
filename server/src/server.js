require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const { initSocket } = require('./socket');

// Route files
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const userRoutes = require('./routes/userRoutes');
const companyRoutes = require('./routes/companyRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const httpServer = http.createServer(app);

// Initialize Socket.IO
initSocket(httpServer);

// Connect Database
connectDB();

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded resumes
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);


// Direct alias for sequence diagram: GET /api/employer/applications
const { protect } = require('./middleware/authMiddleware');
const { authorize } = require('./middleware/roleMiddleware');
const { getEmployerApplications } = require('./controllers/applicationController');
app.get('/api/employer/applications', protect, authorize('employer'), getEmployerApplications);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Job Board API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Internal Error',
  });
});

const PORT = process.env.PORT || 5000;
const server = httpServer.listen(PORT, () => {
  console.log(`🚀 Job Board Server running on port ${PORT}`);
  console.log(`📡 API Endpoints available at http://localhost:${PORT}/api`);
});

// Server entry point
module.exports = { app, httpServer, server };

