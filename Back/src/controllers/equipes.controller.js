const db = require('../config/db_matchstart');

exports.listEquipesMe = async (req, res) => {
    try {

        const {user_id} = req.body;

        const result = await db.query(
            `SELECT e.*, es.nome as esporte_nome
            FROM equipe e 
            join esporte es on es.esporte_id = e.esporte_id
            where user_id = $1`, [user_id]
        );

        // Captura o registro do usuário inserido.
        const equipe = result.rows;

        res.status(200).send(equipe);

    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }

}

exports.validaInserirEquipe = async (req, res, next) => {
    const {user_id} = req.body;


    const equipes = await db.query(`SELECT * FROM equipe WHERE user_id = $1`, [user_id]);
        if (equipes.rowCount >= 3) {
            return res.status(406).send({
                message: 'Usuário já possui 3 equipes cadastradas.',
            });
        } else {return next();}
}

exports.insereEquipes = async (req, res) => {
    try {

        const {user_id, esporte_id, nome} = req.body;

        const result = await db.query(
            `INSERT INTO equipe (esporte_id, user_id, nome) VALUES ($1, $2, $3) RETURNING equipe_id, esporte_id, user_id, nome`,[esporte_id, user_id, nome]
        );

        // Captura o registro do usuário inserido.
        const equipe = result.rows;

        res.status(200).send(equipe);
        
    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }

}

exports.deleteEquipes = async (req, res) => {
    const {equipe_id} = req.params;

    try {
        const resultLocal = await db.query(
           `DELETE FROM equipe WHERE equipe_id = $1`, [equipe_id]
        );
        
        res.status(200).send(resultLocal);
        
    } catch(error){
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
}

exports.alteraEquipes = async (req, res) => {
    const {equipe_id} = req.params;

    const {nome, esporte_id} = req.body; 

    try {
        const resultLocal = await db.query(
           `UPDATE equipe SET nome = $2, esporte_id = $3 WHERE equipe_id = $1`, [equipe_id, nome, esporte_id]
        );
        
        res.status(200).send(resultLocal);
        
    } catch(error){
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
}

exports.listEsporte = async (req, res) => {
    const {equipe_id} = req.params;
 

    try {
        const resultLocal = await db.query(
           `SELECT esporte_id FROM equipe WHERE equipe_id = $1`, [equipe_id]
        );
        
        const esporte = resultLocal.rows

        res.status(200).send(esporte);
        
    } catch(error){
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
}