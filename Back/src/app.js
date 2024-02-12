const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

// Rotas
const index = require('./routes/index');
const cadastroRoute = require('./routes/cadastro.routes');
const esporteRoute = require('./routes/esportes.routes');
const cidadeRoute = require('./routes/cidades.routes');
const loginRoute = require('./routes/login.routes');
const localAtuacaoRoute = require('./routes/localAtuacao.routes');
const equipesRoute = require('./routes/equipes.routes');
const partidaRoute = require('./routes/partida.routes');
const notificacoesRoute = require('./routes/notificacoes.routes');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/json' }));

// Importações
app.use(cors());
app.use(index);
app.use('/cadastro', cadastroRoute);
app.use('/esportes', esporteRoute);
app.use('/cidades', cidadeRoute);
app.use('/login', loginRoute);
app.use('/atuacao', localAtuacaoRoute);
app.use('/equipes', equipesRoute);
app.use('/partida', partidaRoute);
app.use('/notificacao', notificacoesRoute);


app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});