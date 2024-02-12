const db = require('../config/db_matchstart');

exports.listLocalAtuacao = async (req, res) => {

    const {user_id} = req.body;

    try {

        const result = await db.query(
            `SELECT la.local_atuacao_id, la.cidade_id, la.user_id, c.cidade, c.estado 
            FROM local_atuacao la 
            join cidade c on c.cidade_id = la.cidade_id
            WHERE user_id = $1`,[user_id]
        );

        // Captura o registro do usuário inserido.
        const localAtuacao = result.rows;

        res.status(200).send(localAtuacao);
    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
};

exports.insereLocalAtuacao = async (req, res) => {
    const {user_id, cidade_id} = req.body;

    try {
        const resultLocal = await db.query(
            `INSERT INTO local_atuacao (cidade_id, user_id) VALUES ($1, $2) RETURNING local_atuacao_id, cidade_id, user_id`,
            [cidade_id, user_id]
        );

        const localAtuacao = resultLocal.rows[0];
        
        res.status(200).send(localAtuacao);
        
    } catch(error){
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
}

exports.deleteLocalAtuacao = async (req, res) => {
    const { local_atuacao_id } = req.params;

    try {
        const resultLocal = await db.query(
           `DELETE FROM local_atuacao WHERE local_atuacao_id = $1`, [local_atuacao_id]
        );
        
        res.status(200).send(resultLocal);
        
    } catch(error){
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
}


exports.listLocalAtuacaoEquipes = async (req, res) => {

    const {cidade_id, user_id, esporte_id} = req.body;

    try {

        const result = await db.query(
            `select la.user_id, e.nome, e.equipe_id
                from local_atuacao la
                join equipe e on e.user_id = la.user_id
                join esporte es on es.esporte_id = e.esporte_id
                where cidade_id = $1 and e.user_id != $2 and e.esporte_id = $3`, [cidade_id, user_id, esporte_id]
        );

        // Captura o registro do usuário inserido.
        const localAtuacao = result.rows;

        res.status(200).send(localAtuacao);
    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
};