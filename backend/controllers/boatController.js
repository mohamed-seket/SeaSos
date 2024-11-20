const Boat = require('../models/boatSchema');  // Correct import path

// Create a new boat
exports.createBoat = async (req, res) => {
    try {
        console.log('Request Body:', req.body);  // Log the request body

        // Create the boat
        const boat = new Boat(req.body);
        await boat.save();
        res.status(201).send(boat);
    } catch (error) {
        console.error('Error creating boat:', error.message); // Log the detailed error
        res.status(400).send({ message: error.message });
    }
};

// Get all boats
exports.getAllBoats = async (req, res) => {
    try {
        console.log('Received request to get all boats');  // Log request reception
        const boats = await Boat.find().populate('name');
        console.log('Boats retrieved:', boats);  // Log retrieved boats
        res.status(200).send(boats);
    } catch (error) {
        console.error('Error getting boats:', error.message); // Log the detailed error
        res.status(400).send({ message: error.message });
    }
};

// Get a boat by ID
exports.getBoatById = async (req, res) => {
    try {
        const boat = await Boat.findById(req.params.id).populate('name');
        if (!boat) {
            return res.status(404).send({ message: 'Boat not found' });
        }
        res.status(200).send(boat);
    } catch (error) {
        res.status(400).send(error);
    }
};




