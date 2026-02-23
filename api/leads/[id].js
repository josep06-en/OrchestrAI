// API Serverless para Eliminar Lead por ID - Vercel
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

// DELETE - Eliminar lead por ID
export async function DELETE(req) {
  try {
    if (!authenticate(req)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); // Extraer ID de /api/leads/[id]
    
    if (!id) {
      return new Response(JSON.stringify({
        status: 'error',
        message: 'ID del lead es requerido'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const client = await initClient();
    const result = await client.query('DELETE FROM leads WHERE id = $1', [id]);

    return new Response(JSON.stringify({
      status: 'success',
      message: 'Lead eliminado exitosamente',
      deleted_id: id,
      changes: result.rowCount
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error en DELETE /api/leads/[id]:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
