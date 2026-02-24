// Servidor Railway.app para OrchestrAI - Backend para Independencia Total
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Clave secreta para autenticación
const SECRET_KEY = 'orchestrAI_secure_2024';

// Configuración de Base de Datos SQLite
const dbPath = path.join(__dirname, 'orchestrai_leads.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error abriendo base de datos:', err.message);
  } else {
    console.log('✅ Base de datos SQLite conectada');
    initDatabase();
  }
});

// Inicializar base de datos
function initDatabase() {
  // Crear tabla de leads
  db.run(`CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    empresa TEXT,
    telefono TEXT,
    tamano TEXT,
    mensaje TEXT,
    estado TEXT DEFAULT 'Nuevo Lead',
    fuente TEXT DEFAULT 'web',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Crear tabla de logs
  db.run(`CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    tipo TEXT NOT NULL,
    mensaje TEXT,
    datos TEXT
  )`);
}

// Configuración de Email (SendGrid优先 + Gmail fallback)
const EMAIL_USER = process.env.EMAIL_USER || 'josep.segarro@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'tuha tyij klfj qppy';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'jenriquellopis@gmail.com';
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';

// Configuración de Email con fallback
let transporter = null;

async function initEmailTransporter() {
  try {
    // Intentar SendGrid primero
    if (SENDGRID_API_KEY && SENDGRID_API_KEY !== '') {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(SENDGRID_API_KEY);
      transporter = {
        type: 'sendgrid',
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
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS
        }
      });
      console.log('📧 Usando Gmail como fallback para envío de emails');
    }
  } catch (error) {
    console.error('❌ Error inicializando transportador de email:', error);
    // Fallback a Gmail
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });
  }
}

// Enviar email de notificación de nuevo lead
async function sendNewLeadEmail(leadData) {
  try {
    console.log('🔧 === INICIANDO ENVÍO EMAIL ===');
    console.log('📧 Lead data:', leadData);
    console.log('📧 Email destino:', ADMIN_EMAIL);
    console.log('📧 Email configuración:', {
      user: EMAIL_CONFIG.auth.user,
      from: EMAIL_CONFIG.auth.user,
      to: ADMIN_EMAIL
    });
    
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

    console.log('📧 Enviando email con opciones:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    if (!transporter) {
      throw new Error('Transporter de email no configurado');
    }
    
    const result = await transporter.send(mailOptions);
    
    console.log('✅ Email de notificación enviado:', result.messageId || result[0]?.messageId);
    console.log('📧 Respuesta completa:', JSON.stringify(result, null, 2));
    console.log('📧 Respuesta SMTP:', result.response || result[0]?.response);
    
    return {
      success: true,
      messageId: result.messageId || result[0]?.messageId,
      fullResult: result
    };
  } catch (error) {
    console.error('❌ Error enviando email de notificación:', error);
    console.error('❌ Detalles del error:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    return {
      success: false,
      error: error.message,
      fullError: error
    };
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

    // Guardar en base de datos SQLite
    const stmt = db.prepare(`
      INSERT INTO leads (timestamp, nombre, email, empresa, telefono, tamano, mensaje, estado, fuente)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(leadData.timestamp, leadData.nombre, leadData.email, leadData.empresa, leadData.telefono, leadData.tamano, leadData.mensaje, leadData.estado, leadData.fuente);
    const newLeadId = result.lastID;
    console.log('💾 Lead guardado en SQLite, ID:', newLeadId);

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
    db.all('SELECT * FROM leads ORDER BY created_at DESC', (err, rows) => {
      if (err) {
        console.error('❌ Error obteniendo leads:', err);
        res.status(500).json({
          status: 'error',
          message: 'Error obteniendo leads'
        });
      } else {
        res.json({
          status: 'success',
          data: rows
        });
      }
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
    
    db.run('UPDATE leads SET estado = ? WHERE id = ?', [estado, id], function(err) {
      if (err) {
        console.error('❌ Error actualizando lead:', err);
        res.status(500).json({
          status: 'error',
          message: 'Error actualizando lead'
        });
      } else {
        res.json({
          status: 'success',
          message: 'Lead actualizado correctamente'
        });
      }
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
    
    db.run('DELETE FROM leads WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('❌ Error eliminando lead:', err);
        res.status(500).json({
          status: 'error',
          message: 'Error eliminando lead'
        });
      } else {
        res.json({
          status: 'success',
          message: 'Lead eliminado correctamente'
        });
      }
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
    db.get('SELECT COUNT(*) as total FROM leads', (err, totalRow) => {
      if (err) {
        console.error('❌ Error obteniendo estadísticas:', err);
        res.status(500).json({
          status: 'error',
          message: 'Error obteniendo estadísticas'
        });
        return;
      }
      
      db.all('SELECT estado, COUNT(*) as count FROM leads GROUP BY estado', (err, estadoRows) => {
        if (err) {
          console.error('❌ Error obteniendo estados:', err);
          res.status(500).json({
            status: 'error',
            message: 'Error obteniendo estados'
          });
          return;
        }
        
        const stats = {
          total: totalRow.total,
          estados: estadoRows.reduce((acc, row) => {
            acc[row.estado] = row.count;
            return acc;
          }, {})
        };
        
        res.json({
          status: 'success',
          data: stats
        });
      });
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
    db.all('SELECT * FROM logs ORDER BY created_at DESC LIMIT 100', (err, rows) => {
      if (err) {
        console.error('❌ Error obteniendo logs:', err);
        res.status(500).json({
          status: 'error',
          message: 'Error obteniendo logs'
        });
      } else {
        res.json({
          status: 'success',
          data: rows
        });
      }
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
    db.all('SELECT * FROM leads ORDER BY created_at DESC', (err, rows) => {
      if (err) {
        console.error('❌ Error exportando leads:', err);
        res.status(500).json({
          status: 'error',
          message: 'Error exportando leads'
        });
      } else {
        const exportData = {
          export_date: new Date().toISOString(),
          total_leads: rows.length,
          leads: rows
        };
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=leads-export.json');
        res.json(exportData);
      }
    });
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

// Email test endpoint
app.get('/test-email', async (req, res) => {
  try {
    console.log('🧪 === PRUEBA DE EMAIL ===');
    
    const testData = {
      nombre: 'Usuario Prueba',
      email: 'test@example.com',
      empresa: 'Empresa Prueba',
      telefono: '600000000',
      tamano: 'Pequeña',
      mensaje: 'Este es un mensaje de prueba'
    };
    
    console.log('📧 Enviando email de prueba...');
    const result = await sendNewLeadEmail(testData);
    
    console.log('📧 Resultado del email:', result);
    
    res.json({
      status: 'success',
      message: 'Email de prueba enviado',
      result: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error en prueba de email:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      error: error
    });
  }
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
    
    const PORT = process.env.PORT || 8080;

    // Manejo de señales para Railway.app
    process.on('SIGTERM', () => {
      console.log('📡 SIGTERM recibido - Cerrando servidor graciosamente');
      if (db) {
        db.close((err) => {
          if (err) {
            console.error('❌ Error cerrando base de datos:', err.message);
          } else {
            console.log('✅ Base de datos cerrada correctamente');
          }
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    });

    process.on('SIGINT', () => {
      console.log('📡 SIGINT recibido - Cerrando servidor graciosamente');
      if (db) {
        db.close((err) => {
          if (err) {
            console.error('❌ Error cerrando base de datos:', err.message);
          } else {
            console.log('✅ Base de datos cerrada correctamente');
          }
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    });

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('🚀 Servidor Railway.app corriendo en http://localhost:' + PORT);
      console.log('📋 Formulario: http://localhost:' + PORT + '/web_operis_completa.html');
      console.log('📊 Dashboard: http://localhost:' + PORT + '/leads-dashboard.html');
      console.log('📧 Email configurado:', transporter ? (transporter.type === 'sendgrid' ? 'SendGrid' : 'Gmail') : 'No configurado');
      console.log('🗄️ Base de datos: SQLite local');
      console.log('✅ Sistema listo para recibir leads globalmente');
      console.log('📡 Servidor escuchando en todas las interfaces (0.0.0.0)');
    });

    // Evitar que el servidor se cierre inesperadamente
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error('❌ Puerto ' + PORT + ' ya está en uso');
      } else {
        console.error('❌ Error del servidor:', err);
      }
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

startServer();
