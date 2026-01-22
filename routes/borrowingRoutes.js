const express = require('express');
const router = express.Router();
const Borrowing = require('../models/Borrowing');
const Material = require('../models/Material');

/**
 * @swagger
 * tags:
 *   name: Borrowings
 *   description: Gestion des liaisons (Qui a quoi)
 */

/**
 * @swagger
 * /api/borrowings:
 *   get:
 *     summary: Liste tous les emprunts en cours (avec détails joints)
 *     tags: [Borrowings]
 */
router.get('/', async (req, res) => {
    const list = await Borrowing.find().populate('personId').populate('materialId');
    res.json(list);
});

/**
 * @swagger
 * /api/borrowings/add:
 *   post:
 *     summary: Enregistrer un prêt
 *     tags: [Borrowings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Borrowing'
 */
router.post('/add', async (req, res) => {
    try {
        const { personId, materialId, dureeJours } = req.body;

        // Calcul de la date de retour : Date actuelle + X jours
        const dateRetour = new Date();
        dateRetour.setDate(dateRetour.getDate() + parseInt(dureeJours));

        const borrowing = new Borrowing({
            personId,
            materialId,
            dureeJours,
            dateRetourPrevue: dateRetour
        });

        await borrowing.save();
        await Material.findByIdAndUpdate(materialId, { disponible: false });

        res.status(201).json(borrowing);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/borrowings/return/{id}:
 *   put:
 *     summary: Marquer un matériel comme rendu
 *     tags: [Borrowings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'emprunt (Borrowing)
 */
router.put('/return/:id', async (req, res) => {
    try {
        const borrowing = await Borrowing.findById(req.params.id);
        if (!borrowing) return res.status(404).json("Emprunt non trouvé");

        // 1. Marquer l'emprunt comme terminé
        borrowing.estRendu = true;
        await borrowing.save();

        // 2. Remettre le matériel en "disponible"
        await Material.findByIdAndUpdate(borrowing.materialId, { disponible: true });

        res.json({ message: "Matériel rendu avec succès" });
    } catch (err) { res.status(400).json(err); }
});

module.exports = router;