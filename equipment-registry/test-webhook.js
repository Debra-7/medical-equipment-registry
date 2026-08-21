require('dotenv').config();

const crypto = require('crypto');

const http = require('http');

const secret = process.env.WEBHOOK_SECRET;

const maintenanceData = {
    equipment: {
        id: "EQ001",
        name: "X-ray Machine",
        department: "Radiology",
        location: "R001",
        status: "Maintenance Completed",
        lastMaintenanceDate: "2026-08-21",
        nextMaintenanceDate: "2027-08-21",
        technician: "John"
    }
};

// Convert the payload to the exact JSON string that will be sent.
const rawBody = JSON.stringify(maintenanceData);

// Generate the correct HMAC-SHA256 signature.
const validSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

const options = {
    hostname: 'localhost',
    port: 8081,
    path: '/webhook/equipment',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(rawBody),
        'x-webhook-signature': validSignature
    }
};

const request = http.request(options, response => {

    let data = '';

    response.on('data', chunk => {
        data += chunk;
    });

    response.on('end', () => {
        console.log('Status:', response.statusCode);
        console.log('Response:', data);
    });
});

request.on('error', error => {
    console.error('Request error:', error);
});

request.write(rawBody);
request.end();