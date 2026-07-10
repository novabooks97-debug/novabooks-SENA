const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

let db = null;

/**
 * Inicializar base de datos SQLite
 */
function initializeDatabase() {
  const dbDir = path.join(__dirname, '../database');
  fs.ensureDirSync(dbDir);

  db = new sqlite3.Database(path.join(dbDir, 'novabook.db'), (err) => {
    if (err) {
      console.error('❌ Error conectando a BD:', err);
      process.exit(1);
    }
    console.log('✅ Base de datos conectada');
    createTables();
  });
}

/**
 * Crear tablas si no existen
 */
function createTables() {
  db.serialize(() => {
    // Tabla de conversaciones
    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        sessionId TEXT
      )
    `);

    // Tabla de leads
    db.run(`
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        userId TEXT,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        message TEXT,
        status TEXT DEFAULT 'new',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de índices RAG
    db.run(`
      CREATE TABLE IF NOT EXISTS rag_index (
        id TEXT PRIMARY KEY,
        source TEXT NOT NULL,
        content TEXT NOT NULL,
        embedding TEXT,
        lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP,
        category TEXT
      )
    `);

    // Tabla de sesiones de usuario
    db.run(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        sessionId TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastActivity DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('📊 Tablas de base de datos creadas/verificadas');
  });
}

/**
 * Guardar mensaje en historial
 */
function saveMessage(userId, role, content, sessionId = null) {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    db.run(
      `INSERT INTO messages (id, userId, role, content, sessionId) 
       VALUES (?, ?, ?, ?, ?)`,
      [id, userId, role, content, sessionId],
      function(err) {
        if (err) reject(err);
        else resolve(id);
      }
    );
  });
}

/**
 * Obtener historial de usuario
 */
function getUserHistory(userId, limit = 20) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM messages 
       WHERE userId = ? 
       ORDER BY timestamp DESC 
       LIMIT ?`,
      [userId, limit],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows ? rows.reverse() : []);
      }
    );
  });
}

/**
 * Guardar lead/contacto
 */
function saveLead(leadData) {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const { userId, name, email, phone, message } = leadData;

    db.run(
      `INSERT INTO leads (id, userId, name, email, phone, message) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, userId, name, email, phone, message],
      function(err) {
        if (err) {
          console.error('Error guardando lead:', err);
          reject(err);
        } else {
          console.log(`✅ Lead guardado: ${name} (${email || phone})`);
          resolve(id);
        }
      }
    );
  });
}

/**
 * Guardar índice RAG
 */
function saveRAGIndex(source, content, category = 'web') {
  return new Promise((resolve, reject) => {
    const id = uuidv4();

    db.run(
      `INSERT OR REPLACE INTO rag_index (id, source, content, category, lastUpdated) 
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [id, source, content, category],
      function(err) {
        if (err) reject(err);
        else resolve(id);
      }
    );
  });
}

/**
 * Obtener todos los índices RAG
 */
function getRAGIndex() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT source, content, category FROM rag_index ORDER BY lastUpdated DESC`,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

/**
 * Guardar sesión de usuario
 */
function saveUserSession(sessionId, userId) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO user_sessions (sessionId, userId) VALUES (?, ?)`,
      [sessionId, userId],
      function(err) {
        if (err) reject(err);
        else resolve(sessionId);
      }
    );
  });
}

module.exports = {
  initializeDatabase,
  saveMessage,
  getUserHistory,
  saveLead,
  saveRAGIndex,
  getRAGIndex,
  saveUserSession
};
