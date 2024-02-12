const db = require('../config/db_matchstart');

exports.listNotificacoes = async (req,res) => {
    try{

        const {user_id} = req.body

        const result = await db.query(
            `SELECT * FROM notificacao
           WHERE user_id = $1`,[user_id]
        )

        const notificacao = result.rows

        res.status(200).send(notificacao)

    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }

}


exports.deleteNotificacao = async (req, res) => {
    const {notificacao_id} = req.params;

    try {
        const resultLocal = await db.query(
           `DELETE FROM notificacao WHERE notificacao_id = $1`, [notificacao_id]
        );
        
        res.status(200).send(resultLocal);
        
    } catch(error){
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
}