// API Serverless para Logs - Vercel
const { createClient } = require('@vercel/postgres');

// Cliente de base de datos
let client;

// Inicializar cliente de base de datos
async function initClient() {
  if (!client) {
    client = createClient();
    await client.connect();
  }
  return client;
}

// Middleware de autenticación
function authenticate(req) {
  const authKey = req.headers['x-auth-key'];
  return authKey === 'orchestrAI_secure_2024';
}

// GET - Obtener logs
export async function GET(req) {
  try {
    if (!authenticate(req)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const client = await initClient();
    const { rows } = await client.query(`
      SELECT * FROM logs 
      ORDER BY created_at DESC 
      LIMIT 50
    `);
    
    return new Response(JSON.stringify({
      status: 'success',
      data: rows
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error en GET /api/logs:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
