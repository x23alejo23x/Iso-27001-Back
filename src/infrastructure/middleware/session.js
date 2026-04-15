// src/infrastructure/middleware/session.js

const sessions = new Map(); // En producción usar express-session con store en BD

function createSession(userId, userData) {
  const sessionId = require('crypto').randomUUID();
  sessions.set(sessionId, { userId, ...userData, createdAt: Date.now() });
  return sessionId;
}

function getSession(sessionId) {
  return sessions.get(sessionId) || null;
}

function destroySession(sessionId) {
  sessions.delete(sessionId);
}

function requireAuth(req, res, next) {
  const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
  if (!sessionId) return res.status(401).json({ message: 'No autenticado' });

  const session = getSession(sessionId);
  if (!session) return res.status(401).json({ message: 'Sesión inválida o expirada' });

  req.user = session;
  req.sessionId = sessionId;
  next();
}

function requireRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    if (!rolesPermitidos.includes(req.user.rol_id)) {
      return res.status(403).json({ message: 'Acceso no permitido' });
    }
    next();
  };
}

function requireMismaEmpresa(req, res, next) {
  const empresaIdParam = req.params.empresaId || req.body.empresa_id;
  if (empresaIdParam && empresaIdParam !== req.user.empresa_id) {
    return res.status(403).json({ message: 'Acceso no permitido a datos de otra empresa' });
  }
  next();
}

module.exports = { createSession, getSession, destroySession, requireAuth, requireRol, requireMismaEmpresa };