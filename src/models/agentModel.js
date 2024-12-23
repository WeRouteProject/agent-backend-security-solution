//Shared schema for all alerts

const { DataTypes } = require('sequelize');
const { sequelize }= require('../config/db');

const Agent = sequelize.define('Agent', {
  agent_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    description: 'Name or hostname of the agent',
  },
  os: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: [['Windows', 'Linux', 'MacOS']]
  }
  },
  features: {
    type: DataTypes.JSONB,
    allowNull: true,
    validate: {
      isValidFeatures(value) {
          const validFeatures = ['DLP', 'EDR', 'UEBA', 'UBA'];
          if (!Array.isArray(value) || !value.every(f => validFeatures.includes(f))) {
              throw new Error('Invalid features');
          }
      }
  }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'inactive',
    validate: {
      isIn: [['active', 'inactive', 'disconnected']],
    },
    description: 'Current status of the agent',
  },
  last_seen: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
    description: 'Last communication time of the agent',
  },
}, {
  tableName: 'agents',
  timestamps: false,
  indexes: [{
    fields: ['status', 'last_seen'],
    name: 'idx_agent_status'
}]
});

module.exports = Agent;
