// Load environment variables from the .env file.
require('dotenv').config();

const crypto = require('crypto');
const express = require('express');

// Create the Express application.
const app = express();

// Port on which the webhook receiver will run.
const port = 8081;

/*
 * Middleware for parsing incoming JSON requests.
 *
 * The verify function runs while Express is reading the request body.
 * We save the original raw request body in req.rawBody because HMAC
 * verification must be performed against the exact data that was received.
 *
 * This is important because parsing and re-stringifying JSON can change
 * formatting, which could cause a valid signature to fail verification.
 */
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

/*
 * Webhook endpoint for receiving equipment maintenance data.
 *
 * POST /webhook/equipment
 *
 * At this stage of the prototype, the endpoint:
 * 1. Receives the webhook request.
 * 2. Extracts the JSON data from the request body.
 * 3. Logs the received maintenance data.
 * 4. Sends a successful HTTP 200 response.
 *
 * HMAC signature verification will be added to this endpoint next.
 */
app.post('/webhook/equipment', (req, res) => {

    // Get the HMAC signature sent by the webhook sender.
    const receivedSignature = req.headers['x-webhook-signature'];

    // Get the shared secret from the environment variables.
    const secret = process.env.WEBHOOK_SECRET;

    // Generate our own HMAC signature using the raw request body.
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(req.rawBody)
        .digest('hex');

    // Compare the sender's signature with our calculated signature.
    if (receivedSignature !== expectedSignature) {

        console.log('Invalid webhook signature');

        // Reject the webhook if the signatures do not match.
        return res.status(401).send('Invalid signature');
    }

    // The signature is valid, so the data can be trusted.
    const maintenanceData = req.body;

    console.log('Valid webhook received:', maintenanceData);

    // Tell the sender that the webhook was successfully processed.
    res.status(200).send('Maintenance data received');
});

/*
 * Root route used to confirm that the maintenance server is running.
 *
 * GET /
 *
 * Opening http://localhost:8081 in a browser should display
 * "Maintenance Dashboard is running".
 */
app.get('/', (req, res) => {
    res.send('Maintenance Dashboard is running');
});

/*
 * Start the Express server.
 *
 * The server listens for incoming HTTP requests on port 8081.
 */
app.listen(port, function(err) {

    // Handle an error if the server fails to start.
    if (err) {
        console.error('Error starting server:', err);
    } else {

        // Confirm that the server started successfully.
        console.log(`Server is listening on port ${port}`);
    }
});