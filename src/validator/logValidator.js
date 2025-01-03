// middlewares/validators/logValidator.js
const { body, check } = require('express-validator');

const commonValidations = [
    body('agent_id').isInt().notEmpty(),
    body('event_type').isIn(['fileAccess', 'processExecution', 'networkActivity']),
    body('feature').isIn(['DLP', 'EDR', 'UEBA', 'UBA']),
    body('metadata').optional().isObject()
];

const fileAccessValidations = [
    body('file_name').notEmpty().isString(),
    body('file_path').notEmpty().isString(),
    body('file_hash').optional().isString(),
    body('user_id').optional().isString(),
    body('alert_level').optional().isIn(['low', 'medium', 'high', 'critical'])
];

const processValidations = [
    body('process_id').notEmpty().isString(),
    body('process_name').notEmpty().isString(),
    body('process_path').notEmpty().isString(),
    body('user_id').optional().isString(),
    body('alert_level').optional().isIn(['low', 'medium', 'high', 'critical'])
];

const networkValidations = [
    body('src_ip').notEmpty().isIP(),
    body('src_port').isInt({ min: 0, max: 65535 }),
    body('dest_ip').notEmpty().isIP(),
    body('dest_port').isInt({ min: 0, max: 65535 }),
    body('protocol').isIn(['TCP', 'UDP', 'HTTP', 'HTTPS', 'FTP']),
    body('alert_level').optional().isIn(['low', 'medium', 'high', 'critical'])
];

const validateLogIngestion = [
    ...commonValidations,
    check().custom((value, { req }) => {
        switch (req.body.event_type) {
            case 'fileAccess':
                return fileAccessValidations.every(validation => 
                    validation.run(req));
            case 'processExecution':
                return processValidations.every(validation => 
                    validation.run(req));
            case 'networkActivity':
                return networkValidations.every(validation => 
                    validation.run(req));
            default:
                throw new Error('Invalid event type');
        }
    })
];

module.exports = { validateLogIngestion };