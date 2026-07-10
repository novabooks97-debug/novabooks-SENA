const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { initializeDatabase, saveMessage, getUserHistory, saveLead } = require('./services/database');
const { indexWebContent, searchRAG, getGPTResponse } = require('./services/ai-service');
const { generateUserSession } = require('./utils/user-session');

const app = express();

// MIDDLEWARE
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// INICIALIZAR BASE DE DATOS
initializeDatabase();

// INDEXAR CONTENIDO WEB AL INICIAR
console.log('📚 Indexando contenido web...');
indexWebContent('./index.html');

// ENDPOINTS

/**
 * POST /api/chat
 * Endpoint principal del chatbot
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId, sessionId } = req.body;

    if (!message || !userId) {
      return res.status(400).json({ error: 'Mensaje y userId requeridos' });
    }

    // Obtener historial del usuario
    const history = getUserHistory(userId, 10);

    // Buscar contexto relevante en RAG
    const ragContext = searchRAG(message);

    // Obtener respuesta de GPT-4o
    const gptResponse = await getGPTResponse(
      message,
      ragContext,
      history,
      userId
    );

    // Guardar mensaje en historial
    saveMessage(userId, 'user', message);
    saveMessage(userId, 'assistant', gptResponse.reply);

    // Detectar intención de lead
    if (gptResponse.isLeadCapture) {
      // El bot pedirá datos de contacto en el siguiente mensaje
      return res.json({
        reply: gptResponse.reply,
        isLeadCapture: true,
        redirect: gptResponse.redirect || null,
        conversationId: sessionId
      });
    }

    res.json({
      reply: gptResponse.reply,
      redirect: gptResponse.redirect || null,
      conversationId: sessionId,
      sources: ragContext.sources
    });

  } catch (error) {
    console.error('Error en /api/chat:', error);
    res.status(500).json({ error: 'Error procesando el mensaje' });
  }
});

/**
 * POST /api/lead
 * Guardar datos de lead
 */
app.post('/api/lead', (req, res) => {
  try {
    const { name, email, phone, userId, message } = req.body;

    if (!name || (!email && !phone)) {
      return res.status(400).json({ error: 'Nombre y email/teléfono requeridos' });
    }

    const leadId = saveLead({
      userId,
      name,
      email,
      phone,
      message,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      leadId,
      message: 'Datos guardados correctamente. Nos pondremos en contacto pronto.'
    });

  } catch (error) {
    console.error('Error en /api/lead:', error);
    res.status(500).json({ error: 'Error guardando datos de contacto' });
  }
});

/**
 * GET /api/history/:userId
 * Obtener historial de conversación
 */
app.get('/api/history/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const history = getUserHistory(userId);

    res.json({
      userId,
      history,
      count: history.length
    });

  } catch (error) {
    console.error('Error en /api/history:', error);
    res.status(500).json({ error: 'Error obteniendo historial' });
  }
});

/**
 * POST /api/session/new
 * Crear nueva sesión
 */
app.post('/api/session/new', (req, res) => {
  try {
    const { userId } = req.body;
    const sessionData = generateUserSession(userId);

    res.json({
      sessionId: sessionData.sessionId,
      userId: sessionData.userId,
      timestamp: sessionData.timestamp
    });

  } catch (error) {
    console.error('Error en /api/session/new:', error);
    res.status(500).json({ error: 'Error creando sesión' });
  }
});

/**
 * GET /api/health
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// INICIAR SERVIDOR
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor chatbot ejecutándose en http://localhost:${PORT}`);
  console.log(`📡 CORS habilitado para: ${process.env.FRONTEND_URL || '*'}`);
  console.log(`🤖 Modelo: ${process.env.OPENAI_MODEL}`);
  console.log(`✅ Base de datos: lista\n`);
});

module.exports = app;
