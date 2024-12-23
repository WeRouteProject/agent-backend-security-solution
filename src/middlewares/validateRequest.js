//Validate incoming requests
// middlewares/validateRequest.js

const { validationResult } = require('express-validator');

const validateRequest = (validations) => {
    return async (req, res, next) => {
        
        try{
            await Promise.all(validations.map(validation => validation.run(req)));

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation errors occurred',
                    errors: errors.array().map(err => ({
                        field: err.param,
                        message: err.msg,
                    }))
                });
            }
            next();
        }
        catch(err){
            console.error('Validation error:', err);
      res.status(500).json({
        success: false,
        message: 'Internal server error during validation',
      });
        }
    };
};

module.exports = validateRequest;