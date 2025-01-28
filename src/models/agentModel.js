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
          const validFeatures = ['DLP', 'EDR', 'UBEA', 'UBA'];
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

  device_name: {
    type: DataTypes.STRING,
    allowNull: false,
    description: 'Device name for the agent'
},
organization: {
    type: DataTypes.STRING,
    allowNull: false,
    description: 'Organization the agent belongs to'
},
environment: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
        isIn: [['production', 'staging', 'development', 'testing']]
    }
},
location: {
    type: DataTypes.STRING,
    allowNull: false,
    description: 'Physical/Geographic location'
},
admin_email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
        isEmail: true
    }
},
policy_group: {
    type: DataTypes.STRING,
    allowNull: false,
    description: 'Policy group assigned to agent'
},
license_key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    description: 'Unique license key for the agent'
}

}, {
  tableName: 'agents',
  timestamps: false,
  indexes: [{
    fields: ['status', 'last_seen'],
    name: 'idx_agent_status'
}]
});

module.exports = Agent;
