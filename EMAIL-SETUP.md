# Configuración de Email para OrchestrAI

## 📧 Configurar Gmail para Notificaciones Automáticas

### Paso 1 - Activar 2FA en Gmail
1. Ve a [myaccount.google.com/security](https://myaccount.google.com/security)
2. Activa "Verificación en dos pasos"
3. Sigue los pasos de configuración

### Paso 2 - Crear Contraseña de Aplicación
1. En la misma página de seguridad, busca "Contraseñas de aplicaciones"
2. Haz clic en "Generar contraseña"
3. Selecciona:
   - **Aplicación:** Otra (nombre personalizado)
   - **Nombre:** OrchestrAI Leads
4. Haz clic en "Generar"
5. **Copia la contraseña** (ej: `abcd efgh ijkl mnop`)

### Paso 3 - Configurar el Sistema
Edita el archivo `server.js` y reemplaza:

```javascript
// Líneas 20-29
const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: 'tu-email-real@gmail.com',    // ← TU EMAIL
    pass: 'abcd-efgh-ijkl-mnop'        // ← CONTRASEÑA DE APP
  }
};

const ADMIN_EMAIL = 'tu-email-real@gmail.com'; // ← TU EMAIL
```

### Paso 4 - Reiniciar Servidor
```bash
# Detener servidor (Ctrl+C)
npm start
```

## 📧 Qué Recibirás

Cada nuevo lead generará un email con:

### 📋 Información Completa:
- ✅ Nombre y email del lead
- ✅ Empresa y teléfono
- ✅ Tamaño de la empresa
- ✅ Mensaje del cliente
- ✅ Timestamp exacto

### 🎯 Próximos Pasos:
- ✅ Checklist de acciones
- ✅ Enlace directo al dashboard
- ✅ Timestamp de recepción

### 📊 Email Profesional:
- ✅ Diseño corporativo OrchestrAI
- ✅ Tabla con datos estructurados
- ✅ Botón de acción directa
- ✅ Información de contacto

## 🔄 Flujo Completo

```
Cliente completa formulario → API local → SQLite
                                    ↓
                              Email automático → Tu inbox
                                    ↓
                              Dashboard actualizado → Gestión
```

## 🛡️ Seguridad

- ✅ **Contraseña de app** → Solo para este sistema
- ✅ **Sin exposición** → No se guarda en el frontend
- ✅ **Logs completos** → Todo registrado
- ✅ **Fallback** → Si email falla, sigue guardando

## 📱 Notificaciones Instantáneas

Recibirás emails en tiempo real cuando:
- 🚀 **Nuevo lead** → Inmediatamente
- 📊 **Lead actualizado** → Si quieres (opcional)
- ⚠️ **Error del sistema** → Si algo falla

## 🎯 Ventajas

- ✅ **Respuesta rápida** → Contacto en <24h
- ✅ **No perder leads** → Notificación inmediata
- ✅ **Gestión centralizada** → Dashboard + email
- ✅ **Profesionalismo** → Sistema automatizado

## 🔧 Probar Email

Para probar el sistema:

```bash
# Enviar lead de prueba
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Auth-Key: orchestrAI_secure_2024" \
  -d '{
    "nombre": "Test Email",
    "email": "test@orchestrai.com",
    "empresa": "Test Empresa"
  }' \
  http://localhost:3000/api/leads
```

Deberías recibir el email en menos de 10 segundos.

## 📞 Soporte

Si tienes problemas con Gmail:
1. **Revisa la contraseña de app** → Debe ser la generada
2. **Verifica 2FA** → Debe estar activada
3. **Revisa spam** → Primer email puede ir allí
4. **Logs del servidor** → Revisa errores en consola
