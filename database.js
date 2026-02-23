// Base de datos SQLite para leads de OrchestrAI
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Configuración de la base de datos
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
  )`, (err) => {
    if (err) {
      console.error('Error creando tabla:', err.message);
    } else {
      console.log('✅ Tabla de leads creada/verificada');
    }
  });

  // Crear tabla de logs
  db.run(`CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    level TEXT NOT NULL,
    message TEXT NOT NULL,
    data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creando tabla de logs:', err.message);
    } else {
      console.log('✅ Tabla de logs creada/verificada');
    }
  });
}

// Guardar lead en base de datos
function saveLead(leadData) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO leads (timestamp, nombre, email, empresa, telefono, tamano, mensaje, estado, fuente)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      leadData.timestamp,
      leadData.nombre,
      leadData.email,
      leadData.empresa || null,
      leadData.telefono || null,
      leadData.tamano || null,
      leadData.estado || 'Nuevo Lead',
      leadData.fuente || 'web'
    ], function(err) {
      if (err) {
        console.error('Error guardando lead:', err.message);
        reject(err);
      } else {
        console.log(`✅ Lead guardado en BD local - ID: ${this.lastID}`);
        
        // Guardar log
        saveLog('success', `Lead guardado - ID: ${this.lastID}`, leadData);
        
        resolve({
          success: true,
          id: this.lastID,
          message: 'Lead guardado exitosamente en base de datos local'
        });
      }
    });

    stmt.finalize();
  });
}

// Guardar log
function saveLog(level, message, data = null) {
  const stmt = db.prepare(`
    INSERT INTO logs (timestamp, level, message, data)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run([
    new Date().toISOString(),
    level,
    message,
    data ? JSON.stringify(data) : null
  ]);

  stmt.finalize();
}

// Obtener todos los leads
function getAllLeads() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM leads ORDER BY created_at DESC", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Obtener leads por estado
function getLeadsByStatus(estado) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM leads WHERE estado = ? ORDER BY created_at DESC", [estado], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Actualizar estado de lead
function updateLeadStatus(id, nuevoEstado) {
  return new Promise((resolve, reject) => {
    db.run("UPDATE leads SET estado = ? WHERE id = ?", [nuevoEstado, id], function(err) {
      if (err) {
        reject(err);
      } else {
        console.log(`✅ Lead ID ${id} actualizado a: ${nuevoEstado}`);
        saveLog('info', `Lead ID ${id} actualizado a: ${nuevoEstado}`);
        resolve({ success: true, changes: this.changes });
      }
    });
  });
}

// Eliminar lead por ID
function deleteLead(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM leads WHERE id = ?", [id], function(err) {
      if (err) {
        console.error('Error eliminando lead:', err.message);
        reject(err);
      } else {
        console.log(`✅ Lead ID ${id} eliminado correctamente`);
        saveLog('success', `Lead ID ${id} eliminado`, { id });
        
        resolve({
          success: true,
          deleted_id: id,
          changes: this.changes || 1 // Usar this.changes o fallback a 1
        });
      }
    });
  });
}

// Exportar leads a JSON
function exportLeadsToJSON() {
  return new Promise((resolve, reject) => {
    getAllLeads()
      .then(leads => {
        const jsonData = {
          export_date: new Date().toISOString(),
          total_leads: leads.length,
          leads: leads
        };
        
        resolve(jsonData);
      })
      .catch(reject);
  });
}

// Estadísticas
function getStats() {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        COUNT(*) as total_leads,
        COUNT(CASE WHEN estado = 'Nuevo Lead' THEN 1 END) as nuevos_leads,
        COUNT(CASE WHEN estado = 'Contactado' THEN 1 END) as contactados,
        COUNT(CASE WHEN estado = 'Auditoría Agendada' THEN 1 END) as auditorias_agendadas,
        COUNT(CASE WHEN estado = 'Convertido' THEN 1 END) as convertidos
      FROM leads
    `, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows[0]);
      }
    });
  });
}

// Cerrar base de datos
function closeDatabase() {
  db.close((err) => {
    if (err) {
      console.error('Error cerrando base de datos:', err.message);
    } else {
      console.log('✅ Base de datos cerrada');
    }
  });
}

module.exports = {
  db, // Exportar el objeto db para acceso directo
  saveLead,
  getAllLeads,
  getLeadsByStatus,
  updateLeadStatus,
  deleteLead,
  exportLeadsToJSON,
  getStats,
  saveLog,
  closeDatabase
};
