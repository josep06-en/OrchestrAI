# 📧 CONFIGURACIÓN GMAIL - PASOS CORRECTOS

## 🔍 Verificación de Configuración

### 1. Contraseña de Aplicación
- **Actual en código:** `tuha tyij klfj qppy`
- **¿Es correcta?** Revisa en https://myaccount.google.com/apppasswords

### 2. Configuración de Gmail
- **IMAP:** Activado ✅
- **Apps menos seguras:** Permitido ✅
- **Filtros:** Revisar si bloquean emails propios

### 3. Verificación en 2 pasos
- **¿Activada?** Debe estar ACTIVADA
- **¿Contraseña de app?** Necesaria para nodemailer

## 🔧 Pasos para Arreglar

### Opción 1: Generar Nueva Contraseña
1. Ir a https://myaccount.google.com/apppasswords
2. Seleccionar app: "Otra (nombre personalizado)"
3. Nombre: "OrchestrAI Lead System"
4. Generar contraseña
5. Copiar los 16 caracteres
6. Actualizar en server.js línea 24

### Opción 2: Revisar Filtros Gmail
1. Gmail → Configuración → Filtros y direcciones bloqueadas
2. Buscar filtros que afecten: "from:jenriquellopis@gmail.com"
3. Desactivar o eliminar filtros problemáticos

### Opción 3: Revisar Spam
1. Gmail → Spam
2. Buscar emails con asunto: "🚀 Aviso nuevo lead"
3. Marcar como "No es spam"
4. Mover a bandeja principal

## 🧪 Prueba Diagnóstico
Para probar si el email funciona correctamente:

```bash
# Enviar email de prueba
curl -X POST http://localhost:3000/api/leads \
  -H "X-Auth-Key: orchestrAI_secure_2024" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test Diagnóstico","email":"test@diagnostico.com","empresa":"Test"}'
```

## 📋 Checklist Final
- [ ] Contraseña de aplicación correcta
- [ ] Verificación en 2 pasos activada
- [ ] IMAP activado en Gmail
- [ ] Sin filtros que bloqueen
- [ ] Revisar carpeta Spam
- [ ] Probar con curl
