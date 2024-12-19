//Shared schema for all alerts

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Agent = sequelize.define('Agent', {
  agentId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    description: 'Name or hostname of the agent',
  },
  os: {
    type: DataTypes.STRING,
    allowNull: true,
    description: 'Operating system of the agent (e.g., Windows, Linux)',
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true,
    description: 'Features enabled on the agent (e.g., ["DLP", "EDR"])',
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
  lastSeen: {
    type: DataTypes.DATE,
    allowNull: true,
    description: 'Last communication time of the agent',
  },
}, {
  tableName: 'agents',
  timestamps: false,
});

module.exports = Agent;
