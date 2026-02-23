// API Serverless para Leads - Vercel
const { createClient } = require('@vercel/postgres');
const nodemailer = require('nodemailer');

// Configuración de email
const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: 'jenriquellopis@gmail.com',
    pass: 'tuha tyij klfj qppy'
  }
};

const ADMIN_EMAIL = 'jenriquellopis@gmail.com';

// Transportador de email
const transporter = nodemailer.createTransporter(EMAIL_CONFIG);

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

// Enviar email de notificación
async function sendNewLeadEmail(leadData) {
  try {
    const mailOptions = {
      from: EMAIL_CONFIG.auth.user,
      to: ADMIN_EMAIL,
      subject: `🚀 Aviso nuevo lead - ${leadData.nombre} - ${leadData.empresa}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #111110; color: #fafaf7; padding: 20px; border-radius: 8px;">
            <h1 style="margin: 0; font-size: 24px;">🚀 Nuevo Lead Recibido</h1>
            <p style="margin: 10px 0; color: #d4af37;">OrchestrAI - Automatización con IA</p>
          </div>
          
          <div style="background: #fafaf7; padding: 20px; border: 1px solid #d0cdc4; border-radius: 8px; margin-top: 20px;">
            <h2 style="color: #111110; margin-bottom: 20px;">📊 Información del Lead</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #d0cdc4; font-weight: bold; color: #7a7870;">Nombre:</td>
                <td style="padding: 10px; border-bottom: 1px solid #d0cdc4;">${leadData.nombre}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #d0cdc4; font-weight: bold; color: #7a7870;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #d0cdc4; color: #2980b9;">${leadData.email}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #d0cdc4; font-weight: bold; color: #7a7870;">Empresa:</td>
                <td style="padding: 10px; border-bottom: 1px solid #d0cdc4;">${leadData.empresa || 'No especificada'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #d0cdc4; font-weight: bold; color: #7a7870;">Teléfono:</td>
                <td style="padding: 10px; border-bottom: 1px solid #d0cdc4;">${leadData.telefono || 'No especificado'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #d0cdc4; font-weight: bold; color: #7a7870;">Tamaño:</td>
                <td style="padding: 10px; border-bottom: 1px solid #d0cdc4;">${leadData.tamano || 'No especificado'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #7a7870;">Mensaje:</td>
                <td style="padding: 10px;">${leadData.mensaje || 'No especificado'}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #111110; color: #fafaf7; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center;">
            <h3 style="margin: 0; font-size: 18px;">🎯 Próximos Pasos</h3>
            <p style="margin: 10px 0;">1. Contactar al lead en menos de 24 horas</p>
            <p style="margin: 10px 0;">2. Agendar auditoría gratuita</p>
            <p style="margin: 10px 0;">3. Preparar propuesta personalizada</p>
            
            <div style="margin-top: 20px;">
              <a href="https://orchestrai.vercel.app/leads-dashboard.html" 
                 style="background: #d4af37; color: #111110; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                📊 Ver Dashboard de Leads
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #7a7870; font-size: 12px;">
            <p>Este email se generó automáticamente desde el sistema de leads de OrchestrAI</p>
            <p>Fecha: ${new Date().toLocaleString('es-ES')}</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email de notificación enviado:', result.messageId);
    
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return { success: false, error: error.message };
  }
}

// Middleware de autenticación
function authenticate(req) {
  const authKey = req.headers['x-auth-key'];
  return authKey === 'orchestrAI_secure_2024';
}

// GET - Obtener todos los leads
export async function GET(req) {
  try {
    if (!authenticate(req)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const client = await initClient();
    const { rows } = await client.query('SELECT * FROM leads ORDER BY created_at DESC');
    
    return new Response(JSON.stringify({
      status: 'success',
      data: rows
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error en GET /api/leads:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST - Crear nuevo lead
export async function POST(req) {
  try {
    if (!authenticate(req)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const leadData = await req.json();
    
    // Validar datos requeridos
    if (!leadData.nombre || !leadData.email) {
      return new Response(JSON.stringify({
        status: 'error',
        message: 'Nombre y email son requeridos'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const client = await initClient();
    
    // Insertar lead en base de datos
    const result = await client.query(`
      INSERT INTO leads (timestamp, nombre, email, empresa, telefono, tamano, mensaje, estado, fuente)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [
      leadData.timestamp || new Date().toISOString(),
      leadData.nombre,
      leadData.email,
      leadData.empresa || '',
      leadData.telefono || '',
      leadData.tamano || '',
      leadData.mensaje || '',
      leadData.estado || 'Nuevo Lead',
      leadData.fuente || 'web'
    ]);

    const newLeadId = result.rows[0].id;
    console.log(`✅ Lead guardado con ID: ${newLeadId}`);

    // Enviar email de notificación
    try {
      const emailResult = await sendNewLeadEmail(leadData);
      if (emailResult.success) {
        console.log('✅ Email de notificación enviado');
      } else {
        console.error('❌ Error enviando email:', emailResult.error);
      }
    } catch (emailError) {
      console.error('❌ Error crítico enviando email:', emailError);
    }

    return new Response(JSON.stringify({
      status: 'success',
      message: 'Lead guardado exitosamente',
      data: {
        id: newLeadId,
        ...leadData
      }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error en POST /api/leads:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE - Eliminar lead
export async function DELETE(req) {
  try {
    if (!authenticate(req)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    
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
    console.error('Error en DELETE /api/leads:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
