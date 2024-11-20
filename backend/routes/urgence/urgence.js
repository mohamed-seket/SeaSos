var express = require('express');
var router = express.Router();
const controller = require('../../controllers/urgence/urgence');

// Create or update emergency
router.post("/create", controller.create);

// Retrieve emergency by coordinates
router.get("/find-urgence/:longitude/:latitude/", controller.findUrgence);

// Remove one emergency
router.delete("/delete/:id", controller.delete);

// Remove all emergencies
router.delete("/delete-all", controller.deleteAll);

// Retrieve all emergencies
router.get("/find-all", controller.findAll);

// Retrieve emergencies monthly
router.get('/find-by-month', controller.findNbrMonthly);

// Retrieve emergencies daily
router.get('/find-by-day', controller.findNbrDaily);

// Retrieve emergencies per area
router.get('/find-by-region', controller.findByRegion);

// Return if we found coordinates in maritime area
router.post('/is-in-area', controller.isInRegion);

// Add the route for updating an emergency
router.put("/update/:id", controller.update);

router.get('/incident-trends', controller.getIncidentTrends);

router.get('/response-times', controller.getResponseTimes);

router.get('/find-by-type', controller.findByType);




router.get('/heatmap-data', controller.getHeatmapData);


module.exports = router;
