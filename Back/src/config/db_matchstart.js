const { Pool } = require('pg');

// ==> Conexão com a Base de Dados:
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'matchstart',
  password: 'Glaycon123',
  port: 5432,
});

pool.on('error', (err, client) => {
    console.error('Falha ao Conectar com o Banco de Dados', err)
    process.exit(-1);
});

module.exports = {
    query: (text, params) => {
        console.info(`${new Date} ${text.trim().replace(/[\r\n]/gm, '')}, ${JSON.stringify(params)}`);

        return pool.query(text, params)
    }
};