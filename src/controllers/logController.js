//Handles generic log ingestion
const logService = require('../services/logService');

const ingestLogs = async (req, res) => {
    try {
        const {
            agent_id,
            event_type,
            feature,
            // Common fields
            user_id,
            alert_level,
            metadata,
            // File access fields
            file_name,
            file_path,
            file_hash,
            // Process fields
            process_id,
            process_name,
            process_path,
            // Network fields
            src_ip,
            src_port,
            dest_ip,
            dest_port,
            protocol
        } = req.body;

        const logData = {
            agent_id,
            event_type,
            feature,
            user_id,
            alert_level,
            metadata,
            file_name,
            file_path,
            file_hash,
            process_id,
            process_name,
            process_path,
            src_ip,
            src_port,
            dest_ip,
            dest_port,
            protocol,

        };

        const log = await logService.create(logData);
        res.status(201).json({
            success: true,
            data: log
        });

    } catch (error) {
        console.error('Log ingestion failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    ingestLogs
};