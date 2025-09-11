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
        // Get all tasks for the user
        const result = await client.query(
          'SELECT id, name, description, start_date, end_date, status, created_at FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
          [decoded.userId]
        );

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            tasks: result.rows.map(row => ({
              id: row.id,
              name: row.name,
              description: row.description,
              start_date: row.start_date,
              end_date: row.end_date,
              status: row.status,
              created_at: row.created_at
            }))
          })
        };

      } else if (event.httpMethod === 'POST') {
        // Add new task
        const { name, description, start_date, end_date, status } = JSON.parse(event.body);
        
        const result = await client.query(
          'INSERT INTO tasks (user_id, name, description, start_date, end_date, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, description, start_date, end_date, status, created_at',
          [decoded.userId, name, description, start_date, end_date, status || 'ongoing']
        );

        const task = result.rows[0];

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            task: {
              id: task.id,
              name: task.name,
              description: task.description,
              start_date: task.start_date,
              end_date: task.end_date,
              status: task.status,
              created_at: task.created_at
            }
          })
        };

      } else if (event.httpMethod === 'PUT') {
        // Update task status
        const taskId = event.path.split('/').pop();
        const { status } = JSON.parse(event.body);
        
        const result = await client.query(
          'UPDATE tasks SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING id',
          [status, taskId, decoded.userId]
        );

        if (result.rows.length === 0) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, message: 'Task not found' })
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true })
        };

      } else if (event.httpMethod === 'DELETE') {
        // Delete task
        const taskId = event.path.split('/').pop();
        
        const result = await client.query(
          'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
          [taskId, decoded.userId]
        );

        if (result.rows.length === 0) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, message: 'Task not found' })
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
    console.error('Tasks error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};