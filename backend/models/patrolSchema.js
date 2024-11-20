const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Urgence = require('./urgence/urgenceSchema');  // Correct import path


const patrolSchema = new mongoose.Schema({
    supervisor: {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        rank: { type: String, required: true }
    },
    status: {
        type: String,
        enum: ['on_mission', 'standby', 'off_duty'],
        default: 'standby'
    },
    location: {
        type: String,
        required: true
    },
    teamMembers: [{
        type: String
    }],
    assignedMissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Urgence'
    }]
}, { timestamps: true });

patrolSchema.pre('save', function (next) {
    const patrol = this;
    if (patrol.isModified('supervisor.password')) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(patrol.supervisor.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                patrol.supervisor.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const Patrol = mongoose.model('Patrol', patrolSchema);

module.exports = Patrol;
