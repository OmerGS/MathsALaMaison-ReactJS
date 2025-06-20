import jwt from 'jsonwebtoken';
import { logger } from '../config/logger.js';
import { pool } from '../config/database.js';
import { logDev } from '../services/logDev.js'

export const verifyToken = async (req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) logger.debug('📌 Cookies reçus:', req.cookies);

  const accessToken = req.cookies['accessToken'];
  const refreshToken = req.cookies['refreshToken'];

  if (!refreshToken) {
    logDev("❌ Aucun refreshToken fourni");
    return res.status(401).json({ message: 'Refresh token manquant' });
  }

  let decodedRefresh;
  try {
    decodedRefresh = jwt.verify(refreshToken, process.env.JWT_SECRET);
    logDev("✅ RefreshToken JWT valide. Vérification en base...");
  } catch (err) {
    logDev("❌ RefreshToken JWT invalide ou expiré :", err.message);
    return res.status(401).json({ message: 'Refresh token invalide ou expiré' });
  }

  const [rows] = await pool.query(
    'SELECT * FROM sessions WHERE refresh_token = ? AND user_id = ?',
    [refreshToken, decodedRefresh.userId]
  );

  if (rows.length === 0) {
    logDev("❌ RefreshToken inexistant ou révoqué en base.");
    return res.status(401).json({ message: 'Session invalide' });
  }

  const [userRows] = await pool.query(
    'SELECT * FROM User WHERE id = ?',
    [decodedRefresh.userId]
  );

  if (userRows.length === 0) {
    logDev("❌ Utilisateur introuvable.");
    return res.status(401).json({ message: 'Utilisateur non trouvé' });
  }

  const user = userRows[0];

  if (!user.isPremium) {
    logDev("❌ Utilisateur non premium.");
    return res.status(403).json({ message: 'Accès réservé aux utilisateurs premium' });
  }

  updateLastLoginIfNeeded(refreshToken);

  if (accessToken) {
    try {
      const decodedAccess = jwt.verify(accessToken, process.env.JWT_SECRET);
      logDev("✅ AccessToken valide.");
      req.user = decodedAccess;
      return next();
    } catch (err) {
      if (err.name !== 'TokenExpiredError') {
        logDev("❌ AccessToken invalide :", err.message);
        return res.status(401).json({ message: 'Access token invalide' });
      }
      logDev("🔁 AccessToken expiré, on en régénère un...");
    }
  }

  const newAccessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      isPremium: user.isPremium
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    secure: isProd,
    maxAge: 15 * 60 * 1000,
    path: '/'
  });

  logDev("✅ Nouveau accessToken généré et envoyé.");
  
  req.user = {
    userId: user.id,
    email: user.email,
    isPremium: user.isPremium,
  };
  
  return next();
};

function updateLastLoginIfNeeded(refreshToken) {
  pool.query(
    'UPDATE sessions SET last_login = NOW() WHERE refresh_token = ?',
    [refreshToken]
  ).catch((err) => {
    logDev('⚠️ Erreur updateLastLoginByToken:', err);
  });
}

export const verifyAdmin = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const [rows] = await pool.execute(
      'SELECT specialRole FROM User WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      logDev(`Utilisateur ID ${userId} non trouvé dans la base`);
      return res.status(403).json({ message: 'Accès refusé : accès admin requis' });
    }

    if (rows[0].specialRole !== 'admin') {
      logDev(`Utilisateur ID ${userId} n'a pas le rôle admin (rôle: ${rows[0].specialRole})`);
      return res.status(403).json({ message: 'Accès refusé : accès admin requis' });
    }

    logDev(`Utilisateur ID ${userId} authentifié comme admin`);
    next();
  } catch (error) {
    logDev('Erreur lors de la vérification admin:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la vérification admin' });
  }
};