const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const setupSwagger = require('./swagger'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connecté à MongoDB'))
    .catch(err => console.error('❌ Erreur MongoDB:', err));

// Initialisation Swagger
setupSwagger(app, PORT);

// Routes
app.use('/api/persons', require('./routes/personRoutes'));
app.use('/api/materials', require('./routes/materialRoutes'));
app.use('/api/borrowings', require('./routes/borrowingRoutes'));

app.listen(PORT, () => {
    console.log(`🚀 Serveur sur http://localhost:${PORT}`);
});