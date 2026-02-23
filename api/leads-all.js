// API Serverless para Leads - Vercel (Función unificada)
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
              <a href="https://0rchestrai.vercel.app/leads-dashboard.html" 
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

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Key');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const client = await initClient();

    // GET - Obtener todos los leads
    if (req.method === 'GET') {
      if (!authenticate(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { rows } = await client.query('SELECT * FROM leads ORDER BY created_at DESC');
      return res.status(200).json({
        status: 'success',
        data: rows
      });
    }

    // POST - Crear nuevo lead
    if (req.method === 'POST') {
      if (!authenticate(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const body = req.body;
      const leadData = body;
      
      // Validar datos requeridos
      if (!leadData.nombre || !leadData.email) {
        return res.status(400).json({
          status: 'error',
          message: 'Nombre y email son requeridos'
        });
      }

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

      return res.status(201).json({
        status: 'success',
        message: 'Lead guardado exitosamente',
        data: {
          id: newLeadId,
          ...leadData
        }
      });
    }

    // DELETE - Eliminar lead
    if (req.method === 'DELETE') {
      if (!authenticate(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const url = req.url;
      const id = url.split('/').pop();
      
      if (!id) {
        return res.status(400).json({
          status: 'error',
          message: 'ID del lead es requerido'
        });
      }

      const result = await client.query('DELETE FROM leads WHERE id = $1', [id]);

      return res.status(200).json({
        status: 'success',
        message: 'Lead eliminado exitosamente',
        deleted_id: id,
        changes: result.rowCount
      });
    }

    // PUT - Actualizar estado
    if (req.method === 'PUT') {
      if (!authenticate(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const url = req.url;
      const id = url.split('/').filter(Boolean).slice(-2, -1)[0];
      const { estado } = req.body;
      
      if (!id || !estado) {
        return res.status(400).json({
          status: 'error',
          message: 'ID y estado son requeridos'
        });
      }

      const result = await client.query(
        'UPDATE leads SET estado = $1 WHERE id = $2',
        [estado, id]
      );

      return res.status(200).json({
        status: 'success',
        message: 'Estado actualizado exitosamente',
        updated_id: id,
        new_estado: estado,
        changes: result.rowCount
      });
    }

    res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Error en API:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
