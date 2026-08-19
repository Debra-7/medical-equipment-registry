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

//Express to listen on port 8080
app.listen(port, function(err) {
    if (err) {
        console.error('Error starting server:', err);
    } else {
        console.log(`Server is listening on port ${port}`);
    }
});