const express = require('express');
const router = express.Router();
const cadastroController = require('../controllers/cadastro.controller');

router.post('/usuario', cadastroController.validaEmailMiddleware, cadastroController.createUsuario);

router.get('/usuario',  cadastroController.listUsuario);

router.post('/equipe/contato',cadastroController.buscaContato);

router.post('/usuario/me', cadastroController.listUsuarioEu);

router.put('/contato/:user_id', cadastroController.alteraContato);

router.put('/senha/:user_id', cadastroController.alteraSenha);

router.delete('/delete/:user_id', cadastroController.deletaUsuario);

module.exports = router;