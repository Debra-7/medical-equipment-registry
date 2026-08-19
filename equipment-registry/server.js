require('dotenv').config();

const crypto = require('crypto');
const express = require('express');
const app = express();
const port = 8080;

//Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to get equipment data
const equipment = require('./equipment.json');


app.get('/equipment', (req, res) => {
    res.json(equipment);
});

app.post('/trigger-maintenance', async (req, res) => {

    // Select the first equipment record for this prototype.
    const equipmentItem = equipment[0];

    // Create the maintenance event that will be sent to the dashboard.
    const maintenanceEvent = {
        event: 'maintenance.updated',
        timestamp: new Date().toISOString(),
        equipment: equipmentItem
    };

    // Convert the event to the exact JSON string that will be signed.
    const payload = JSON.stringify(maintenanceEvent);

    // Generate an HMAC-SHA256 signature using the shared secret.
    const signature = crypto
        .createHmac('sha256', process.env.WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');

    try {
        // Send the signed webhook to the maintenance dashboard.
        const response = await fetch(
            'http://localhost:8081/webhook/equipment',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-webhook-signature': signature
                },
                body: payload
            }
        );

        // Get the response from the dashboard.
        const responseText = await response.text();

        console.log('Dashboard response:', responseText);

        // Return the dashboard's response to whoever triggered the event.
        res.status(response.status).send(responseText);

    } catch (error) {
        console.error('Error sending webhook:', error);

        res.status(500).send('Failed to send webhook');
    }
});

//Express to listen on port 8080
app.listen(port, function(err) {
    if (err) {
        console.error('Error starting server:', err);
    } else {
        console.log(`Server is listening on port ${port}`);
    }
});