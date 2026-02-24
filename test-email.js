// Test directo de email para diagnóstico
const nodemailer = require('nodemailer');

const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: 'jenriquellopis@gmail.com',
    pass: 'tuha tyij klfj qppy'
  }
};

const transporter = nodemailer.createTransport(EMAIL_CONFIG);

async function testEmail() {
  try {
    console.log('🔧 Iniciando test de email...');
    console.log('📧 Usuario:', EMAIL_CONFIG.auth.user);
    console.log('📧 Contraseña:', EMAIL_CONFIG.auth.pass ? 'CONFIGURADA' : 'NO CONFIGURADA');
    
    const mailOptions = {
      from: EMAIL_CONFIG.auth.user,
      to: 'jenriquellopis@gmail.com',
      subject: '🧪 TEST DIRECTO - Email de Notificación',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>🧪 Test Directo de Email</h1>
          <p>Este es un test para verificar que el email de notificación funciona correctamente.</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
          <p><strong>Usuario:</strong> ${EMAIL_CONFIG.auth.user}</p>
        </div>
      `
    };

    console.log('📧 Enviando email...');
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email enviado exitosamente:');
    console.log('📧 Message ID:', result.messageId);
    console.log('📧 Respuesta:', result.response);
    console.log('📧 Aceptado:', result.accepted);
    console.log('📧 Rechazado:', result.rejected);
    console.log('📧 Pendiente:', result.pending);
    
  } catch (error) {
    console.error('❌ Error en test de email:');
    console.error('📧 Código:', error.code);
    console.error('📧 Mensaje:', error.message);
    console.error('📧 Stack:', error.stack);
  }
}

testEmail();
