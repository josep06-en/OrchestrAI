// API Serverless para Actualizar Estado de Lead - Vercel
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

// PUT - Actualizar estado de lead
export async function PUT(req) {
  try {
    if (!authenticate(req)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(req.url);
    const id = url.pathname.split('/').filter(Boolean).slice(-2, -1)[0]; // Extraer ID de /api/leads/[id]/status
    
    if (!id) {
      return new Response(JSON.stringify({
        status: 'error',
        message: 'ID del lead es requerido'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { estado } = await req.json();
    
    if (!estado) {
      return new Response(JSON.stringify({
        status: 'error',
        message: 'Estado es requerido'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const client = await initClient();
    const result = await client.query(
      'UPDATE leads SET estado = $1 WHERE id = $2',
      [estado, id]
    );

    return new Response(JSON.stringify({
      status: 'success',
      message: 'Estado actualizado exitosamente',
      updated_id: id,
      new_estado: estado,
      changes: result.rowCount
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error en PUT /api/leads/[id]/status:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
