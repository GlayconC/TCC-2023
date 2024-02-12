const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller');

router.post('/', loginController.verificaLogin);

module.exports = router;