// API Serverless para Exportación - Vercel
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

// GET - Exportar leads
export async function GET(req) {
  try {
    if (!authenticate(req)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(req.url);
    const format = url.searchParams.get('format') || 'json';

    const client = await initClient();
    const { rows } = await client.query('SELECT * FROM leads ORDER BY created_at DESC');

    if (format === 'csv') {
      // Generar CSV
      let csv = 'ID,Fecha,Nombre,Email,Empresa,Teléfono,Tamaño,Mensaje,Estado,Fuente,Creado\n';
      
      rows.forEach(lead => {
        csv += `${lead.id},"${lead.timestamp}","${lead.nombre}","${lead.email}","${lead.empresa || ''}","${lead.telefono || ''}","${lead.tamano || ''}","${lead.mensaje || ''}","${lead.estado}","${lead.fuente}","${lead.created_at}"\n`;
      });

      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="orchestrai-leads.csv"'
        }
      });

    } else {
      // Generar JSON
      const exportData = {
        export_date: new Date().toISOString(),
        total_leads: rows.length,
        leads: rows
      };

      return new Response(JSON.stringify(exportData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="orchestrai-leads.json"'
        }
      });
    }

  } catch (error) {
    console.error('Error en GET /api/export:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
