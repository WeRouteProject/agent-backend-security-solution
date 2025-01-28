
const Agent = require('../models/agentModel');
const logService = require('../services/logService');

const registerAgent = async ({ name, os, features }) => {

    if (!name || !os) {
        throw new Error('Name and OS are required fields');
    }

    try {
        const newAgent = await Agent.create({
            name,
            os,
            features,
            status: 'active',
        });

        return {
            id: newAgent.agent_id,
            name: newAgent.name,
            os: newAgent.os,
            status: newAgent.status,
            features: newAgent.features,
            last_seen: newAgent.last_seen,
        };
    }
    catch (error) {
        throw new Error('Error registering agent: ' + error.message);
    }
};

const updateStatus = async ({ agent_id, status, features }) => {

    if (!agent_id || !status || !features ) {
        console.log('Required fields are not proper while agent status update');
        throw new Error('Required fields are not proper while agent status update');
    }

    try {
        const agent = await Agent.findByPk(agent_id);
        if (!agent) {
            console.log('Agent not found while agent status update');
            throw new Error('Agent not found while agent status update');
        }

        await agent.update({
            status,
            features,
            last_seen: new Date()
        });

        await logService.create({
            agent_id: agent_id,
            timestamp: new Date(),
            event_type: 'statusUpdate',
            feature: features[0],
            metadata: { status }
        });

        if (status === 'disconnected') {
            await Alert.create({
                agent_id: agent_id,
                severity: 'high',
                status: 'new',
                details: 'Agent disconnected'
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