const { Pool } = require('@neondatabase/serverless');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

// Utility function to verify JWT token
function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  
  const token = authHeader.split(' ')[1];
  return jwt.verify(token, JWT_SECRET);
}

// Initialize database tables
async function initTables() {
  const client = await pool.connect();
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        budget DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Expenses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        date DATE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tasks table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'ongoing',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } finally {
    client.release();
  }
}

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    await initTables();

    const { action, username, password } = JSON.parse(event.body);
    const client = await pool.connect();

    try {
      if (action === 'signup') {
        // Check if user exists
        const existingUser = await client.query(
          'SELECT id FROM users WHERE username = $1',
          [username]
        );

        if (existingUser.rows.length > 0) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, message: 'Username already exists' })
          };
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await client.query(
          'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
          [username, hashedPassword]
        );

        const user = result.rows[0];
        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            token,
            user: { id: user.id, username: user.username }
          })
        };

      } else if (action === 'login') {
        // Find user
        const result = await client.query(
          'SELECT id, username, password_hash FROM users WHERE username = $1',
          [username]
        );

        if (result.rows.length === 0) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ success: false, message: 'Invalid username or password' })
          };
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ success: false, message: 'Invalid username or password' })
          };
        }

        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            token,
            user: { id: user.id, username: user.username }
          })
        };

      } else if (action === 'verify') {
        const decoded = verifyToken(event.headers.authorization);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            user: { id: decoded.userId, username: decoded.username }
          })
        };
      }

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Invalid action' })
      };

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};