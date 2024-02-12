const db = require('../config/db_matchstart');

exports.validaEmailMiddleware = async (req, res, next) => {

    const { email} = req.body;


    const tEmail = await db.query(`SELECT * FROM usuario WHERE email = $1`, [email]);
        if (tEmail.rowCount > 0) {
            return res.status(406).send({
                message: 'Endereço de Email já vinculado a outro Agente.',
            });
        } else {return next();}
}

exports.createUsuario = async (req, res) => {
    try {
        const { email, senha, contato, termos_de_uso, cidadeId, equipe, esporteId } = req.body;

        // Cadastro do usuário
        const result = await db.query(
            `INSERT INTO usuario (email, senha, contato, termos_de_uso) VALUES ($1, $2, $3, $4) RETURNING usuario_id, email, senha, contato, termos_de_uso`,
            [email, senha, contato, termos_de_uso]
        );

        // Captura o registro do usuário inserido.
        const usuarioInserido = result.rows[0];

        // Cadastro do local de atuação do usuário.
        const resultLocal = await db.query(
            `INSERT INTO local_atuacao (cidade_id, user_id) VALUES ($1, $2) RETURNING local_atuacao_id, cidade_id, user_id`,
            [cidadeId, usuarioInserido.usuario_id]
        );
        
        // Captura o registro do local de atuação inserido.
        const localAtuacao = resultLocal.rows[0];

        //Insere o primeiro time do usuário
        const resultEquipe = await db.query(
            `INSERT INTO equipe (nome, esporte_id, user_id) VALUES ($1, $2, $3) RETURNING equipe_id, esporte_id, user_id, nome`,
            [equipe, esporteId, usuarioInserido.usuario_id]
        );

        const equipe1 = resultEquipe.rows[0]

        // Envia dados inseridos como resposta.
        res.status(200).send({ id: usuarioInserido.usuario_id, resultLocal: localAtuacao, equipe: equipe1});


    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
};

exports.listUsuario = async (req, res) => {
    try {

        const result = await db.query(
            `SELECT * FROM usuario`,
        );

        // Captura o registro do usuário inserido.
        const usuarios = result.rows;

        res.status(200).send(usuarios);
    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
};

exports.buscaContato = async (req,res) => {
    try{

        const {equipe_id} = req.body

        const result = await db.query(
            `SELECT u.usuario_id, u.contato, u.termos_de_uso FROM usuario u 
            join equipe e
                on e.user_id = u.usuario_id
           WHERE e.equipe_id = $1`,[equipe_id]
        )

        const contato = result.rows

        res.status(200).send(contato)

    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }

}

exports.listUsuarioEu = async (req, res) => {
    try {

        const {user_id} = req.body;

        const result = await db.query(
            `SELECT * FROM usuario WHERE usuario_id = $1`,[user_id]
        );

        // Captura o registro do usuário inserido.
        const usuarios = result.rows;

        res.status(200).send(usuarios);
    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
};

exports.alteraContato = async (req, res) => {
    try {

        const {user_id,} = req.params;
        const {contato, termos_de_uso} = req.body;

        const result = await db.query(
            `UPDATE usuario SET contato = $2, termos_de_uso = $3 WHERE usuario_id = $1`, [user_id, contato, termos_de_uso]
         );

        // Captura o registro do usuário inserido.
        const usuarios = result.rows;

        res.status(200).send(usuarios);
    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
};

exports.alteraSenha = async(req, res) => {
    try {

        const {user_id,} = req.params;
        const {senha} = req.body;

        const result = await db.query(
            `UPDATE usuario SET senha = $2 WHERE usuario_id = $1`, [user_id, senha]
         );

        // Captura o registro do usuário inserido.
        const usuarios = result.rows;

        res.status(200).send(usuarios);
    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
}


exports.deletaUsuario = async (req, res) => {
    const {user_id} = req.params;

    try {
        const resultLocal = await db.query(
           `DELETE FROM usuario WHERE usuario_id = $1`, [user_id]
        );
        
        res.status(200).send(resultLocal);
        
    } catch(error){
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
}