const { getTenantConnection } = require('../tenant/tenantManager');

const tenantMiddleware = async (req, res, next) => {
  const { tenantId } = req.headers;

  if (!tenantId) return res.status(400).json({ error: 'Tenant ID is required.' });

  try {
    // Verify tenant connection
    req.tenantDb = await getTenantConnection(tenantId);
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Invalid Tenant ID.' });
  }
};

module.exports = tenantMiddleware;
