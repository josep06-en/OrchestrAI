// API Serverless para Estadísticas - Vercel
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

// GET - Obtener estadísticas
export async function GET(req) {
  try {
    if (!authenticate(req)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const client = await initClient();
    
    // Obtener estadísticas
    const totalResult = await client.query('SELECT COUNT(*) as total FROM leads');
    const nuevosResult = await client.query("SELECT COUNT(*) as nuevos FROM leads WHERE estado = 'Nuevo Lead'");
    const contactadosResult = await client.query("SELECT COUNT(*) as contactados FROM leads WHERE estado = 'Contactado'");
    const agendadosResult = await client.query("SELECT COUNT(*) as agendados FROM leads WHERE estado = 'Auditoría Agendada'");
    const convertidosResult = await client.query("SELECT COUNT(*) as convertidos FROM leads WHERE estado = 'Convertido'");

    const stats = {
      total_leads: parseInt(totalResult.rows[0].total),
      nuevos_leads: parseInt(nuevosResult.rows[0].nuevos),
      contactados_leads: parseInt(contactadosResult.rows[0].contactados),
      agendados_leads: parseInt(agendadosResult.rows[0].agendados),
      convertidos_leads: parseInt(convertidosResult.rows[0].convertidos)
    };
    
    return new Response(JSON.stringify({
      status: 'success',
      data: stats
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error en GET /api/stats:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
