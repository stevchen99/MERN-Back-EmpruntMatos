const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
const Borrowing = require('../models/Borrowing');

/**
 * @swagger
 * tags:
 *   name: Materials
 *   description: Gestion du stock de matériel
 */

/**
 * @swagger
 * /api/materials:
 *   get:
 *     summary: Liste tout le matériel
 *     tags: [Materials]
 *     responses:
 *       200:
 *         description: Liste récupérée avec succès
 */
router.get('/', async (req, res) => {
    try {
        const materials = await Material.find();
        res.json(materials);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/materials/{id}:
 *   get:
 *     summary: Récupérer un matériel par ID
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matériel trouvé
 *       404:
 *         description: Matériel non trouvé
 */
router.get('/:id', async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        if (!material) return res.status(404).json({ message: "Matériel non trouvé" });
        res.json(material);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/materials:
 *   post:
 *     summary: Créer un nouveau matériel
 *     tags: [Materials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Material'
 *     responses:
 *       201:
 *         description: Matériel créé
 */
router.post('/', async (req, res) => {
    const material = new Material(req.body);
    try {
        const newMaterial = await material.save();
        res.status(201).json(newMaterial);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/materials/{id}:
 *   put:
 *     summary: Modifier un matériel existant
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Material'
 *     responses:
 *       200:
 *         description: Matériel mis à jour
 *       404:
 *         description: Matériel non trouvé
 */
router.put('/:id', async (req, res) => {
    try {
        const updatedMaterial = await Material.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!updatedMaterial) return res.status(404).json({ message: "Matériel non trouvé" });
        res.json(updatedMaterial);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/materials/{id}:
 *   delete:
 *     summary: Supprimer un matériel
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matériel supprimé avec succès
 *       404:
 *         description: Matériel non trouvé
 */
router.delete('/:id', async (req, res) => {
    try {
        // 1. Vérifier si le matériel est lié à un emprunt
        const hasBorrowings = await Borrowing.findOne({ materialId: req.params.id });
        
        if (hasBorrowings) {
            return res.status(400).json({ 
                message: "Suppression impossible : ce matériel est lié à des emprunts." 
            });
        }

        const material = await Material.findByIdAndDelete(req.params.id);
        if (!material) return res.status(404).json({ message: "Matériel non trouvé" });
        
        res.json({ message: "Matériel supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;