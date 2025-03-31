// models/dlpFileModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Log = require('./logModel');

const DlpFile = sequelize.define('DlpFile', {
    dlp_file_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    log_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'logs',
            key: 'log_id',
        },
        onDelete: 'CASCADE',
    },
    file_name: { type: DataTypes.STRING },
    file_path: { type: DataTypes.TEXT },
    file_hash: { type: DataTypes.STRING },
    file_content: { type: DataTypes.TEXT },
    user_id: { type: DataTypes.STRING }
}, {
    tableName: 'dlp_files',
    timestamps: false,
    indexes: [
        { fields: ['log_id'], name: 'idx_dlp_file_log' }
    ]
});

// Define association
Log.hasOne(DlpFile, { foreignKey: 'log_id', as: 'dlpFile' });
DlpFile.belongsTo(Log, { foreignKey: 'log_id' });

module.exports = DlpFile;