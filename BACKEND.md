# OrchestrAI Backend

Sistema dual de almacenamiento de leads con base de datos local y Google Sheets como backup.

## 🚀 Instalación

```bash
npm install
```

## 🏃‍♂️ Ejecutar

### Modo Desarrollo
```bash
npm run dev
```

### Modo Producción
```bash
npm start
```

## 📊 API Endpoints

### POST /api/leads
Guarda un nuevo lead en el sistema dual (BD local + Google Sheets)

**Headers requeridos:**
- `X-Auth-Key: orchestrAI_secure_2024`

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@empresa.com",
  "empresa": "Empresa SA",
  "telefono": "600123456",
  "tamano": "6-15",
  "mensaje": "Necesito automatizar procesos"
}
```

### GET /api/leads
Obtiene todos los leads de la base de datos local

**Headers requeridos:**
- `X-Auth-Key: orchestrAI_secure_2024`

### GET /api/stats
Obtiene estadísticas de los leads

### PUT /api/leads/:id/status
Actualiza el estado de un lead

### GET /api/export
Exporta todos los leads a formato JSON

### GET /health
Health check del servidor

## 🗄️ Base de Datos

### SQLite
- **Archivo:** `orchestrai_leads.db`
- **Tablas:** `leads`, `logs`
- **Backup:** Google Sheets automático

### Esquema de tabla leads
```sql
CREATE TABLE leads (
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
);
```

## 🔄 Sistema Dual

### Flujo de almacenamiento:
```
Formulario Web → API Local → Base de Datos SQLite
                    ↓
               Fallback → Google Sheets
```

### Ventajas:
- ✅ **Rapidez local** → Sin latencia de red
- ✅ **Backup automático** → Google Sheets como respaldo
- ✅ **Offline capability** → Funciona sin internet
- ✅ **Consultas rápidas** → SQLite es muy rápido
- ✅ **Exportación fácil** → JSON, CSV, etc.

## 📈 Estadísticas

El sistema mantiene estadísticas automáticas:
- Total de leads
- Leads nuevos
- Leads contactados
- Auditorías agendadas
- Leads convertidos

## 🔧 Exportación

### Exportar a JSON
```bash
npm run export
node export.js json
```

### Exportar a CSV
```bash
node export.js csv
```

## 🔒 Seguridad

- **Clave secreta:** `orchestrAI_secure_2024`
- **Autenticación:** Headers X-Auth-Key
- **Logs completos:** Todas las operaciones registradas

## 🌐 Despliegue

### Local
```bash
npm start
# Servidor en http://localhost:3000
```

### Producción (Vercel)
```bash
npm install -g vercel
vercel --prod
```

## 📝 Logs

El sistema mantiene logs detallados:
- Operaciones exitosas
- Errores y fallbacks
- Cambios de estado
- Estadísticas de uso

## 🔄 Actualización Web

Actualizar la URL en `web_operis_completa.html`:

```javascript
const scriptUrl = 'http://localhost:3000/api/leads';
```

Para producción:
```javascript
const scriptUrl = 'https://tu-backend.vercel.app/api/leads';
```
