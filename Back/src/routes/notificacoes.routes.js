const express = require('express');
const router = express.Router();
const notificacoesController = require('../controllers/notificacoes.controller');

router.post('/busca', notificacoesController.listNotificacoes);

router.delete('/:notificacao_id', notificacoesController.deleteNotificacao);

module.exports = router;