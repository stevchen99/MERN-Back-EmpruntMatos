const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    libelle: { type: String, required: true },
    kaution: { type: Number, required: true },
    disponible: { type: Boolean, default: true } // Pour savoir s'il est prêté
});

module.exports = mongoose.model('Material', materialSchema);