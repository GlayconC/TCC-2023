const db = require('../config/db_matchstart');

exports.listCidades = async (req, res) => {
    try {

        const {estado} = req.body;

        const result = await db.query(
            `SELECT * FROM cidade where estado = $1`, [estado]
        );

        // Captura o registro do usuário inserido.
        const cidade = result.rows;

        res.status(200).send({
            id: cidade
        });
    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
};