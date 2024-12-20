# Security Solution Backend: DLP + EDR + UEBA + UBA

## **Overview**
This project is a comprehensive security solution backend that integrates the functionalities of **Data Loss Prevention (DLP)**, **Endpoint Detection and Response (EDR)**, **User and Entity Behavior Analytics (UEBA)**, and **User Behavior Analytics (UBA)**. It includes:
- Detection and prevention of sensitive data exfiltration (DLP).
- Monitoring and response to endpoint threats (EDR).
- Behavioral analytics to detect anomalies (UEBA).
- Detailed tracking of user activities (UBA).

The backend supports scalable APIs, a modular structure, and a centralized database for efficient data management.

---

## **Features**

### **Data Loss Prevention (DLP)**
- **Data Discovery**: Identify sensitive information (e.g., PII, PCI DSS, HIPAA data).
- **Data Classification**: Categorize data based on sensitivity or compliance requirements.
- **File Activity Monitoring**: Track file read/write/delete operations.
- **Policy Enforcement**: Enforce rules to restrict unauthorized data activities.
- **Removable Media Protection**: Control or restrict USB access and file transfers to external devices.
- **File & Document Tracking**: Monitor sensitive files throughout their lifecycle.
- **File Transfer Tracking**: Track file transfers across devices or to external systems.
- **Content Filtering**: Use regex or patterns to detect and restrict sensitive content.
- **Cloud Security**: Protect sensitive data in cloud services (e.g., Google Drive, OneDrive).
- **Email Security**: Scan email content and attachments for sensitive data.
- **Email Monitoring & Recording**: Monitor and log email activities for compliance.
- **Web Filtering**: Restrict websites based on content or activity (e.g., data upload sites).
- **Real-Time Alerts**: Notify admins of policy violations in real time.
- **Reporting and Analytics**: Generate compliance and violation reports.
- **File Parsing and Analysis**: Libraries like Apache Tika, Textract, or libmagic for content inspection.
- **File Integrity Monitoring**: Detect unauthorized changes to sensitive files.

### **Endpoint Detection and Response (EDR)**
- **Process Monitoring**: Detect unauthorized or suspicious processes (e.g., malware, ransomware).
- **Network Monitoring**: Track traffic for anomalies (e.g., malicious IPs).
  - **Libraries**: `pcap`, `libpcap`, Scapy.
- **Incident Response**: Enable actions like process termination, file quarantine, or endpoint isolation.
- **Behavioral Rules**: Flag repeated failed login attempts or usage of hacking tools.
- **Threat Anomaly Detection**: Monitor spikes in CPU or memory usage.
- **Device Control**: Restrict USB devices, external drives, or unauthorized peripherals.
- **File Integrity Monitoring**: Detect unauthorized changes to system files.
- **Quarantine Management**: Isolate suspicious files or processes.
- **Integration with Threat Feeds**: Use sources like VirusTotal, AbuseIPDB, and MITRE ATT&CK.
- **Real-Time Alerts**: Notify administrators immediately of detected threats.
- **Incident Logs**: Maintain logs of threats and remediation actions.

### **User and Entity Behavior Analytics (UEBA)**
- **Baseline Behavior Analytics**: Establish normal patterns for users and devices.
- **Anomaly Detection**: Identify deviations from baselines (e.g., unusual downloads).
  - **Techniques**: Use machine learning models for pattern recognition.
- **Insider Threat Detection**: Monitor privileged user activities for suspicious behavior.
- **User Tracking**: Log session activities like logins, file accesses, and command executions.
- **Entity Monitoring**: Track IoT devices and applications for unusual activity.
- **Behavior Correlation**: Correlate user behavior with endpoint and network activities.
- **Real-Time Alerts**: Notify admins when anomalies are detected.

### **User Behavior Analytics (UBA)**
- **Employee Monitoring**: Track login/logout times, system usage, and idle sessions.
- **File and Application Monitoring**: Monitor accessed files and executed applications.
- **Smart Rules & Automated Alerts**: Alert on specific conditions (e.g., copying sensitive files to USB drives).
- **Privilege Escalation Monitoring**: Alert on unauthorized admin access.
- **Suspicious Email Activity**: Detect unusual email attachments or recipients.
- **Access Control Violations**: Log unauthorized access attempts.

### **Additional Monitoring and Reporting Features**
- **Dashboard**: Provide real-time insights into system status (e.g., active agents, alerts).
  - Display logs, trends, and incident summaries.
- **Reports**: Generate compliance and activity reports.
  - Include visualizations like graphs and heatmaps.
- **Alert Word Notifications**: Trigger alerts for specific keywords (e.g., "Confidential", "Top Secret").
- **Activity Monitoring**: Record all endpoint and user activities.
- **Screen Capture**: Take snapshots of user activities for investigations.
- **Stealth Mode**: Ensure agents operate without user visibility.
- **Offline Functionality**: Allow agents to function even when disconnected from the backend.

---

## **Tech Stack**
- **Backend Framework**: Node.js (Express.js)
- **Database**: PostgreSQL for structured data (policies, alerts, actions) and MongoDB for semi-structured data (logs, reports).
- **Libraries**:
  - File Handling: Apache Tika (for DLP content extraction)
  - Regex Matching: `libmagic`, custom regex utilities
  - Network Monitoring: `pcap` (for packet sniffing)
