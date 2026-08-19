const express = require('express');
const app = express();
const port = 8081;

//Middleware to parse JSON request bodies
app.use(express.json());


app.listen(port, function(err) {
    if (err) {
        console.error('Error starting server:', err);
    } else {
        console.log(`Server is listening on port ${port}`);
    } 
});

app.post('/webhook/equipment', (req, res) => {
    const maintenanceData = req.body;
    console.log('Received maintenance data:', maintenanceData);
    res.status(200).send('Maintenance data received');
});