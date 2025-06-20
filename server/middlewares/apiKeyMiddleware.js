/**
 * Middleware to check the validity of the API key in incoming requests.
 * - Allows requests to `/ping` and Swagger UI (`/api-docs` and its static files).
 * - Allows requests to `global.html`.
 * - For all other routes, checks the `x-api-key` header.
 * 
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to pass control to next middleware.
 */
export const apiKeyMiddleware = (req, res, next) => {
  const { url, headers } = req;

  if (
    url === '/ping' ||
    url.includes('global.html') ||
    url.startsWith('/api-docs')
  ) {
    return url === '/ping'
      ? res.status(200).json({ response: 'pong' })
      : next();
  }

  const apiKey = headers['x-api-key'];

  if (apiKey && apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(403).json({ error: 'Accès refusé : clé API invalide' });
  }
};