const { Sequelize } = require('sequelize');
const masterDb = require('../config/masterDbConfig');

const tenantConnections = {};

// Fetch tenant database URL
const fetchTenantDbConfig = async (tenantId) => {
  const [tenant] = await masterDb.query(
    'SELECT database_url FROM tenants WHERE id = :tenantId',
    {
      replacements: { tenantId },
      type: masterDb.QueryTypes.SELECT,
    }
  );
  if (!tenant) throw new Error(`No tenant found for ID: ${tenantId}`);
  return tenant.database_url;
};

// Get or create a tenant-specific connection
const getTenantConnection = async (tenantId) => {
  if (tenantConnections[tenantId]) return tenantConnections[tenantId];

  const databaseUrl = await fetchTenantDbConfig(tenantId);

  const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
  });

  tenantConnections[tenantId] = sequelize;
  return sequelize;
};

module.exports = { getTenantConnection };
