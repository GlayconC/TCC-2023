const express = require('express');
const router = express.Router();
const equipesController = require('../controllers/equipes.controller');

router.post('/me', equipesController.listEquipesMe);

router.post('/insere', equipesController.validaInserirEquipe, equipesController.insereEquipes);

router.delete('/:equipe_id', equipesController.deleteEquipes);

router.put('/:equipe_id', equipesController.alteraEquipes);

router.get('/esporte/:equipe_id', equipesController.listEsporte)

module.exports = router;