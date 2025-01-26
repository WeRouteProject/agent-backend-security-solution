// services/logService.js
const Log = require('../models/logModel');
const Policy = require('../models/policyModel');
const alertService = require('../services/alertService');

const create = async (logData) => {
    try {
        // 1. Validate required fields
        if (!logData.agent_id || !logData.event_type || !logData.feature) {
            throw new Error('Missing required fields: agent_id, event_type, and feature are mandatory');
        }

        // 2. Validate event_type format
        const validEventTypes = ['fileAccess', 'processExecution', 'networkActivity', 'statusUpdate'];
        if (!validEventTypes.includes(logData.event_type)) {
            throw new Error(`Invalid event_type. Must be one of: ${validEventTypes.join(', ')}`);
        }

        // 3. Data type validations
        if (logData.src_port && (isNaN(logData.src_port) || logData.src_port < 0 || logData.src_port > 65535)) {
            throw new Error('Invalid src_port. Must be between 0 and 65535');
        }
        if (logData.dest_port && (isNaN(logData.dest_port) || logData.dest_port < 0 || logData.dest_port > 65535)) {
            throw new Error('Invalid dest_port. Must be between 0 and 65535');
        }

        // 4. Event-specific validations
        switch(logData.event_type) {
            case 'networkActivity':
                if (!logData.src_ip || !logData.dest_ip || !logData.protocol) {
                    throw new Error('Network activity logs require src_ip, dest_ip, and protocol');
                }
                break;
            case 'processExecution':
                if (!logData.process_id || !logData.process_name) {
                    throw new Error('Process execution logs require process_id and process_name');
                }
                break;
            case 'fileAccess':
                if (!logData.file_name || !logData.file_path) {
                    throw new Error('File access logs require file_name and file_path');
                }
                break;
        }

        // 5. Metadata validation
        if (logData.metadata && typeof logData.metadata !== 'object') {
            throw new Error('Metadata must be an object');
        }

        // 6. Alert level validation
        const validAlertLevels = ['low', 'medium', 'high', 'critical'];
        if (logData.alert_level && !validAlertLevels.includes(logData.alert_level)) {
            throw new Error(`Invalid alert_level. Must be one of: ${validAlertLevels.join(', ')}`);
        }

        const logEntry = {
            timestamp: new Date(),
            agent_id: logData.agent_id,
            event_type: logData.event_type,
            feature: logData.feature,
            metadata: logData.metadata || {},
            user_id: logData.user_id || null,
            alert_level: logData.alert_level || null,
            // File related
            file_name: logData.file_name || null,
            file_path: logData.file_path || null,
            file_hash: logData.file_hash || null,file_content: logData.file_content ? String(logData.file_content) : null,
            // Process related
            process_id: logData.process_id || null,
            process_name: logData.process_name || null,
            process_path: logData.process_path || null,
            // Network related
            src_ip: logData.src_ip || null,
            src_port: logData.src_port || null,
            dest_ip: logData.dest_ip || null,
            dest_port: logData.dest_port || null,
            protocol: logData.protocol || null
        };

        // 7. IP address format validation
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (logEntry.src_ip && !ipRegex.test(logEntry.src_ip)) {
            throw new Error('Invalid src_ip format');
        }
        if (logEntry.dest_ip && !ipRegex.test(logEntry.dest_ip)) {
            throw new Error('Invalid dest_ip format');
        }

        try {
            // Create log first
            const log = await Log.create(logEntry);

            // In logService.js, update the policy checking section
if (logData.event_type === 'fileAccess' && logData.feature === 'DLP') {
    try {

        console.log('Log data received:', {
            file_name: logData.file_name,
            file_path: logData.file_path,
            file_content: logData.file_content
        });

        console.log('Fetching DLP policies');
        const policies = await Policy.findAll({
            where: { feature: 'DLP' }
        });

        console.log('Found policies:', policies);

        if (!policies.length) {
            console.log('No DLP policies found');
            return { log, action: 'allow' };
        }

        let fileTypeViolation = null;
        let violatingPolicy = null;

        // Check each policy
        for (const policy of policies) {
            const violation = await checkPolicyViolation(logData, policy);
            
            if (violation) {
                // Immediately return for path violations
                if (violation.type === 'restricted_path') {
                    await alertService.create({
                        log_id: log.log_id,
                        policy_id: policy.policy_id,
                        severity: violation.severity,
                        status: 'new',
                        details: {
                            policy_name: policy.name,
                            violation_type: violation.type,
                            file_name: logData.file_name,
                            file_path: logData.file_path,
                            action_taken: policy.action
                        }
                    });

                    return {
                        log,
                        action: 'block',
                        policy: policy.name,
                        details: violation
                    };
                }

                // Store file type violation but continue checking
                fileTypeViolation = violation;
                violatingPolicy = policy;
            }
        }

        // If no path violation but found file type violation
        if (fileTypeViolation && violatingPolicy) {
            await alertService.create({
                log_id: log.log_id,
                policy_id: violatingPolicy.policy_id,
                severity: fileTypeViolation.severity,
                status: 'new',
                details: {
                    policy_name: violatingPolicy.name,
                    violation_type: fileTypeViolation.type,
                    file_name: logData.file_name,
                    file_path: logData.file_path,
                    action_taken: violatingPolicy.action
                }
            });

            return {
                log,
                action: 'block',
                policy: violatingPolicy.name,
                details: fileTypeViolation
            };
        }
    } catch (policyError) {
        console.error('Policy check failed:', policyError);
    }
}
            return {
                log,
                action: 'allow'
            };
        } catch (dbError) {
            throw new Error(`Database operation failed: ${dbError.message}`);
        }

    } catch (error) {
        console.error('Log creation failed:', error);
        throw error;
    }
};

// Helper function to check policy violations
const checkPolicyViolation = async (logData, policy) => {
    try {
        const { rules } = policy;
        console.log('Checking policy:', policy.name);
        console.log('Rules:', JSON.stringify(rules, null, 2));
        console.log('Checking file content:', logData.file_content);
 
        // Check restricted paths first
        if (rules.restricted_paths?.length) {
            console.log('Has restricted paths:', rules.restricted_paths);
            for (const path of rules.restricted_paths) {
                console.log(`Checking path ${path} against ${logData.file_path}`);
                if (logData.file_path.includes(path)) {
                    console.log(`Path violation found for ${path}`);
                    return {
                        type: 'restricted_path',
                        path,
                        severity: 'high'
                    };
                }
            }
        }
 
        // Then check file types
        if (rules.file_types?.length) {
            const fileExt = logData.file_name.split('.').pop().toLowerCase();
            if (rules.file_types.includes(fileExt)) {
                console.log(`File type violation found for ${fileExt}`);
                return {
                    type: 'file_type_match',
                    severity: 'medium'
                };
            }
        }
 
        // Finally check patterns
        if (rules.patterns?.length && logData.file_content) {
            for (const pattern of rules.patterns) {
                try {
                    const regex = new RegExp(pattern);
                    if (regex.test(logData.file_content)) {
                        console.log(`Pattern match found for ${pattern}`);
                        return {
                            type: 'pattern_match',
                            pattern,
                            severity: 'high'
                        };
                    }
                } catch (error) {
                    console.error('Invalid regex pattern:', pattern);
                }
            }
        }
 
        return null;
    } catch (error) {
        console.error('Policy violation check failed:', error);
        throw error;
    }
 };


module.exports = { create };