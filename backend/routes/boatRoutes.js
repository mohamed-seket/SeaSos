const express = require('express');
const router = express.Router();
const boatController = require('../controllers/boatController');

// Create a new boat
router.post("/create", boatController.createBoat);
// Retrieve all boats
router.get("/find-all", boatController.getAllBoats);
// Retrieve a single boat by ID
router.get("/find/:id", boatController.getBoatById);



module.exports = router;
