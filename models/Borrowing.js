const mongoose = require('mongoose');

const borrowingSchema = new mongoose.Schema({
    personId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true },
    materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
    dateEmprunt: { type: Date, default: Date.now },
    dureeJours: { type: Number, required: true }, 
    dateRetourPrevue: { type: Date },
    estRendu: { type: Boolean, default: false }
});

module.exports = mongoose.model('Borrowing', borrowingSchema);