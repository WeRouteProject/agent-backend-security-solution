const agentService = require('../services/agentService');

exports.registerAgentController = async (request, response) => {
    try {
        const { name, 
            os, 
            features, 
            device_name,
            organization,
            environment,
            location,
            admin_email,
            policy_group,
            license_key} = request.body;

        const agentData = await agentService.registerAgent({ 
            name, 
            os, 
            features,
            device_name,
           organization,
           environment,
           location,
           admin_email,
           policy_group,
           license_key
        });

        response.status(201).json({
            message: 'Agent registered successfully',
            agent: agentData,
        });
    } catch (error) {
        console.error('Error registering agent:', error.message);
        response.status(500).json({
            message: 'Internal server error while registering agent',
            error: error.message,
        });
    }
};

exports.updateAgentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, features,
            device_name,
           organization,
           environment,
           location,
           admin_email,
           policy_group
         } = req.body;
        const updatedAgent = await agentService.updateStatus({
            agent_id: id,
            status,
            features,
            device_name,
           organization,
           environment,
           location,
           admin_email,
           policy_group
        });
        res.json(updatedAgent);
    } catch (error) {
        res.status(500).json(error.message);
    }
};