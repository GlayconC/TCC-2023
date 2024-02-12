const db = require('../config/db_matchstart');
const bcrypt = require('bcryptjs');

exports.verificaLogin = async (req, res, next) => {

    const { email, senha } = req.body;
    try {
        const usuario = await db.query('SELECT email, senha FROM  usuario WHERE email = $1', [email]);

            if (usuario.rowCount > 0) {

                const senhaCorrespondente = await bcrypt.compare(senha, usuario.rows[0].senha);

                if (senhaCorrespondente === true) {

                    const tEmail = await db.query(`select u.usuario_id, u.email, e.equipe_id, e.nome, e.esporte_id
                        from equipe e
                        join usuario u
                            on u.usuario_id = e.user_id
                        where u.email = $1`, [email]);

                    const emailRetornado = tEmail.rows

                    res.status(200).send({
                        emailRetornado
                    })

                } else {
                    res.status(500).send({message:"E-mail ou Senha incorretos."})
                }

            } else{
                res.status(500).send({message:"E-mail ou Senha incorretos."})
            }
        } 
        catch (error) {
            console.error(error); // Registra o erro no console para depuração
            res.status(500).send({
                message: 'Ocorreu um erro! Tente novamente mais tarde.'
            });
    }
}
