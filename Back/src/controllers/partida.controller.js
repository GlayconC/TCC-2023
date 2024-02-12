const db = require('../config/db_matchstart');

exports.validaPartidaMiddleware = async (req, res, next) => {

    const {equipe_mandante_id, equipe_convidada_id} = req.body;


    const result1 = await db.query(`SELECT * FROM equipe WHERE equipe_id = $1`, [equipe_mandante_id]);
    const result2 = await db.query(`SELECT * FROM equipe WHERE equipe_id = $1`, [equipe_convidada_id]);

    const equipe1 = result1.rows
    const equipe2 = result2.rows

    if(equipe1[0].esporte_id != equipe2[0].esporte_id){
        return res.status(406).send('As equipes não disputam o mesmo esporte.')
    } 
    else {return next();}
}

exports.createPartida = async (req, res) => {
    try {

        const {equipe_mandante_id, equipe_convidada_id, observacao, data_hora_inicio, data_hora_fim} = req.body;
        const {cidade_id, nome_local, rua} = req.body;

        const partidaResult = await db.query(
            `INSERT INTO local_partida (
                cidade_id,
                nome_local,
                rua
            )
            VALUES ($1, $2, $3)
            RETURNING
                local_partida_id,
                cidade_id,
                nome_local,
                rua`,[cidade_id, nome_local, rua]
        )

        const local_partida_id = partidaResult.rows;


        const result = await db.query(
            `Insert into partida
			(
				equipe_mandante_id, 
				local_partida_id, 
				equipe_convidada_id, 
			 	observacao, 
				data_hora_inicio, 
				data_hora_fim,
				status_convite
			) 
            values ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING 
                partida_id, 
                equipe_mandante_id, 
                local_partida_id, 
                equipe_convidada_id, 
                observacao, data_hora_inicio, 
                data_hora_fim, 
                status_convite`,
            [equipe_mandante_id, local_partida_id[0].local_partida_id, equipe_convidada_id, observacao, data_hora_inicio, data_hora_fim, 0]
        );

        // Captura o registro do usuário inserido.
        const partida = result.rows;

        res.status(200).send(partida);
        
    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
}

exports.listaPartida = async (req, res) => {
    try {

        const {equipe_id} = req.body;

        const result = await db.query(
            `select * from partida p
            join local_partida lp 
                on lp.local_partida_id = p.local_partida_id
            join cidade c
	            on c.cidade_id = lp.cidade_id
            where equipe_mandante_id = $1`, [equipe_id]
        );

        // Captura o registro do usuário inserido.
        const partida = result.rows;
        
        res.status(200).send(partida);

    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
}

exports.listaPartidaPendente = async (req, res) => {
    try {

        const {equipe_id} = req.body;

        const result = await db.query(
            `select p.*, lp.*, c.*, e.nome as equipe_nome from partida p
            join local_partida lp 
                on lp.local_partida_id = p.local_partida_id
            join cidade c
	            on c.cidade_id = lp.cidade_id
			join equipe e
				on e.equipe_id = p.equipe_convidada_id
            where equipe_mandante_id = $1 and status_convite = 0`, [equipe_id]
        );

        // Captura o registro do usuário inserido.
        const partida = result.rows;
        
        res.status(200).send(partida);

    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
}


exports.deletePartida = async (req, res) => {
    const {partida_id} = req.params;

    try {
        const resultLocal = await db.query(
           `DELETE FROM partida WHERE partida_id = $1`, [partida_id]
        );
        
        res.status(200).send(resultLocal);
        
    } catch(error){
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
}

exports.listaPartidaConvites = async (req, res) => {
    try {

        const {equipe_id} = req.body;

        const result = await db.query(
            `select p.*, lp.*, c.*, e.nome as equipe_nome, e2.nome as adversario from partida p
            join local_partida lp 
                on lp.local_partida_id = p.local_partida_id
            join cidade c
	            on c.cidade_id = lp.cidade_id
			join equipe e
				on e.equipe_id = p.equipe_convidada_id
			join equipe e2
				on e2.equipe_id = p.equipe_mandante_id
            where equipe_convidada_id = $1 and status_convite = 0`, [equipe_id]
        );

        const partida = result.rows;

        res.status(200).send({conv: partida});

    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
}


exports.aceitaPartida = async (req, res) => {
    try {

        const {partida_id, equipe_mandante_id, descricao} = req.body;

        const result = await db.query(
            `UPDATE partida
                set status_convite = 1
                where partida_id = $1`,[partida_id]
        );

        const partida = result.rows;

        const result1 = await db.query(
            `SELECT u.usuario_id from partida p
                    JOIN equipe e
                        on e.equipe_id = p.equipe_mandante_id
                    JOIN usuario u
                        on u.usuario_id = e.user_id	
                    where p.equipe_mandante_id = $1`,[equipe_mandante_id])

        const user_id = result1.rows[0]

        await db.query(
            `INSERT INTO notificacao (user_id, descricao) 
             VALUES ($1, $2) 
             RETURNING notificacao_id, user_id, descricao`,[user_id.usuario_id, descricao]
        )

        res.status(200).send({message: 'Partida aceita!'});

    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
}



exports.recusaPartida = async (req, res) => {
    try {

        const {partida_id, equipe_mandante_id, descricao} = req.body;

        await db.query(
            `UPDATE partida
                set status_convite = 2
                where partida_id = $1`,[partida_id]
        );

        const result1 = await db.query(
            `SELECT u.usuario_id from partida p
                    JOIN equipe e
                        on e.equipe_id = p.equipe_mandante_id
                    JOIN usuario u
                        on u.usuario_id = e.user_id	
                    where p.equipe_mandante_id = $1`,[equipe_mandante_id])

        const user_id = result1.rows[0]

        await db.query(
            `INSERT INTO notificacao (user_id, descricao) 
             VALUES ($1, $2) 
             RETURNING notificacao_id, user_id, descricao`,[user_id.usuario_id, descricao]
        )

        res.status(200).send({message: 'Partida recusada!'});

    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
}


exports.listaPartidaAndamento = async (req, res) => {
    try {

        const {equipe_id} = req.body;

        const result = await db.query(
            `select p.*, lp.*, c.*, e.nome as equipe_nome, e2.nome as adversario from partida p
            join local_partida lp 
                on lp.local_partida_id = p.local_partida_id
            join cidade c
	            on c.cidade_id = lp.cidade_id
			join equipe e
				on e.equipe_id = p.equipe_convidada_id
			join equipe e2
				on e2.equipe_id = p.equipe_mandante_id
            where equipe_convidada_id = $1 and status_convite = 1`, [equipe_id]
        );


        const partida = result.rows;

        res.status(200).send({conv: partida});

    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
}


exports.listaPartidaAndamentoMandante = async (req, res) => {
    try {

        const {equipe_id} = req.body;

        const result = await db.query(
            `select p.*, lp.*, c.*, e.nome as equipe_nome, e2.nome as adversario from partida p
            join local_partida lp 
                on lp.local_partida_id = p.local_partida_id
            join cidade c
	            on c.cidade_id = lp.cidade_id
			join equipe e
				on e.equipe_id = p.equipe_convidada_id
			join equipe e2
				on e2.equipe_id = p.equipe_mandante_id
            where equipe_mandante_id = $1 and status_convite = 1`, [equipe_id]
        );


        const partida = result.rows;

        res.status(200).send({conv: partida});

    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
}

exports.listAllPartidas = async (req, res) => {
    try {

        const {equipe_id} = req.body;

        const result = await db.query(
            `select * from partida 
            where (equipe_mandante_id = $1 or equipe_convidada_id = $1) 
            and (status_convite = 1 or status_convite = 0)`, [equipe_id]
        );


        const partida = result.rows;

        res.status(200).send(partida);

    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
}

exports.listAllPartidasAndamento = async (req, res) => {
    try {

        const {equipe_id} = req.body;

        const result = await db.query(
            `select * from partida 
            where (equipe_mandante_id = $1 or equipe_convidada_id = $2) 
            and status_convite = 1`, [equipe_id, equipe_id]
        );


        const partida = result.rows;

        res.status(200).send(partida);

    } catch (error) {
        console.error(error); // Registra o erro no console para depuração
        res.status(500).send({
            message: 'Ocorreu um erro! Tente novamente mais tarde.'
        });
    }
}