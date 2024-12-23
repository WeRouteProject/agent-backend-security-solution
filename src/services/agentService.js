
const Agent = require('../models/agentModel');

const registerAgent = async ({name, os, features }) => {

    if(!name || !os ) {
        throw new Error('Name and OS are required fields'); 
    }

    try{
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
    catch(error){
        throw new Error('Error registering agent: ' + error.message);
    }
};

module.exports = {registerAgent};