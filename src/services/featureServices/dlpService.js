// services/featureServices/dlpService.js
const Policy = require('../../models/policyModel');
const alertService = require('../alertService');

// Process file access logs
const processFileAccessLog = async (log, logData) => {
    try {
        // Get DLP file data from relation
        const dlpFile = log.dlpFile;
        if (!dlpFile) {
            console.log('No DLP file data found for log');
            return { log, action: 'allow' };
        }

        // Fetch applicable DLP policies
        const policies = await Policy.findAll({
            where: { feature: 'DLP' }
        });

        if (!policies.length) {
            return { log, action: 'allow' };
        }

        let fileTypeViolation = null;
        let violatingPolicy = null;

        // Check each policy
        for (const policy of policies) {
            // Check policy against file data from related model
            const violation = await checkPolicyViolation({
                file_name: dlpFile.file_name,
                file_path: dlpFile.file_path,
                file_content: dlpFile.file_content
            }, policy);
            
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
                            file_name: dlpFile.file_name,
                            file_path: dlpFile.file_path,
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
                    file_name: dlpFile.file_name,
                    file_path: dlpFile.file_path,
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

        return { log, action: 'allow' };
    } catch (error) {
        console.error('DLP processing failed:', error);
        throw error;
    }
};

// Keep existing checkPolicyViolation implementation
const checkPolicyViolation = async (fileData, policy) => {
    try {
        const { rules } = policy;
        
        // Check restricted paths first
        if (rules.restricted_paths?.length) {
            for (const path of rules.restricted_paths) {
                if (fileData.file_path.includes(path)) {
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
            const fileExt = fileData.file_name.split('.').pop().toLowerCase();
            if (rules.file_types.includes(fileExt)) {
                return {
                    type: 'file_type_match',
                    severity: 'medium'
                };
            }
        }
 
        // Finally check patterns
        if (rules.patterns?.length && fileData.file_content) {
            for (const pattern of rules.patterns) {
                try {
                    const regex = new RegExp(pattern);
                    if (regex.test(fileData.file_content)) {
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

// Process email logs
const processEmailLog = async (log, logData) => {
    try {
        // Get email data from relation
        const emailData = log.emailActivity;
        if (!emailData) {
            console.log('No email data found for log');
            return { log, action: 'allow' };
        }

        // Fetch applicable DLP policies
        const policies = await Policy.findAll({
            where: { feature: 'DLP' }
        });

        if (!policies.length) {
            return { log, action: 'allow' };
        }

        // Check each policy
        for (const policy of policies) {
            const violation = await checkEmailPolicyViolation(emailData, policy);
            
            if (violation) {
                await alertService.create({
                    log_id: log.log_id,
                    policy_id: policy.policy_id,
                    severity: violation.severity,
                    status: 'new',
                    details: {
                        policy_name: policy.name,
                        violation_type: violation.type,
                        email_subject: emailData.email_subject,
                        email_sender: emailData.email_sender,
                        email_recipients: emailData.email_recipients,
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
        }

        return { log, action: 'allow' };
    } catch (error) {
        console.error('Email DLP processing failed:', error);
        throw error;
    }
};

// Email policy violation checks
const checkEmailPolicyViolation = async (emailData, policy) => {
    try {
        const { rules } = policy;
        
        // Check domain restrictions
        if (rules.blocked_domains && Array.isArray(rules.blocked_domains)) {
            for (const recipient of emailData.email_recipients) {
                const domain = recipient.split('@')[1];
                if (rules.blocked_domains.includes(domain)) {
                    return {
                        type: 'blocked_domain',
                        domain,
                        severity: 'high'
                    };
                }
            }
        }
        
        // Check recipient restrictions
        if (rules.restricted_recipients && Array.isArray(rules.restricted_recipients)) {
            for (const recipient of emailData.email_recipients) {
                if (rules.restricted_recipients.includes(recipient)) {
                    return {
                        type: 'restricted_recipient',
                        recipient,
                        severity: 'high'
                    };
                }
            }
        }
        
        // Check subject keywords
        if (rules.subject_keywords && Array.isArray(rules.subject_keywords) && emailData.email_subject) {
            for (const keyword of rules.subject_keywords) {
                if (emailData.email_subject.toLowerCase().includes(keyword.toLowerCase())) {
                    return {
                        type: 'subject_keyword_match',
                        keyword,
                        severity: 'medium'
                    };
                }
            }
        }
        
        // Check email content patterns
        if (rules.patterns && Array.isArray(rules.patterns) && emailData.email_content) {
            console.log('Checking patterns:', rules.patterns);
            for (const pattern of rules.patterns) {
                try {
                    // Remove extra escaping before creating the RegExp
                    const cleanedPattern = pattern.replace(/\\\\/g, '\\');
                    console.log(`Testing pattern (cleaned): ${cleanedPattern} against content`);
                    const regex = new RegExp(cleanedPattern);
                    if (regex.test(emailData.email_content)) {
                        console.log('MATCH FOUND for pattern:', pattern);
                        return {
                            type: 'content_pattern_match',
                            pattern,
                            severity: 'high'
                        };
                    } else {
                        console.log('No match for pattern:', pattern);
                    }
                } catch (error) {
                    console.error('Invalid regex pattern:', pattern, error);
                }
            }
        }
        
        // Check attachment types
        if (rules.attachment_types && Array.isArray(rules.attachment_types) && 
            emailData.has_attachments && emailData.attachment_names) {
            for (const attachment of emailData.attachment_names) {
                const fileExt = attachment.split('.').pop().toLowerCase();
                if (rules.attachment_types.includes(fileExt)) {
                    return {
                        type: 'attachment_type_match',
                        fileExt,
                        severity: 'medium'
                    };
                }
            }
        }
        
        return null;
    } catch (error) {
        console.error('Email policy violation check failed:', error);
        throw error;
    }
};

module.exports = {
    processFileAccessLog,
    checkPolicyViolation,
    processEmailLog,
    checkEmailPolicyViolation
};