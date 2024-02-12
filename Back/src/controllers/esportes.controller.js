const db = require('../config/db_matchstart');

exports.listEsportes = async (req, res) => {
    try {

        const result = await db.query(
            `SELECT * FROM esporte`,
        );

        // Captura o registro do usuário inserido.
        const esportes = result.rows;

        res.status(200).send({
            id: esportes
        });
    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
};