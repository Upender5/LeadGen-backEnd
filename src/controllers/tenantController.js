const masterDb = require('../config/masterDbConfig');
const { Sequelize } = require('sequelize');
const { Client } = require('pg'); 

const createTenant = async (req, res) => {
  const { name, database_url } = req.body;

  if (!name || !database_url) {
    return res.status(400).json({ error: 'Name and database URL are required.' });
  }

  try {
    await masterDb.query(
      'INSERT INTO tenants (name, database_url) VALUES (:name, :database_url)',
      { replacements: { name, database_url } }
    );

    const dbUrlRegex = /^postgres:\/\/(?<user>.+?):(?<password>.+?)@(?<host>.+?):(?<port>\d+)\/(?<database>.+)$/;
    const match = dbUrlRegex.exec(database_url);

    if (!match) {
      return res.status(400).json({ error: 'Invalid database URL format.' });
    }

    const { user, password, host, port, database } = match.groups;

    const client = new Client({
      user,
      host,
      port,
      password,
      database: 'postgres', 
    });

    await client.connect();
    await client.query(`CREATE DATABASE "${database}"`);
    await client.end();

    const tenantDb = new Sequelize(database_url, { dialect: 'postgres' });
    await tenantDb.sync();

    return res.status(201).json({ message: 'Tenant created successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create tenant.' });
  }
};

module.exports = { createTenant };
