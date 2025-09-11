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
        // Get all expenses for the user
        const result = await client.query(
          'SELECT id, name, amount, date, description, created_at FROM expenses WHERE user_id = $1 ORDER BY date DESC',
          [decoded.userId]
        );

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            expenses: result.rows.map(row => ({
              id: row.id,
              name: row.name,
              amount: parseFloat(row.amount),
              date: row.date,
              description: row.description,
              created_at: row.created_at
            }))
          })
        };

      } else if (event.httpMethod === 'POST') {
        // Add new expense
        const { name, amount, date, description } = JSON.parse(event.body);
        
        const result = await client.query(
          'INSERT INTO expenses (user_id, name, amount, date, description) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, amount, date, description, created_at',
          [decoded.userId, name, amount, date, description]
        );

        const expense = result.rows[0];

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            expense: {
              id: expense.id,
              name: expense.name,
              amount: parseFloat(expense.amount),
              date: expense.date,
              description: expense.description,
              created_at: expense.created_at
            }
          })
        };

      } else if (event.httpMethod === 'DELETE') {
        // Delete expense
        const expenseId = event.path.split('/').pop();
        
        const result = await client.query(
          'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id',
          [expenseId, decoded.userId]
        );

        if (result.rows.length === 0) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, message: 'Expense not found' })
          };
        }

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
    console.error('Expenses error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};