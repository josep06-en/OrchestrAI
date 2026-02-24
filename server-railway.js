// Servidor Railway.app para OrchestrAI - Backend para Independencia Total
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Clave secreta para autenticación
const SECRET_KEY = 'orchestrAI_secure_2024';

// Configuración de Base de Datos PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/orchestrai',
  ssl: process.env.DATABASE_URL ? {
    rejectUnauthorized: false
  } : false
});

// Configuración de Email (SendGrid优先 + Gmail fallback)
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'jenriquellopis@gmail.com',
    pass: process.env.EMAIL_PASS || 'tuha tyij klfj qppy'
  }
};
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'jenriquellopis@gmail.com';

// Transportador de Email
let transporter;

// Inicializar transportador de email
async function initEmailTransporter() {
  try {
    if (SENDGRID_API_KEY) {
      // Usar SendGrid si está configurado
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(SENDGRID_API_KEY);
      transporter = {
        send: async (mailOptions) => {
          const msg = {
            to: mailOptions.to,
            from: mailOptions.from || 'noreply@orchestrai.com',
            subject: mailOptions.subject,
            html: mailOptions.html
          };
          return sgMail.send(msg);
        }
      };
      console.log('📧 Usando SendGrid para envío de emails');
    } else {
      // Fallback a Gmail
      transporter = nodemailer.createTransport(EMAIL_CONFIG);
      console.log('📧 Usando Gmail como fallback para envío de emails');
    }
  } catch (error) {
    console.error('❌ Error inicializando transportador de email:', error);
    // Fallback a Gmail
    transporter = nodemailer.createTransport(EMAIL_CONFIG);
  }
}

// Enviar email de notificación de nuevo lead
async function sendNewLeadEmail(leadData) {
  try {
    console.log('🔧 === INICIANDO ENVÍO EMAIL ===');
    console.log('📧 Lead data:', leadData);
    console.log('📧 Email destino:', ADMIN_EMAIL);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@orchestrai.com',
      to: ADMIN_EMAIL,
      subject: `🚀 Aviso nuevo lead - ${leadData.nombre} - ${leadData.empresa}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #111110; color: #fafaf7; padding: 20px; border-radius: 8px;">
            <h1 style="margin: 0; font-size: 24px;">🚀 Nuevo Lead Recibido</h1>
            <p style="margin: 10px 0; color: #d4af37;">OrchestrAI - Sistema en Railway.app</p>
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
                <td style="padding: 10px; border-bottom: 1px solid #d0cdc4;">${leadData.mensaje || 'No especificado'}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #111110; color: #fafaf7; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center;">
            <h3 style="margin: 0; font-size: 18px;">🎯 Próximos Pasos</h3>
            <p style="margin: 10px 0;">1. Contactar al lead en menos de 24 horas</p>
            <p style="margin: 10px 0;">2. Agendar auditoría gratuita</p>
            <p style="margin: 10px 0;">3. Preparar propuesta personalizada</p>
            
            <div style="margin-top: 20px;">
              <a href="https://orchestrai.railway.app/leads-dashboard.html" 
                 style="background: #d4af37; color: #111110; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                📊 Ver Dashboard de Leads
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #7a7870; font-size: 12px;">
            <p>Este email se generó automáticamente desde el sistema de leads de OrchestrAI</p>
            <p>Fecha: ${new Date().toLocaleString('es-ES')}</p>
            <p><strong>Sistema:</strong> Railway.app (Producción)</p>
          </div>
        </div>
      `
    };

    const result = await transporter.send(mailOptions);
    
    console.log('✅ Email de notificación enviado:', result.messageId || result[0]?.messageId);
    console.log('📧 Respuesta:', result.response || result[0]?.response);
    
    return { success: true, messageId: result.messageId || result[0]?.messageId };
    
  } catch (error) {
    console.error('❌ Error enviando email:', error);
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

// Inicializar base de datos
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        empresa VARCHAR(255),
        telefono VARCHAR(50),
        tamano VARCHAR(50),
        mensaje TEXT,
        estado VARCHAR(50) DEFAULT 'Nuevo Lead',
        fuente VARCHAR(50) DEFAULT 'web',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        level VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Base de datos PostgreSQL inicializada');
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
  }
}

