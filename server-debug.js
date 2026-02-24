// Servidor Debug para identificar problema de email
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
    user: 'jenriquellopis@gmail.com',
    pass: 'tuha tyij klfj qppy'
  }
};

const ADMIN_EMAIL = 'jenriquellopis@gmail.com';

console.log('🔧 Iniciando servidor debug...');
console.log('📧 Email usuario:', EMAIL_CONFIG.auth.user);
console.log('📧 Email admin:', ADMIN_EMAIL);
console.log('📧 Contraseña configurada:', EMAIL_CONFIG.auth.pass ? 'SÍ' : 'NO');

// Transportador de email
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

// Enviar email de notificación de nuevo lead
async function sendNewLeadEmail(leadData) {
  try {
    console.log('🔧 === INICIANDO ENVÍO EMAIL ===');
    console.log('📧 Lead data:', leadData);
    console.log('📧 Email destino:', ADMIN_EMAIL);
    
    const mailOptions = {
      from: EMAIL_CONFIG.auth.user,
      to: ADMIN_EMAIL,
      subject: `🚀 Aviso nuevo lead - ${leadData.nombre} - ${leadData.empresa}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>🚀 Nuevo Lead Recibido</h1>
          <p><strong>Nombre:</strong> ${leadData.nombre}</p>
          <p><strong>Email:</strong> ${leadData.email}</p>
          <p><strong>Empresa:</strong> ${leadData.empresa}</p>
          <p><strong>Teléfono:</strong> ${leadData.telefono}</p>
          <p><strong>Mensaje:</strong> ${leadData.mensaje}</p>
          <p><em>Fecha: ${new Date().toLocaleString('es-ES')}</em></p>
        </div>
      `
    };

    console.log('📧 Enviando email con nodemailer...');
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ === EMAIL ENVIADO EXITOSAMENTE ===');
    console.log('📧 Message ID:', result.messageId);
    console.log('📧 Respuesta Gmail:', result.response);
    console.log('📧 Aceptado:', result.accepted);
    console.log('📧 Rechazado:', result.rejected);
    
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ === ERROR EN ENVÍO EMAIL ===');
    console.error('📧 Error:', error.message);
    console.error('📧 Código:', error.code);
    console.error('📧 Stack:', error.stack);
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

// Endpoint principal para guardar leads
app.post('/api/leads', authenticate, async (req, res) => {
  try {
    console.log('🔧 === POST /api/leads RECIBIDO ===');
    console.log('📧 Body:', req.body);
    
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

    console.log('📧 Lead data procesada:', leadData);

    // Guardar en base de datos local
    const dbResult = await db.saveLead(leadData);
    console.log('📧 Lead guardado en BD, ID:', dbResult.id);
    
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
      message: 'Lead guardado exitosamente',
      database_id: dbResult.id,
      timestamp: leadData.timestamp,
      email_sent: emailResult.success
    });

  } catch (error) {
    console.error('❌ Error general guardando lead:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET endpoint para obtener leads
app.get('/api/leads', authenticate, async (req, res) => {
  try {
    const leads = await db.getAllLeads();
    res.json({
      status: 'success',
      data: leads
    });
  } catch (error) {
    console.error('Error obteniendo leads:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor debug corriendo en http://localhost:${PORT}`);
  console.log('📧 Listo para recibir leads y enviar emails');
});
