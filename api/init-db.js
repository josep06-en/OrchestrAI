// Inicialización de Base de Datos - Vercel Postgres
const { createClient } = require('@vercel/postgres');

export default async function handler(req, res) {
  try {
    const client = createClient();
    await client.connect();

    // Crear tabla de leads
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        timestamp TEXT NOT NULL,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL,
        empresa TEXT,
        telefono TEXT,
        tamano TEXT,
        mensaje TEXT,
        estado TEXT DEFAULT 'Nuevo Lead',
        fuente TEXT DEFAULT 'web',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de logs
    await client.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id SERIAL PRIMARY KEY,
        timestamp TEXT NOT NULL,
        level TEXT NOT NULL,
        message TEXT NOT NULL,
        data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.end();

    return new Response(JSON.stringify({
      status: 'success',
      message: 'Base de datos inicializada correctamente'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error inicializando base de datos:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
