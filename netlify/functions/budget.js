const { Pool } = require('@neondatabase/serverless');
const jwt = require('jsonwebtoken');

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
    const decoded = verifyToken(event.headers.authorization);
    const client = await pool.connect();

    try {
      if (event.httpMethod === 'GET') {
        // Get user's budget
        const result = await client.query(
          'SELECT budget FROM users WHERE id = $1',
          [decoded.userId]
        );

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            budget: result.rows[0] ? parseFloat(result.rows[0].budget) : 0
          })
        };

      } else if (event.httpMethod === 'PUT') {
        // Update user's budget
        const { budget } = JSON.parse(event.body);
        
        await client.query(
          'UPDATE users SET budget = $1 WHERE id = $2',
          [budget, decoded.userId]
        );

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true })
        };
      }

      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ success: false, message: 'Method not allowed' })
      };

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Budget error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};