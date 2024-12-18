const { Sequelize } = require('sequelize');

// Development Database Configuration
const DEVELOPMENT_DB = {
  user: 'upender',
  host: 'localhost',
  database: 'masterdb',
  password: 'postgres',
  port: '5432',
};

// Master Database Connection
const sequelize = new Sequelize(DEVELOPMENT_DB.database, DEVELOPMENT_DB.user, DEVELOPMENT_DB.password, {
  host: DEVELOPMENT_DB.host,
  port: DEVELOPMENT_DB.port,
  dialect: 'postgres', // Specify the database dialect
  logging: false, // Disable SQL logging for cleaner console
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the master database has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the master database:', error);
  });

module.exports = sequelize;
