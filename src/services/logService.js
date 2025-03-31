// services/logService.js
const { sequelize } = require('../config/db');
const Log = require('../models/logModel');
const DlpFile = require('../models/dlpFileModel');
const dlpService = require('./featureServices/dlpService');
const EmailActivity = require('../models/emailActivityModel');


const create = async (logData) => {
    try {
        // Validate required fields
        if (!logData.agent_id || !logData.event_type || !logData.feature) {
            throw new Error('Missing required fields: agent_id, event_type, and feature are mandatory');
        }

        // Validate event_type format
        const validEventTypes = ['fileAccess', 'processExecution', 'networkActivity', 'statusUpdate', 'emailActivity'];
        if (!validEventTypes.includes(logData.event_type)) {
            throw new Error(`Invalid event_type. Must be one of: ${validEventTypes.join(', ')}`);
        }

        // Create transaction to ensure data consistency
        const result = await sequelize.transaction(async (t) => {
            // Create core log entry
            const log = await Log.create({
                timestamp: new Date(),
                agent_id: logData.agent_id,
                event_type: logData.event_type,
                feature: logData.feature,
                alert_level: logData.alert_level,
                metadata: logData.metadata || {},
            }, { transaction: t });

            // Create feature-specific records based on event type
            if (logData.event_type === 'fileAccess' && logData.feature === 'DLP') {
                await DlpFile.create({
                    log_id: log.log_id,
                    file_name: logData.file_name || null,
                    file_path: logData.file_path || null,
                    file_hash: logData.file_hash || null,
                    file_content: logData.file_content ? String(logData.file_content) : null,
                    user_id: logData.user_id || null
                }, { transaction: t });
            }
            
            // Move email activity creation inside the transaction
            if (logData.event_type === 'emailActivity' && logData.feature === 'DLP') {
                console.log('Email data before create:', {
                    sender: logData.email_sender,
                    recipients: logData.email_recipients,
                    subject: logData.email_subject
                });
                
                await EmailActivity.create({
                    log_id: log.log_id,
                    email_sender: logData.email_sender || null,
                    email_recipients: logData.email_recipients || [],
                    email_subject: logData.email_subject || null,
                    email_content: logData.email_content || null,
                    has_attachments: logData.has_attachments || false,
                    attachment_names: logData.attachment_names || [],
                    attachment_count: logData.attachment_count || 0
                }, { transaction: t });
            }

            return log;
        });

        // After successful transaction, process with appropriate service
        if (logData.event_type === 'fileAccess' && logData.feature === 'DLP') {
            // Retrieve log with DLP file data
            const logWithRelations = await Log.findByPk(result.log_id, {
                include: [{
                    model: DlpFile,
                    as: 'dlpFile'
                }]
            });
            
            // Process with DLP service
            return await dlpService.processFileAccessLog(logWithRelations, logData);
        }

        if (logData.event_type === 'emailActivity' && logData.feature === 'DLP') {
            // Retrieve log with email data
            const logWithRelations = await Log.findByPk(result.log_id, {
                include: [{
                    model: EmailActivity,
                    as: 'emailActivity'
                }]
            });
            
            // Process with DLP service
            return await dlpService.processEmailLog(logWithRelations, logData);
        }
        
        // Default return
        return {
            log: result,
            action: 'allow'
        };
    } catch (error) {
        console.error('Log creation failed:', error);
        throw error;
    }
};

module.exports = { create };