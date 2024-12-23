const { body } = require('express-validator');

const agentValidator = [
    body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),

    body('os')
    .notEmpty().withMessage('Os is required')
    .isString().withMessage('Os must be in string'),

    body('features')
    .optional()
    .isArray().withMessage('Features must be an array of strings')
    .custom(value => {
        if (value && !value.every(f => ['DLP', 'EDR', 'UEBA', 'UBA'].includes(f))) {
            throw new Error('Invalid feature in the list');
        }
        return true;
    }),

    body('status')
        .optional()
        .isIn(['active', 'inactive', 'disconnected']).withMessage('Invalid status value'),

    body('last_seen')
        .optional()
        .isISO8601().withMessage('Last seen must be a valid date (ISO 8601 format)'),

];

module.exports = agentValidator;