- **Authentication**: JWT-based authentication for secure API access
- **Logging**: Winston for structured logging

---

## **Project Structure**
```plaintext
agent-backend/
├── src/
│   ├── config/                  
│   │   ├── db.js                 # PostgreSQL database connection
│   │   ├── env.js                # Environment variable configuration
│   │   ├── logger.js             # Logging setup
│   │   └── policyLoader.js       # Load default policies into the database
│   ├── controllers/             
│   │   ├── dlpController.js      # Handles DLP-specific API requests
│   │   ├── edrController.js      # Handles EDR-specific API requests
│   │   ├── uebaController.js     # Handles UEBA-specific API requests
│   │   ├── ubaController.js      # Handles UBA-specific API requests
│   │   ├── logController.js      # Handles log ingestion
│   │   ├── alertController.js    # Manages alert-related requests
│   │   ├── actionController.js   # Manages actions sent to agents
│   │   ├── policyController.js   # Manages policy creation and updates
│   │   └── reportController.js   # Generates and fetches reports
│   ├── middlewares/             
│   │   ├── errorHandler.js       # Global error handling middleware
│   │   ├── authenticate.js       # Authentication middleware
│   │   └── validateRequest.js    # Request validation middleware
│   ├── models/                  
│   │   ├── agentModel.js         # Schema for agents
│   │   ├── logModel.js           # Shared schema for logs
│   │   ├── policyModel.js        # Shared schema for policies
│   │   ├── alertModel.js         # Shared schema for alerts
│   │   ├── actionModel.js        # Shared schema for actions
│   │   ├── reportModel.js        # Schema for reports
│   │   ├── userModel.js          # Schema for users (e.g., admin accounts)
│   ├── routes/                 
│   │   ├── dlpRoutes.js          # DLP-specific API routes
│   │   ├── edrRoutes.js          # EDR-specific API routes
│   │   ├── uebaRoutes.js         # UEBA-specific API routes
│   │   ├── ubaRoutes.js          # UBA-specific API routes
│   │   ├── logRoutes.js          # Log ingestion API routes
│   │   ├── alertRoutes.js        # Alert API routes
│   │   ├── actionRoutes.js       # Action API routes
│   │   └── reportRoutes.js       # Report generation API routes
│   ├── services/                
│   │   ├── logService.js         # Handles log ingestion and analysis
│   │   ├── alertService.js       # Shared logic for generating alerts
│   │   ├── actionService.js      # Core logic for agent actions
│   │   ├── policyService.js      # Shared logic for managing policies
│   │   ├── reportService.js      # Core logic for generating reports
│   │   └── featureServices/      # Subdirectory for feature-specific logic
│   │       ├── dlpService.js     # DLP-specific logic
│   │       ├── edrService.js     # EDR-specific logic
│   │       ├── uebaService.js    # UEBA-specific logic
│   │       ├── ubaService.js     # UBA-specific logic
│   ├── utils/                   
│   │   ├── regexUtils.js         # Predefined regex patterns for sensitive data
│   │   ├── fileUtils.js          # File handling utilities (e.g., parsing)
│   │   └── notificationUtils.js  # Utilities for notifications
│   ├── app.js                    # Main Express application setup
│   └── server.js                 # Server entry point
├── test/                         
│   ├── controllers/              # Unit tests for controllers
│   ├── services/                 # Unit tests for services
│   ├── integration/              # Integration tests
│   ├── mocks/                    # Mock data for testing
│   └── utils/                    # Test utilities
├── .env                          # Environment variables
├── .gitignore                    # Git ignore file
├── package.json                  # Node.js project metadata
├── package-lock.json             # Lockfile for dependencies
└── README.md                     # Project documentation
```

---

## **Environment Variables**
Add the following to your `.env` file:
```plaintext
PG_DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=3000
```

---

## **Getting Started**

### **1. Clone the Repository**
```bash
git clone <repository_url>
cd agent-backend
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Set Up the Database**
1. Start your PostgreSQL server.
2. Create a database and configure the `.env` file with its details.
3. Run migrations (if applicable).

### **4. Start the Server**
```bash
npm start
```

### **5. Test the Application**
- Visit: `http://localhost:3000` to verify the API is running.
- Use `/health` endpoint for a health check.

---

## **Key Endpoints**
### **DLP**
- `POST /api/dlp/logs`: Ingest logs from agents.
- `GET /api/dlp/policies`: Retrieve DLP policies.

### **EDR**
- `POST /api/edr/logs`: Process endpoint activity logs.
- `POST /api/edr/actions`: Trigger endpoint remediation actions.

### **UEBA**
- `GET /api/ueba/anomalies`: Fetch detected anomalies.

### **UBA**
- `GET /api/uba/activities`: Retrieve user activity logs.

### **Reports**
- `GET /api/reports/:feature`: Generate reports for specific features.

---

## **Testing**
Run tests with:
```bash
npm test
```
- Unit tests for controllers and services.
- Integration tests for APIs.

---

## **Future Improvements**
- Add real-time WebSocket notifications for alerts.
- Introduce machine learning models for advanced anomaly detection.
- Support multi-tenant architecture.

---

For further questions, please contact the development team.

