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

// Instance method to save the document
urgenceSchema.methods.saveUrgence = function (callback) {
    return this.save(callback);
};

// Static method to find by ID and update
urgenceSchema.statics.findByIdAndUpdateUrgence = function (id, updateData, callback) {
    return this.findByIdAndUpdate(id, updateData, { useFindAndModify: false }, callback);
};

// Static method to find by ID
urgenceSchema.statics.findByIdUrgence = function (id, callback) {
    return this.findById(id, callback);
};

// Static method to find one document by criteria
urgenceSchema.statics.findOneUrgence = function (criteria, callback) {
    return this.findOne(criteria, callback);
};

// Static method to find documents by criteria
urgenceSchema.statics.findUrgences = function (criteria, callback) {
    return this.find(criteria, callback);
};

// Static method to find by ID and remove
urgenceSchema.statics.findByIdAndRemoveUrgence = function (id, callback) {
    return this.findByIdAndRemove(id, callback);
};

// Static method to delete many documents by criteria
urgenceSchema.statics.deleteManyUrgences = function (criteria, callback) {
    return this.deleteMany(criteria, callback);
};

module.exports = mongoose.models.Urgence || mongoose.model('Urgence', urgenceSchema);
