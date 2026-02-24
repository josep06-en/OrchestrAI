// Servidor Express para OrchestrAI - Sistema Dual de Almacenamiento
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Clave secreta para autenticación
const SECRET_KEY = 'orchestrAI_secure_2024';

// Configuración de email
const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: 'jenriquellopis@gmail.com', // Email del usuario
    pass: 'tuha tyij klfj qppy'    // Contraseña de aplicación
  }
};

// Email del administrador
const ADMIN_EMAIL = 'jenriquellopis@gmail.com'; // Email del usuario

// Transportador de email
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

// Enviar email de notificación de nuevo lead
async function sendNewLeadEmail(leadData) {
  try {
    console.log('🔧 Iniciando envío de email...');
    console.log('📧 Email destino:', ADMIN_EMAIL);
    console.log('📧 Usuario Gmail:', EMAIL_CONFIG.auth.user);
    console.log('📧 Contraseña configurada:', EMAIL_CONFIG.auth.pass ? 'SÍ' : 'NO');
    
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
              <a href="file:///C:/Users/Josep%20Segarro/Desktop/proyecto/web/leads-dashboard.html" 
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
    console.log('📧 Respuesta Gmail:', result.response);
    console.log('📧 Destino confirmado:', result.accepted);
    console.log('📧 Rechazados:', result.rejected);
    console.log('📧 Pendientes:', result.pending);
    db.saveLog('success', `Email de notificación enviado para lead: ${leadData.email}`, leadData);
    
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    db.saveLog('error', 'Error enviando email de notificación', error);
    return { success: false, error: error.message };
  }
}

// Middleware de autenticación
function authenticate(req, res, next) {
  const authKey = req.headers['x-auth-key'] || req.body.secret_key || req.query.secret_key;
  
  if (authKey !== SECRET_KEY) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized access'
    });
  }
  
  next();
}

// Endpoint principal para guardar leads (Sistema Dual)
app.post('/api/leads', authenticate, async (req, res) => {
  try {
    const leadData = {
      timestamp: new Date().toISOString(),
      nombre: req.body.nombre,
      email: req.body.email,
      empresa: req.body.empresa || '',
      telefono: req.body.telefono || '',
      tamano: req.body.tamano || '',
      mensaje: req.body.mensaje || '',
      estado: 'Nuevo Lead',
      fuente: 'web'
    };

    // Sistema Dual: Guardar en base de datos local
    const dbResult = await db.saveLead(leadData);
    
    // Sistema Dual: Enviar a Google Sheets (fallback)
    try {
      const googleSheetsResult = await sendToGoogleSheets(leadData);
      console.log('✅ Lead guardado en Google Sheets:', googleSheetsResult);
    } catch (sheetsError) {
      console.error('❌ Error en Google Sheets:', sheetsError);
      db.saveLog('warning', 'Google Sheets fallback failed', sheetsError);
    }
    
    // 📧 Enviar email de notificación al administrador
    try {
      const emailResult = await sendNewLeadEmail(leadData);
      if (emailResult.success) {
        console.log('✅ Email de notificación enviado al administrador');
      } else {
        console.error('❌ Error enviando email de notificación:', emailResult.error);
      }
    } catch (emailError) {
      console.error('❌ Error crítico enviando email:', emailError);
      db.saveLog('error', 'Error crítico enviando email de notificación', emailError);
    }

    res.json({
      status: 'success',
      message: 'Lead guardado exitosamente en sistema dual',
      database_id: dbResult.id,
      timestamp: leadData.timestamp
    });

  } catch (error) {
    console.error('Error guardando lead:', error);
    db.saveLog('error', 'Error guardando lead', error);
    
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Enviar a Google Sheets (fallback)
async function sendToGoogleSheets(leadData) {
  const fetch = require('node-fetch');
  
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbx4AMXLkJM1wdJ7O6TvQu2X131i84JL5WSvvpJXWPWcSfJXS4Lkek19zLnS_uKsHOnlVg/exec';
  
  const response = await fetch(scriptUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Key': SECRET_KEY
    },
    body: JSON.stringify({
      ...leadData,
      secret_key: SECRET_KEY
    })
  });

  if (!response.ok) {
    throw new Error(`Google Sheets error: ${response.status}`);
  }

  return response.json();
}

// Endpoint para obtener todos los leads
app.get('/api/leads', authenticate, async (req, res) => {
  try {
    const leads = await db.getAllLeads();
    res.json({
      status: 'success',
      data: leads,
      total: leads.length
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Endpoint para obtener estadísticas
app.get('/api/stats', authenticate, async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Endpoint para eliminar lead
app.delete('/api/leads/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Usar el método deleteLead del módulo database
    const result = await db.deleteLead(id);
    
    res.json({
      status: 'success',
      message: 'Lead eliminado exitosamente',
      deleted_id: result.deleted_id,
      changes: result.changes
    });
    
  } catch (error) {
    console.error('Error en endpoint DELETE:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Endpoint para actualizar estado de lead
app.put('/api/leads/:id/status', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    const result = await db.updateLeadStatus(id, estado);
    
    res.json({
      status: 'success',
      message: 'Estado actualizado exitosamente',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Endpoint para obtener logs
app.get('/api/logs', authenticate, async (req, res) => {
  try {
    db.all("SELECT * FROM logs ORDER BY created_at DESC LIMIT 50", (err, rows) => {
      if (err) {
        res.status(500).json({
          status: 'error',
          message: err.message
        });
      } else {
        res.json({
          status: 'success',
          data: rows
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Endpoint para exportar leads
app.get('/api/export', authenticate, async (req, res) => {
  try {
    const exportData = await db.exportLeadsToJSON();
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=orchestrai_leads_${new Date().toISOString().split('T')[0]}.json`);
    
    res.json(exportData);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Endpoint de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor OrchestrAI corriendo en puerto ${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api`);
  console.log(`🔍 Health check en http://localhost:${PORT}/health`);
});

// Manejo de errores
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  db.saveLog('error', 'Uncaught Exception', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  db.saveLog('error', 'Unhandled Rejection', reason);
});

// Cerrar base de datos al salir
process.on('SIGINT', () => {
  console.log('\n🔄 Cerrando base de datos...');
  db.closeDatabase();
  process.exit(0);
});
