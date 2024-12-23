// Schema for users (e.g., admin accounts)
// src/models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    user_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    username: { 
        type: DataTypes.STRING, 
        unique: true, 
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING, 
        unique: true, 
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password_hash: { 
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [60, 60] // For bcrypt hash length
        }
    },
    role: { 
        type: DataTypes.STRING, 
        defaultValue: 'admin',
        validate: {
            isIn: [['admin', 'user', 'analyst']]
        } 
    },
    created_at: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    }

},
    {
        tableName: 'users',
        timestamps: true,
        indexes: [
            { fields: ['email'], name: 'idx_user_email' },
            { fields: ['username'], name: 'idx_user_username' }
        ]
    });

module.exports = User;
