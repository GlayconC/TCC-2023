const express = require('express');
const router = express.Router();
const esportesController = require('../controllers/esportes.controller');

router.get('/', esportesController.listEsportes);

module.exports = router;