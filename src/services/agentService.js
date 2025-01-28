
const Agent = require('../models/agentModel');
const logService = require('../services/logService');

const registerAgent = async ({ 
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
}) => {

    if (!name || !os || !device_name || !organization || !environment || 
        !location || !admin_email || !policy_group || !license_key) {
        throw new Error('Missing required fields');
    }

    try {
        const newAgent = await Agent.create({
            name,
            os,
            features,
            device_name,
            organization,
            environment,
            location,
            admin_email,
            policy_group,
            license_key,
            status: 'active'
        });

        return {
            id: newAgent.agent_id,
            name: newAgent.name,
            os: newAgent.os,
            status: newAgent.status,
            features: newAgent.features,
            device_name: newAgent.device_name,
            organization: newAgent.organization,
            environment: newAgent.environment,
            location: newAgent.location,
            admin_email: newAgent.admin_email,
            policy_group: newAgent.policy_group,
            license_key: newAgent.license_key,
            last_seen: newAgent.last_seen,
        };
    }
    catch (error) {
        throw new Error('Error registering agent: ' + error.message);
    }
};

const updateStatus = async ({ 
    agent_id, 
    status, 
    features,
    device_name,
    organization,
    environment,
    location,
    admin_email,
    policy_group 
}) => {
    if (!agent_id || !status || !features) {
        console.log('Required fields are not proper while agent status update');
        throw new Error('Required fields are not proper while agent status update');
    }

    try {
        const agent = await Agent.findByPk(agent_id);
        if (!agent) {
            console.log('Agent not found while agent status update');
            throw new Error('Agent not found while agent status update');
        }

        // Create update object
        const updateData = {
            status,
            features,
            last_seen: new Date()
        };

        // Add optional fields if provided
        if (device_name) updateData.device_name = device_name;
        if (organization) updateData.organization = organization;
        if (environment) updateData.environment = environment;
        if (location) updateData.location = location;
        if (admin_email) updateData.admin_email = admin_email;
        if (policy_group) updateData.policy_group = policy_group;

        await agent.update(updateData);

        await logService.create({
            agent_id: agent_id,
            timestamp: new Date(),
            event_type: 'statusUpdate',
            feature: features[0],
            metadata: { 
                status,
                device_name: agent.device_name,
                organization: agent.organization,
                environment: agent.environment,
                location: agent.location,
                policy_group: agent.policy_group
            }
        });

        if (status === 'disconnected') {
            await Alert.create({
                agent_id: agent_id,
                severity: 'high',
                status: 'new',
                details: {
                    message: 'Agent disconnected',
                    device_name: agent.device_name,
                    organization: agent.organization,
                    location: agent.location
                }
            });
        }

        return agent;
    }
    catch (error) {
        console.error('Agent status update failed:', error);
        throw error;
    }
}

module.exports = { registerAgent, updateStatus };