const Patrol = require('../models/patrolSchema');
const User = require('../models/Users/user');
const Urgence = require('../models/urgence/urgenceSchema'); // Correct import path

// Create a new patrol and possibly a new supervisor
exports.createPatrol = async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log the request body

        // Check if the supervisor already exists
        let supervisor = await User.findOne({ email: req.body.supervisor.email });
        if (!supervisor) {
            // Create the supervisor user
            supervisor = new User({
                fullname: req.body.supervisor.name,
                email: req.body.supervisor.email,
                password: req.body.supervisor.password,
                role: 'patrol_supervisor'
            });
            await supervisor.save();
            console.log('Supervisor created:', supervisor);
        } else {
            console.log('Supervisor already exists:', supervisor);
        }

        // Create the patrol
        const patrol = new Patrol(req.body);
        await patrol.save();
        res.status(201).send(patrol);
    } catch (error) {
        console.error('Error creating patrol:', error.message); // Log the detailed error
        res.status(400).send({ message: error.message });
    }
};

// Calculate patrol performance based on assigned missions
// Calculate patrol performance based on assigned missions
// In controllers/patrolController.js
exports.getPatrolPerformance = async (req, res) => {
    console.log('Request URL:', req.originalUrl);
    console.log('Request Params:', req.params);
    try {
        const patrols = await Patrol.find().populate('assignedMissions');

        const performanceData = patrols.map(patrol => {
            const totalMissions = patrol.assignedMissions.length;
            const completedMissions = patrol.assignedMissions.filter(m => m.cloture === 'true').length;

            const weightedSuccessRate = totalMissions === 0 ? 0 : (completedMissions / totalMissions) * 100;

            let totalWeight = 0;
            let weightedCompletionTime = 0;

            patrol.assignedMissions.forEach(mission => {
                const weight = 6 - mission.niveau;
                totalWeight += weight;
                const completionTime = (new Date(mission.updatedAt) - new Date(mission.createdAt)) / (1000 * 60 * 60);
                weightedCompletionTime += weight * completionTime;

                console.log('Mission Weight:', weight);
                console.log('Completion Time:', completionTime);
            });

            const averageCompletionTime = totalWeight === 0 ? 0 : weightedCompletionTime / totalWeight;

            // New logic to avoid negative performance scores
            const maxPossibleTime = 24;
            const normalizedCompletionTime = (averageCompletionTime / maxPossibleTime) * 100;
            const performanceScore = weightedSuccessRate - normalizedCompletionTime;

            // Ensure performance score is non-negative
            const adjustedPerformanceScore = Math.max(0, performanceScore);

            console.log('Total Missions:', totalMissions);
            console.log('Completed Missions:', completedMissions);
            console.log('Weighted Success Rate:', weightedSuccessRate);
            console.log('Total Weight:', totalWeight);
            console.log('Weighted Completion Time:', weightedCompletionTime);
            console.log('Average Completion Time:', averageCompletionTime);
            console.log('Performance Score:', performanceScore);
            console.log('Adjusted Performance Score:', adjustedPerformanceScore);

            return {
                _id: patrol._id,
                supervisor: patrol.supervisor,
                weightedSuccessRate,
                averageCompletionTime,
                performanceScore: adjustedPerformanceScore
            };
        });

        res.status(200).json(performanceData);
    } catch (error) {
        console.error('Error calculating patrol performance:', error.message);
        res.status(500).json({ message: error.message });
    }
};



// Get all patrols with populated missions
exports.getAllPatrols = async (req, res) => {
    try {
        console.log('Received request to get all patrols'); // Log request reception
        const patrols = await Patrol.find().populate('assignedMissions');
        console.log('Patrols retrieved:', patrols); // Log retrieved patrols
        res.status(200).send(patrols);
    } catch (error) {
        console.error('Error getting patrols:', error.message); // Log the detailed error
        res.status(400).send({ message: error.message });
    }
};

// Get patrol by ID with populated missions
exports.getPatrolById = async (req, res) => {
    try {
        const patrol = await Patrol.findById(req.params.id).populate('assignedMissions');
        if (!patrol) {
            return res.status(404).send({ message: 'Patrol not found' });
        }
        res.status(200).send(patrol);
    } catch (error) {
        console.error('Error getting patrol by ID:', error.message);
        res.status(400).send({ message: error.message });
    }
};

// Update patrol by ID
exports.updatePatrol = async (req, res) => {
    try {
        const patrol = await Patrol.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!patrol) {
            return res.status(404).send({ message: 'Patrol not found' });
        }
        res.status(200).send(patrol);
    } catch (error) {
        console.error('Error updating patrol:', error.message);
        res.status(400).send({ message: error.message });
    }
};

// Delete patrol by ID
exports.deletePatrol = async (req, res) => {
    try {
        console.log('Received request to delete patrol with ID:', req.params.id); // Log the request
        const patrol = await Patrol.findByIdAndDelete(req.params.id);
        if (!patrol) {
            return res.status(404).send({ message: 'Patrol not found' });
        }
        res.status(200).send({ message: 'Patrol deleted' });
    } catch (error) {
        console.error('Error deleting patrol:', error.message); // Log the detailed error
        res.status(500).send({ message: error.message });
    }
};

// Get patrols assigned to the current supervisor
exports.getPatrolsBySupervisor = async (req, res) => {
    try {
        const patrols = await Patrol.find({ 'supervisor.email': req.user.email }).populate('assignedMissions');
        res.status(200).send(patrols);
    } catch (error) {
        console.error('Error getting patrols by supervisor:', error.message);
        res.status(500).send({ message: error.message });
    }
};

// Assign urgency to a patrol
exports.assignUrgencyToPatrol = async (req, res) => {
    const { patrolId, urgencyId } = req.params;
    try {
        const patrol = await Patrol.findById(patrolId).populate('assignedMissions');
        const urgency = await Urgence.findById(urgencyId);

        if (!patrol || !urgency) {
            return res.status(404).send({ message: 'Patrol or Urgency not found' });
        }

        // Check if the urgency is already assigned to this patrol
        if (patrol.assignedMissions.some(mission => mission._id.toString() === urgencyId)) {
            return res.status(409).send({ message: 'This urgency has already been assigned to this patrol' });
        }

        // Add the urgency to the patrol's assignedMissions if not already assigned
        patrol.assignedMissions.push(urgencyId);
        await patrol.save();

        res.status(200).send({ message: 'Urgency assigned to patrol successfully', patrol });
    } catch (error) {
        console.error('Error assigning urgency to patrol:', error.message);
        res.status(500).send({ message: error.message });
    }
};
