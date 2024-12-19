const express = require('express');
const connectToDatabase = require('./config/db');
const app = express();
const port = 3000;

app.use(express.json());

//Health check route to verify database connectivity
app.get('/dbHealth', async (req, res) => {
  try
  {
    const pool = await connectToDatabase();
    const result = await pool.query('SELECT * FROM AGENTS');
    res.json({message: 'Database is connected', dbStatus: result.rows});
  }
  catch(error){
    console.error('Database health check failed:', error.message);
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
})

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});