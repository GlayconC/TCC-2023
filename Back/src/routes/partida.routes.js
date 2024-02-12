const express = require('express');
const router = express.Router();
const partidaController = require('../controllers/partida.controller');

router.post('/criar', partidaController.validaPartidaMiddleware, partidaController.createPartida);

router.post('/buscar', partidaController.listaPartida);

router.post('/pendentes', partidaController.listaPartidaPendente);

router.post('/convites', partidaController.listaPartidaConvites);

router.post('/recusa', partidaController.recusaPartida);

router.post('/aceita', partidaController.aceitaPartida);

router.post('/andamento', partidaController.listaPartidaAndamento);

router.post('/andamento/mandante', partidaController.listaPartidaAndamentoMandante);

router.delete('/delete/:partida_id', partidaController.deletePartida);

router.post('/todasPartidas', partidaController.listAllPartidas); // Lista as partidas em andamento e pendentes da equipe informada

router.post('/partidaAndamento', partidaController.listAllPartidasAndamento); // Lista as partidas em andamento da equipe informada


module.exports = router;