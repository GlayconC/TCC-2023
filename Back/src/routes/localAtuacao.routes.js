const express = require('express');
const router = express.Router();
const localAtuacaoController = require('../controllers/localAtuacao.controller');

router.post('/listar', localAtuacaoController.listLocalAtuacao); //Listar local de atuação do usuário.

router.post('/inserir', localAtuacaoController.insereLocalAtuacao); //Inserir local de atuação do usuário.

router.delete('/:local_atuacao_id', localAtuacaoController.deleteLocalAtuacao); //Deletar local de atuação do usuário.

router.post('/listar/equipes', localAtuacaoController.listLocalAtuacaoEquipes); //Listar as equipes com o local de atuação na cidade selecionada.

module.exports = router;