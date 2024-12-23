const agentService = require('../services/agentService');

exports.registerAgentController = async (request, response) => {
    try {
        const { name, os, features } = request.body;

        const agentData = await agentService.registerAgent({ name, os, features });

        response.status(201).json({
            message: 'Agent registered successfully',
            agent: agentData,
        });
    } catch (error) {
        console.error('Error registering agent:', error.message);
        res.status(500).json({
            message: 'Internal server error while registering agent',
            error: error.message,
        });
    }
};