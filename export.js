// Script para exportar leads de la base de datos
const db = require('./database');
const fs = require('fs');

async function exportLeads() {
  try {
    console.log('📊 Exportando leads desde base de datos...');
    
    // Obtener todos los leads
    const leads = await db.getAllLeads();
    
    // Crear archivo JSON
    const exportData = {
      export_date: new Date().toISOString(),
      total_leads: leads.length,
      leads: leads
    };
    
    // Guardar en archivo
    const filename = `orchestrai_leads_export_${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(filename, JSON.stringify(exportData, null, 2));
    
    console.log(`✅ Leads exportados a: ${filename}`);
    console.log(`📈 Total leads: ${leads.length}`);
    
    // Mostrar estadísticas
    const stats = await db.getStats();
    console.log('\n📊 Estadísticas:');
    console.log(`   Total leads: ${stats.total_leads}`);
    console.log(`   Nuevos: ${stats.nuevos_leads}`);
    console.log(`   Contactados: ${stats.contactados}`);
    console.log(`   Auditorías agendadas: ${stats.auditorias_agendadas}`);
    console.log(`   Convertidos: ${stats.convertidos}`);
    
    return filename;
    
  } catch (error) {
    console.error('❌ Error exportando leads:', error);
    throw error;
  }
}

// Exportar a CSV
async function exportToCSV() {
  try {
    console.log('📊 Exportando leads a CSV...');
    
    const leads = await db.getAllLeads();
    
    // Crear CSV
    let csv = 'ID,Fecha,Nombre,Email,Empresa,Teléfono,Tamaño,Mensaje,Estado,Fuente\n';
    
    leads.forEach(lead => {
      csv += `${lead.id},"${lead.timestamp}","${lead.nombre}","${lead.email}","${lead.empresa || ''}","${lead.telefono || ''}","${lead.tamano || ''}","${lead.mensaje || ''}","${lead.estado}","${lead.fuente}"\n`;
    });
    
    const filename = `orchestrai_leads_${new Date().toISOString().split('T')[0]}.csv`;
    fs.writeFileSync(filename, csv);
    
    console.log(`✅ Leads exportados a CSV: ${filename}`);
    return filename;
    
  } catch (error) {
    console.error('❌ Error exportando a CSV:', error);
    throw error;
  }
}

// Si se ejecuta directamente
if (require.main === module) {
  const command = process.argv[2];
  
  switch(command) {
    case 'json':
      exportLeads();
      break;
    case 'csv':
      exportToCSV();
      break;
    default:
      console.log('Uso: node export.js [json|csv]');
      console.log('  json - Exporta a formato JSON');
      console.log('  csv  - Exporta a formato CSV');
  }
}

module.exports = {
  exportLeads,
  exportToCSV
};