// Endpoint principal para guardar leads
app.post('/api/leads', authenticate, async (req, res) => {
  try {
    console.log('📥 POST /api/leads - Lead recibido');
    
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

    console.log('📊 Datos del lead:', leadData);

    // Guardar en base de datos PostgreSQL
    const result = await pool.query(`
      INSERT INTO leads (timestamp, nombre, email, empresa, telefono, tamano, mensaje, estado, fuente)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [leadData.timestamp, leadData.nombre, leadData.email, leadData.empresa, leadData.telefono, leadData.tamano, leadData.mensaje, leadData.estado, leadData.fuente]);

    const newLeadId = result.rows[0].id;
    console.log('💾 Lead guardado en PostgreSQL, ID:', newLeadId);

    // Enviar email de notificación al administrador
    console.log('📧 Enviando email de notificación...');
    const emailResult = await sendNewLeadEmail(leadData);
    
    if (emailResult.success) {
      console.log('✅ Email de notificación enviado al administrador');
    } else {
      console.error('❌ Error enviando email de notificación:', emailResult.error);
    }

    res.json({
      status: 'success',
      message: 'Lead guardado exitosamente en Railway.app',
      database_id: newLeadId,
      timestamp: leadData.timestamp,
      email_sent: emailResult.success,
      platform: 'railway'
    });

  } catch (error) {
    console.error('❌ Error guardando lead:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET endpoint para obtener leads
app.get('/api/leads', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('❌ Error obteniendo leads:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT endpoint para actualizar estado de lead
app.put('/api/leads/:id/status', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    const result = await pool.query(
      'UPDATE leads SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id]
    );
    
    res.json({
      status: 'success',
      message: 'Estado actualizado exitosamente',
      updated_id: id,
      new_estado: estado
    });
  } catch (error) {
    console.error('❌ Error actualizando estado:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE endpoint para eliminar lead
app.delete('/api/leads/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM leads WHERE id = $1 RETURNING *', [id]);
    
    res.json({
      status: 'success',
      message: 'Lead eliminado exitosamente',
      deleted_id: id
    });
  } catch (error) {
    console.error('❌ Error eliminando lead:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET endpoint para estadísticas
app.get('/api/stats', authenticate, async (req, res) => {
  try {
    const totalResult = await pool.query('SELECT COUNT(*) as total FROM leads');
    const estadosResult = await pool.query('SELECT estado, COUNT(*) as count FROM leads GROUP BY estado');
    
    const stats = {
      total: parseInt(totalResult.rows[0].total),
      por_estado: estadosResult.rows
    };
    
    res.json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET endpoint para logs
app.get('/api/logs', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM logs ORDER BY created_at DESC LIMIT 100');
    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('❌ Error obteniendo logs:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET endpoint para exportar leads
app.get('/api/export', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    
    const exportData = {
      export_date: new Date().toISOString(),
      total_leads: result.rows.length,
      leads: result.rows
    };
    
    res.json(exportData);
  } catch (error) {
    console.error('❌ Error exportando leads:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'OrchestrAI API funcionando correctamente',
    platform: 'railway',
    timestamp: new Date().toISOString()
  });
});

// Servir archivos estáticos
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/web_operis_completa.html');
});

app.get('/leads-dashboard.html', (req, res) => {
  res.sendFile(__dirname + '/leads-dashboard.html');
});

// Iniciar servidor
async function startServer() {
  try {
    // Inicializar transportador de email
    await initEmailTransporter();
    
    // Inicializar base de datos
    await initDatabase();
    
    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log('🚀 Servidor Railway.app corriendo en http://localhost:' + PORT);
      console.log('📋 Formulario: http://localhost:' + PORT + '/web_operis_completa.html');
      console.log('📊 Dashboard: http://localhost:' + PORT + '/leads-dashboard.html');
      console.log('📧 Email configurado:', SENDGRID_API_KEY ? 'SendGrid' : 'Gmail');
      console.log('🗄️ Base de datos:', process.env.DATABASE_URL ? 'PostgreSQL' : 'PostgreSQL local');
      console.log('✅ Sistema listo para recibir leads globalmente');
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

startServer();
