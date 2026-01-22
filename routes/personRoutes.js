const express = require('express');
const router = express.Router();
const Person = require('../models/Person');
const Borrowing = require('../models/Borrowing'); 

/**
 * @swagger
 * tags:
 *   name: Persons
 *   description: Gestion des emprunteurs
 */

/**
 * @swagger
 * /api/persons:
 *   get:
 *     summary: Liste toutes les personnes
 *     tags: [Persons]
 *     responses:
 *       200:
 *         description: Liste récupérée
 */
router.get('/', async (req, res) => {
    try {
        const persons = await Person.find();
        res.json(persons);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

/**
 * @swagger
 * /api/persons/{id}:
 *   get:
 *     summary: Récupérer une personne par ID
 *     tags: [Persons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Personne trouvée
 */
router.get('/:id', async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);
        if (!person) return res.status(404).json({ message: "Non trouvé" });
        res.json(person);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

/**
 * @swagger
 * /api/persons:
 *   post:
 *     summary: Créer une nouvelle personne
 *     tags: [Persons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Person'
 *     responses:
 *       201:
 *         description: Créé
 */
router.post('/', async (req, res) => {
    try {
        const person = new Person(req.body);
        await person.save();
        res.status(201).json(person);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

/**
 * @swagger
 * /api/persons/{id}:
 *   put:
 *     summary: Modifier une personne
 *     tags: [Persons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Person'
 *     responses:
 *       200:
 *         description: Mis à jour
 */
router.put('/:id', async (req, res) => {
    try {
        const updated = await Person.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

/**
 * @swagger
 * /api/persons/{id}:
 *   delete:
 *     summary: Supprimer une personne
 *     tags: [Persons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Supprimé
 */
router.delete('/:id', async (req, res) => {
    try {
        // 1. Vérifier si la personne est liée à un emprunt (rendu ou non)
        const hasBorrowings = await Borrowing.findOne({ personId: req.params.id });
        
        if (hasBorrowings) {
            return res.status(400).json({ 
                message: "Suppression impossible : cette personne possède un historique d'emprunt." 
            });
        }

        const person = await Person.findByIdAndDelete(req.params.id);
        if (!person) return res.status(404).json({ message: "Personne non trouvée" });
        
        res.json({ message: "Supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;