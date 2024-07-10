// Importing all the required modules
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const auth = require("./auth");

// Set the port number from the .env file or 5500
const PORT = process.env.PORT || 5500; 

// Create an instance of an express app
const app = express();

// Different middleware to handle requests and routes
app.use(cors());
app.use(express.json()); 
app.use("/", auth);

// Check to see what port the server is runnin on
app.listen(PORT, () => { 
    console.log(`Server running on PORT ${PORT}`);
});