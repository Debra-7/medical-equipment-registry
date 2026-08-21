# Meridian Pivot — Assignment 1

## HMAC Webhook Verification Mini-Prototype

This project is an individual mini-prototype developed as part of the **Meridian Pivot** simulation.

The prototype demonstrates how **HMAC-SHA256 webhook verification** can be used to authenticate incoming medical equipment maintenance updates and reject webhook requests with invalid signatures.

---

## 1. Objective

The objective of this prototype was to independently learn and implement webhook verification using HMAC.

The prototype demonstrates:

- Medical equipment data management
- Webhook communication
- HMAC-SHA256 signature generation
- Shared secret management
- Raw request body handling
- Webhook signature verification
- Rejection of invalid webhook requests
- Storage of successfully verified events
- Retrieval of verified events through an API
- Browser-based visualization of maintenance events

---

## 2. Prototype Architecture

The prototype consists of two Node.js/Express services:

1. **Equipment Registry** — maintains medical equipment data and acts as the webhook sender.
2. **Maintenance Dashboard** — receives webhook requests, verifies their HMAC signatures, stores valid events, and displays them in a browser dashboard.

### Data Flow

```text
Equipment Registry
        |
        | Maintenance update
        | + HMAC-SHA256 signature
        v
Maintenance Dashboard
        |
        | Verify signature
        v
   Valid signature?
      /       \
    No         Yes
    |           |
    v           v
 HTTP 401    Store event
                |
                v
       /api/maintenance-events
                |
                v
        Browser Dashboard

```
---

## 3. Project Structure

```text
Meridian-Pivot/
│
├── equipment-registry/
│   ├── .env.example
│   ├── dates.js
│   ├── equipment.json
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── test-webhook.js
│
├── maintenance-dashboard/
│   ├── .env.example
│   ├── index.html
│   ├── script.js
│   ├── styles.css
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── .gitignore
└── README.md

``` 
---
## 4. Technologies Used

The prototype was built using the following technologies:

- **Node.js** — JavaScript runtime used to run the backend services.
- **Express.js** — Web framework used to create the Equipment Registry and Maintenance Dashboard servers.
- **JavaScript** — Used for backend logic and browser-side dashboard functionality.
- **HMAC-SHA256** — Used to generate and verify webhook signatures.
- **Node.js `crypto` module** — Used to generate HMAC-SHA256 signatures.
- **dotenv** — Used to load the shared webhook secret from environment variables.
- **HTML** — Used to structure the Maintenance Dashboard interface.
- **CSS** — Used to style the browser dashboard.

---

## 5. Prerequisites

The following software is required to run the prototype:

