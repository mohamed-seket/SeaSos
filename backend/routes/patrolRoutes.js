const express = require('express');
const router = express.Router();
const patrolController = require('../controllers/patrolController');
const { verifySupervisor } = require('../middlewares/AuthMiddleware');

// Create a new patrol
router.post('/create', patrolController.createPatrol);

// Get all patrols
router.get('/', patrolController.getAllPatrols);

router.get('/performance', patrolController.getPatrolPerformance);


// Get a specific patrol by ID
router.get('/:id', patrolController.getPatrolById);

// Update patrol details
router.put('/update/:id', patrolController.updatePatrol);

// Delete a patrol
router.delete('/delete/:id', patrolController.deletePatrol);

// Get patrols by supervisor
router.get('/supervisor/patrols', verifySupervisor, patrolController.getPatrolsBySupervisor);

// Assign an urgency to a patrol
router.post('/assign/:patrolId/:urgencyId', patrolController.assignUrgencyToPatrol);

// Get patrol performance (no ID expected)

module.exports = router;
