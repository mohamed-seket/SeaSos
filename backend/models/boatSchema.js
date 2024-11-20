const mongoose = require('mongoose');

const boatSchema = new mongoose.Schema({
    serialNumber: { type: String, required: true },
    name: { type: String, required: true },
    owner: {
        type: {
            name: { type: String, required: true },
            email: { type: String, unique: true }  // Ensure this is defined correctly
        },
        required: true
    },
    cinPassport: { type: String, required: true },
    cinNumber: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    passengerNumber: { type: Number, required: true },
    departurePort: { type: String, required: true },
    destination: { type: String, required: true },
    departureDay: { type: Date, required: true }
});


const Boat = mongoose.model('Boat', boatSchema);

module.exports = Boat;
