# 🚀 ORCHESTRAI - BACKEND EN RAILWAY.APP

## 📋 **RESUMEN DEL PROYECTO**

### **🎯 Objetivo**
Crear un backend independiente y accesible globalmente para el sistema de gestión de leads de OrchestrAI.

### **🌐 Arquitectura**
- **Frontend:** Archivos estáticos servidos por Railway
- **Backend:** API serverless con Express.js
- **Base de Datos:** PostgreSQL en Railway
- **Email:** SendGrid (principal) + Gmail (fallback)
- **Dominio:** orchestrai.railway.app (personalizado)

## 🛠️ **TECNOLOGÍAS**

### **Backend**
- **Node.js** con Express.js
- **PostgreSQL** para base de datos robusta
- **SendGrid** para entregas de email garantizadas
- **Serverless** optimizado para Railway.app

### **Base de Datos**
- **PostgreSQL** con migración desde SQLite
- **Tablas:** leads, logs
- **Conexión** pool con SSL
- **Backup automático** y replicación

### **Email**
- **SendGrid API** para entregas profesionales
- **Gmail fallback** para contingencia
- **Templates HTML** personalizados
- **Tracking** de entregas y aperturas

## 🚀 **IMPLEMENTACIÓN**

### **1. Crear Cuenta Railway.app**
1. Visita https://railway.app/
2. Crea cuenta con GitHub
3. Autoriza el repositorio `josep06-en/OrchestrAI`

### **2. Configurar Variables de Entorno**
1. Copia `.env.example` a `.env`
2. Configura las variables necesarias:
   ```bash
   DATABASE_URL=postgresql://...
   SENDGRID_API_KEY=your_sendgrid_key
   ADMIN_EMAIL=jenriquellopis@gmail.com
   ```

### **3. Despliegue Automático**
1. Railway detectará cambios en GitHub
2. Desplegará automáticamente
3. Configurará variables de entorno
4. URL asignada: `https://orchestrai.railway.app`

### **4. Probar Funcionalidad**
1. Formulario: `https://orchestrai.railway.app/web_operis_completa.html`
2. Dashboard: `https://orchestrai.railway.app/leads-dashboard.html`
3. API: `https://orchestrai.railway.app/api/leads`
4. Email: Verificar notificaciones en `jenriquellopis@gmail.com`

## 📋 **ESTRUCTURA DE ARCHIVOS**

```
orchestrai/
├── api/
│   ├── leads.js          # Endpoint principal de leads
│   ├── stats.js          # Estadísticas
│   └── logs.js           # Logs del sistema
├── web/
│   ├── web_operis_completa.html    # Formulario principal
│   └── leads-dashboard.html       # Dashboard de gestión
├── server-railway.js              # Servidor principal
├── package-railway.json           # Dependencias Railway
├── railway.json                  # Configuración Railway
├── .env.example                   # Variables de entorno
└── README-RAILWAY.md             # Documentación
```

## 🎯 **ENDPOINTS DE LA API**

### **Leads**
- `POST /api/leads` - Crear nuevo lead
- `GET /api/leads` - Obtener todos los leads
- `PUT /api/leads/:id/status` - Actualizar estado
- `DELETE /api/leads/:id` - Eliminar lead

### **Estadísticas**
- `GET /api/stats` - Obtener estadísticas de leads

### **Logs**
- `GET /api/logs` - Obtener logs del sistema

### **Exportación**
- `GET /api/export` - Exportar leads en JSON/CSV

### **Health Check**
- `GET /api/health` - Verificar estado del sistema

## 📧 **CONFIGURACIÓN DE EMAIL**

### **SendGrid (Principal)**
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'jenriquellopis@gmail.com',
  from: 'noreply@orchestrai.com',
  subject: `🚀 Aviso nuevo lead - ${leadData.nombre}`,
  html: emailHTML
};
```

### **Gmail (Fallback)**
```javascript
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'jenriquellopis@gmail.com',
    pass: 'tuha tyij klfj qppy'
  }
});
```

## 🗄️ **BASE DE DATOS**

### **PostgreSQL Schema**
```sql
CREATE TABLE leads (
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

CREATE TABLE logs (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  level VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 **BENEFICIOS DE RAILWAY.APP**

### **✅ Ventajas Principales**
- **Acceso Global:** Disponible desde cualquier lugar
- **Escalabilidad Automática:** Crecce con tu negocio
- **99.9% Uptime:** Fiabilidad garantizada
- **SSL Incluido:** HTTPS automático y gratuito
- **Dominio Personalizado:** orchestrai.railway.app
- **Despliegue Automático:** Conectado a GitHub
- **Costo Gratuito:** Plan generoso para empezar
- **Base de Datos Profesional:** PostgreSQL
- **Email Confiable:** SendGrid con tracking

### **💰 Costos**
- **Plan Gratuito:** $0 USD/mes
- **Plan Starter:** $5-20 USD/mes (si necesitas más recursos)
- **Plan Pro:** $20-80 USD/mes (para alto tráfico)

## 🎯 **PRÓXIMOS PASOS**

### **1. Preparación Local**
```bash
# Clonar repositorio
git clone https://github.com/josep06-en/OrchestrAI.git orchestrai-railway

# Instalar dependencias
cd orchestrai-railway
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

### **2. Despliegue en Railway**
```bash
# Instalar CLI de Railway
npm install -g @railway/cli

# Login y desplegar
railway login
railway link
railway deploy
```

### **3. Verificación**
```bash
# Verificar despliegue
railway status

# Ver logs
railway logs

# Probar API
curl https://orchestrai.railway.app/api/health
```

## 📊 **MONITOREO Y MANTENIMIENTO**

### **Logs en Tiempo Real**
- Railway.app proporciona logs detallados
- Métricas de rendimiento disponibles
- Alertas automáticas configurables
- Integración con herramientas externas

### **Métricas Clave**
- Tiempo de respuesta de API
- Tasa de éxito de email
- Leads generados por día/semana/mes
- Errores del sistema
- Uso de recursos

## 🎉 **RESULTADO ESPERADO**

### **✅ Sistema Profesional Completo**
- 🌐 **Acceso global** desde cualquier dispositivo
- 📱 **Multi-dispositivo** compatible
- 📧 **Email confiable** con tracking
- 🗄️ **Base de datos robusta** y escalable
- 🚀 **Escalabilidad automática** con crecimiento
- 💰 **Costo optimizado** según necesidades
- 🔒 **Seguridad enterprise** con SSL
- 📊 **Monitoreo completo** del sistema

---

**Este backend en Railway.app proporciona independencia total y acceso global 24/7 al sistema de gestión de leads de OrchestrAI.**