- [Node.js](https://nodejs.org/)
- npm
- Git

The prototype was developed and tested locally using Node.js and npm.



## 6. Environment Configuration

The Equipment Registry and Maintenance Dashboard use a shared secret for HMAC signature generation and verification.

The actual `.env` files are excluded from version control using `.gitignore`.

A `.env.example` file is provided for each service to document the required environment variable without exposing the actual secret.

### Equipment Registry

Create a file named:

```text
equipment-registry/.env
```

Add:
```text
WEBHOOK_SECRET=your_test_secret
```
Maintenance Dashboard

Create a file named:
```text
maintenance-dashboard/.env
```
Add:
```text
WEBHOOK_SECRET=your_test_secret
```
The same secret must be used by both services.


## 7. Installation

Both services have their own Node.js dependencies, so each service must be installed separately.

### Equipment Registry

Open a terminal in the `equipment-registry` directory:

```bash
cd equipment-registry
npm install
```
### Maintenance Dashboard

Open another terminal in the maintenance-dashboard directory:
```bash
cd maintenance-dashboard
npm install
```
After installation, both services will have their required dependencies available in their respective node_modules directories.


## 8. Running the Prototype

The prototype uses two Node.js/Express servers that run simultaneously.

### Terminal 1 — Equipment Registry

Navigate to the Equipment Registry directory:

```bash
cd equipment-registry
```

Start the server:
```bash
npm start
```
Expected output:
```text
Server is listening on port 8080
```
### Terminal 2 — Maintenance Dashboard

Open a second terminal and navigate to the Maintenance Dashboard directory:
```Bash
cd maintenance-dashboard
```
Start the server:
```bash
npm start
```
Expected output:
```text
Server is listening on port 8081
```
### Open the Dashboard

Once both servers are running, open the following address in a browser:
```text
http://localhost:8081
```
The Maintenance Dashboard should load in the browser.

---

## 9. Webhook Verification

The Equipment Registry generates an HMAC-SHA256 signature for each webhook request using the shared `WEBHOOK_SECRET`.

The generated signature is sent in the following HTTP header:

x-webhook-signature

When the Maintenance Dashboard receives a webhook request, it performs the following verification process:

1. Receives the webhook request.
2. Preserves the original raw request body.
3. Reads the signature from the `x-webhook-signature` header.
4. Retrieves the shared secret from the environment variables.
5. Generates a new HMAC-SHA256 signature using the shared secret and the original raw request body.
6. Compares the received signature with the calculated signature.
7. Rejects the request if the signatures do not match.
8. Stores the maintenance event only after successful verification.

### Verification Outcomes

| Signature | Result |
|-----------|--------|
| Valid | Event is accepted and stored |
| Invalid | Event is rejected with HTTP 401 |

A valid webhook receives:
```text
HTTP 200
Maintenance data received
```
An invalid webhook receives:
```text
HTTP 401
Invalid signature
```
This ensures that only webhook requests containing a valid HMAC signature are accepted by the Maintenance Dashboard.

---

## 10. API Endpoints

The prototype exposes the following HTTP endpoints.

### 1. Dashboard

**Method:** `GET`

**Endpoint:**

`/`

Displays the Maintenance Dashboard in the browser.

Example:

`http://localhost:8081/`

### 2. Webhook Receiver

**Method:** `POST`

**Endpoint:**

`/webhook/equipment`

Receives equipment maintenance updates from the Equipment Registry and verifies the HMAC signature before accepting the event.

### 3. Maintenance Events API

**Method:** `GET`

**Endpoint:**

`/api/maintenance-events`

Returns maintenance events that have successfully passed HMAC verification.

Example:

`http://localhost:8081/api/maintenance-events`

Only successfully verified events are returned by this endpoint.

---

## 11. Testing

The prototype was tested using both valid and invalid webhook signatures to confirm that the HMAC verification mechanism behaved correctly.

### Test 1 — Valid Signature

The `test-webhook.js` script generates an HMAC-SHA256 signature using the configured `WEBHOOK_SECRET` and sends a maintenance event to the Maintenance Dashboard.

From the `equipment-registry` directory, run:

    node test-webhook.js

Expected response:

    Status: 200
    Response: Maintenance data received

The Maintenance Dashboard server should also log:

    Valid webhook received

The verified maintenance event should then appear on the browser dashboard.

The event can also be confirmed through:

    http://localhost:8081/api/maintenance-events

### Test 2 — Invalid Signature

For the invalid-signature test, the signature sent with the webhook request was deliberately changed to an incorrect value.

Expected response:

    Status: 401
    Response: Invalid signature

The Maintenance Dashboard server should log:

    Invalid webhook signature

The invalid event should not be stored or displayed on the dashboard.

### Test Result

Both valid and invalid webhook scenarios were successfully tested.

The valid test confirmed that correctly signed maintenance events are accepted, stored, and displayed.

The invalid test confirmed that incorrectly signed requests are rejected with HTTP 401 and are not stored.

---

## 12. Synchronization and Testing Log

Testing was performed across the Equipment Registry, Maintenance Dashboard, webhook endpoint, API endpoint, and browser interface.

### Valid Webhook Test

| Component | Expected Result | Result |
|-----------|-----------------|--------|
| Equipment Registry | Maintenance event generated | Passed |
| HMAC generation | Signature generated using shared secret | Passed |
| Webhook request | Request delivered to dashboard | Passed |
| HMAC verification | Signature accepted | Passed |
| Event storage | Verified event stored | Passed |
| API endpoint | Event returned as JSON | Passed |
| Browser dashboard | Event displayed | Passed |

### Invalid Webhook Test

| Component | Expected Result | Result |
|-----------|-----------------|--------|
| Webhook request | Request delivered to dashboard | Passed |
| HMAC verification | Invalid signature detected | Passed |
| HTTP response | HTTP 401 returned | Passed |
| Event storage | Invalid event rejected | Passed |
| Browser dashboard | Invalid event not displayed | Passed |

### Synchronization Result

The prototype demonstrated successful end-to-end communication between the Equipment Registry and Maintenance Dashboard.

The testing confirmed that:

- Validly signed maintenance events are accepted.
- Invalidly signed events are rejected.
- Only verified events are stored.
- Verified events can be retrieved through the API.
- Verified events are displayed on the browser dashboard.

---

## 13. Final Prototype

The final prototype provides a working webhook-based medical equipment maintenance update system.

The completed flow is:
```text
Equipment Registry
        |
        | Maintenance event
        |
        | Generate HMAC-SHA256 signature
        v
POST /webhook/equipment
        |
        v
Maintenance Dashboard
        |
        | Verify signature
        |
        +--------------------+
        |                    |
    Invalid                 Valid
        |                    |
        v                    v
    HTTP 401          Store maintenance
    Rejected               event
                             |
                             v
                  /api/maintenance-events
                             |
                             v
                    Browser Dashboard
                             |
                             v
                  Maintenance event shown
```
The final prototype successfully demonstrated:

- Creation of medical equipment maintenance data
- Generation of HMAC-SHA256 webhook signatures
- Transmission of signed webhook requests
- Preservation of the raw request body
- Signature verification
- Rejection of invalid signatures
- Storage of verified maintenance events
- API retrieval of verified events
- Browser-based visualization of maintenance events

The final system therefore demonstrates an end-to-end webhook workflow in which maintenance updates are authenticated before being accepted and displayed.
 
---

## 14. Learning Outcomes

This prototype provided practical experience with webhook verification and HMAC-SHA256.

The implementation demonstrated how a shared secret can be used to authenticate webhook requests and help protect the integrity of incoming data.

Through the development of the prototype, I gained practical experience with:

- Express.js server development
- HTTP endpoints
- Express middleware
- Raw request body handling
- HMAC signature generation
- HMAC signature verification
- Environment variable management
- Frontend-backend communication
- API-based data retrieval
- Error handling
- Testing valid and invalid webhook requests
- Separating HTML, CSS, and JavaScript
- Debugging browser and server-side errors
- Building and testing an end-to-end webhook workflow

The prototype also improved my ability to investigate an unfamiliar technical concept, troubleshoot errors independently, and document the development process.

---

## 15. Independent Learning Evidence

The implementation was developed as an individual learning exercise using webhook verification and HMAC-SHA256 as the unfamiliar technical concept.

The accompanying Learning & Blocker Journal documents the development process, including:

- Development tasks
- Tools and technologies used
- Resources consulted
- Concepts investigated
- Errors encountered
- Troubleshooting steps
- Dead ends and attempted solutions
- Solutions implemented
- Synchronization and testing
- Final prototype development

The journal provides evidence of the independent learning and troubleshooting process used to develop the working prototype.

The prototype and journal together demonstrate the ability to learn an unfamiliar technology, investigate problems independently, implement a working solution, and document the reasoning and troubleshooting process.

---

## 16. Security Considerations

The prototype includes several basic security measures related to webhook verification and secret management.

### Shared Secret Protection

The webhook secret is stored in environment variables rather than directly in the source code.

The actual `.env` files are excluded from Git using `.gitignore`.

The repository contains `.env.example` files only to document the required configuration without exposing the actual secret.

The shared secret should never be committed to the repository or exposed publicly.

### HMAC-SHA256 Verification

The Maintenance Dashboard uses HMAC-SHA256 to verify incoming webhook requests.

The verification process uses:

- A shared secret
- The original raw request body
- The signature provided by the webhook sender

The dashboard calculates its own HMAC-SHA256 signature and compares it with the received signature.

If the signatures do not match, the webhook is rejected with HTTP 401.

This helps ensure that the request was generated by a party that possesses the shared secret and that the signed request body has not been modified.

### Prototype Security Scope

The security implementation is intended for demonstration and learning purposes.

A production implementation would require additional security measures such as secure secret storage, HTTPS, stronger request validation, replay-attack protection, access control, logging, monitoring, and appropriate key rotation procedures.

---

## 17. Limitations

The prototype is intended for demonstration and learning purposes rather than production deployment.

### In-Memory Storage

Verified maintenance events are stored in memory by the Maintenance Dashboard.

As a result:

- Events are lost when the dashboard server restarts.
- The prototype does not use a persistent database.
- The system cannot retain historical maintenance records between server sessions.

### Other Limitations

The prototype does not currently include:

- Persistent database storage
- Advanced authentication and authorization
- Automated webhook retry handling
- Persistent event processing
- Replay-attack protection
- Production-level monitoring and logging
- Production deployment infrastructure

A production implementation would require persistent storage, stronger security controls, reliability mechanisms, monitoring, and appropriate deployment infrastructure.

These limitations were considered acceptable because the objective of the prototype was to demonstrate the core concepts of webhook communication, HMAC-SHA256 verification, event validation, and browser-based visualization.

---

## Conclusion

This prototype demonstrates the successful implementation of HMAC-SHA256 webhook verification for medical equipment maintenance updates.

It provides a complete working flow from maintenance event generation and signed webhook transmission through signature verification, event storage, API retrieval, and browser-based visualization.

The project also documents the independent learning, troubleshooting, testing, and development process undertaken during Assignment 1 of the Meridian Pivot simulation.