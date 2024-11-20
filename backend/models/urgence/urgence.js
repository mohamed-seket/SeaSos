const mongoose = require('mongoose');

// Define the schema
const urgenceSchema = new mongoose.Schema({
    longitude: Number,
    latitude: Number,
    type: String,
    taille: String,
    age: String,
    niveau: Number,
    nbrpersonne: String,
    depart: String,
    nomprenom: String,
    distance: Number,
    status: String,
    tel: Number,
    communication: String,
    police: String,
    cloture: String,
    other: String,
    image: String  // Add this line to store base64-encoded image strings
}, { timestamps: true });

// Register the model
const Urgence = mongoose.model('Urgence', urgenceSchema);

module.exports = Urgence;
