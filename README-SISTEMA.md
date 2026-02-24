# 🚀 ORCHESTRAI - SISTEMA DE GESTIÓN DE LEADS

## 📋 **RESUMEN EJECUTIVO**

### ✅ **Estado Actual: FUNCIONANDO PERFECTAMENTE**
- **Servidor:** `http://localhost:3000` ✅
- **Email:** `jenriquellopis@gmail.com` ✅
- **Dashboard:** Gestión completa ✅
- **Base de datos:** SQLite estable ✅

## 🎯 **CÓMO USAR EL SISTEMA**

### **Método 1: Inicio Automático (Recomendado)**
1. **Doble clic** en `iniciar-servidor.bat`
2. **Espera** a que aparezca "Servidor corriendo en http://localhost:3000"
3. **Listo** para usar

### **Método 2: Inicio Manual**
1. **Abrir terminal** en la carpeta del proyecto
2. **Ejecutar:** `node server-debug.js`
3. **Mantener terminal abierta**

## 🌐 **ACCESO A LA APLICACIÓN**

### **Formulario Web (Captación de Leads)**
```
http://localhost:3000/web_operis_completa.html
```
- **Clientes llenan formulario** → Datos se guardan
- **Email automático** → Notificación a `jenriquellopis@gmail.com`
- **Backup Google Sheets** → Doble almacenamiento

### **Dashboard de Gestión**
```
http://localhost:3000/leads-dashboard.html
```
- **Ver leads** en tiempo real
- **Filtrar por estado** → Nuevo Lead, Contactado, Cerrado
- **Buscar leads** → Por nombre, email, empresa
- **Actualizar estados** → Click en el estado del lead
- **Eliminar leads** → Individual o múltiple
- **Exportar datos** → JSON o CSV
- **Auto-refresh** → Cada minuto automáticamente

## 📧 **FUNCIONALIDADES COMPLETAS**

### ✅ **Captación Automática**
- Formulario responsive y moderno
- Validación de campos en tiempo real
- Guardado dual: Base de datos + Google Sheets
- Email de confirmación al cliente

### ✅ **Notificaciones en Tiempo Real**
- Email automático al administrador
- Dashboard con auto-refresh cada minuto
- Notificaciones visuales y sonoras
- Indicador de "nuevos leads"

### ✅ **Gestión Avanzada**
- Estados personalizables de leads
- Búsqueda y filtrado inteligente
- Selección múltiple para operaciones masivas
- Historial completo de actividades

### ✅ **Exportación de Datos**
- Exportación en formato JSON
- Exportación en formato CSV
- Todos los datos del lead incluidos
- Compatible con Excel y Google Sheets

### ✅ **Seguridad y Logging**
- Autenticación con clave segura
- Logs detallados de todas las operaciones
- Auditoría completa del sistema
- Base de datos local cifrada

## 📧 **CONFIGURACIÓN TÉCNICA**

### **Email Configurado**
- **Servicio:** Gmail SMTP
- **Usuario:** jenriquellopis@gmail.com
- **Autenticación:** Contraseña de aplicación
- **Destino:** jenriquellopis@gmail.com

### **Base de Datos**
- **Motor:** SQLite 3
- **Archivo:** orchestrai_leads.db
- **Tablas:** leads, logs
- **Backup:** Automático en Google Sheets

### **Servidor**
- **Framework:** Express.js
- **Puerto:** 3000
- **CORS:** Configurado para todo origen
- **Logging:** Nivel debug completo

## 🔧 **SOLUCIÓN DE PROBLEMAS**

### **Si el email no llega:**
1. **Revisar carpeta Spam** en Gmail
2. **Buscar:** `from:jenriquellopis@gmail.com`
3. **Revisar filtros** en Configuración Gmail
4. **Verificar contraseña** de aplicación

### **Si el servidor no inicia:**
1. **Verificar que el puerto 3000 esté libre**
2. **Ejecutar:** `netstat -ano | findstr :3000`
3. **Matar procesos:** `taskkill /F /IM node.exe`
4. **Reiniciar servidor**

### **Si el dashboard no actualiza:**
1. **Recargar página** (F5)
2. **Revisar consola F12** para errores
3. **Verificar conexión** al servidor
4. **Limpiar caché** del navegador

## 📊 **MÉTRICAS Y ESTADÍSTICAS**

### **Indicadores Disponibles:**
- Total de leads recibidos
- Leads por estado
- Leads por fuente
- Tasa de conversión
- Tiempo de respuesta

### **Reportes Generados:**
- Exportación completa de leads
- Logs de todas las operaciones
- Estadísticas por período
- Análisis de rendimiento

## 🚀 **PRÓXIMOS PASOS**

### **Opcional: Producción en la Nube**
- **Railway.app:** Más simple que Vercel
- **Render.com:** Alternativa gratuita
- **DigitalOcean:** Opción profesional
- **Heroku:** Platform probada

### **Mejoras Futuras:**
- Integración con CRM
- Chatbot automático
- Calendario integrado
- Análisis predictivo
- Múltiples usuarios

## 📞 **SOPORTE**

### **Documentación:**
- **Código fuente:** Todo el proyecto documentado
- **README técnico:** Explicación de arquitectura
- **Logs del sistema:** Para diagnóstico

### **Contacto:**
- **Email:** jenriquellopis@gmail.com
- **GitHub:** https://github.com/josep06-en/OrchestrAI
- **Repositorio:** Completo y versionado

---

## 🎉 **¡SISTEMA LISTO PARA USAR!**

**El sistema de gestión de leads de OrchestrAI está completamente funcional y listo para recibir y gestionar leads de manera profesional.**

**Inicia el servidor con `iniciar-servidor.bat` y comienza a recibir leads inmediatamente.**
