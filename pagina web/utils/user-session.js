const { v4: uuidv4 } = require('uuid');
const { saveUserSession } = require('../services/database');

/**
 * Generar nueva sesión de usuario
 */
function generateUserSession(userId = null) {
  const sessionId = uuidv4();
  const actualUserId = userId || uuidv4();

  saveUserSession(sessionId, actualUserId).catch(err => {
    console.error('Error guardando sesión:', err);
  });

  return {
    sessionId,
    userId: actualUserId,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  generateUserSession
};
