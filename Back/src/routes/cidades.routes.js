const express = require('express');
const router = express.Router();
const cidadesController = require('../controllers/cidades.controller');

router.post('/', cidadesController.listCidades);

module.exports = router;