const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Lead', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    traffic_source: {
      type: DataTypes.ENUM('organic', 'paid', 'referral'),
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });
};
