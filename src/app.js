const express = require('express');
const { sequelize, connectToDatabase } = require('./config/db');
//const  Log = require('./models/logModel');  // Correct import
const app = express();
const port = 3000;
const validateRequest = require('./middlewares/validateRequest');
const { body } = require('express-validator');
const agentRoutes = require('../src/routes/agentRoutes');
const logIngestRoutes= require('../src/routes/logRoutes');

app.use(express.json());

// Health check route to verify database connectivity
app.get('/dbHealth', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const [result] = await database.query('SELECT * FROM logs');
    res.json({
      message: 'Database is connected', 
      dbStatus: result
    });
  } catch (error) {
    console.error('Database health check failed:', error.message);
    res.status(500).json({ 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

app.get('/modelAlignTb', async (req, res) => {
  try {
    // Authenticate DB connection
    await sequelize.authenticate();
    console.log('Database connection successful.');

    // Retrieve table metadata
    const tableDescription = await sequelize.queryInterface.describeTable('logs');
    
    res.json({
      tableMetadata: tableDescription,
    });
    
    console.log('Model metadata retrieved successfully');
  } catch (error) {
    console.error('Model alignment test failed:', error.message);
    res.status(500).json({ 
      error: 'Model alignment test failed', 
      details: error.message 
    });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// Initialize database and start server
const initializeApp = async () => {
  try {
    await connectToDatabase();
    // Sync models with database
    await sequelize.sync({ force: false });
    console.log('Models synchronized with database');
    
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
};

app.post(
  '/test-validate',
  validateRequest([
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
  ]),
  (req, res) => {
    res.json({ success: true, message: 'Validation passed!' });
  }
);

app.use('/api/agents', agentRoutes);
app.use('/api/logs', logIngestRoutes);
initializeApp();

module.exports = app;