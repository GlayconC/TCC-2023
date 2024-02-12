import React, { useState } from 'react';
import { Grid, Button, Card, CardContent, Typography } from '@material-ui/core';
import MinhasPartidas from './MinhasPartidas.jsx';
import CriarPartidas from './CriarPartidas.jsx';

const Partidas = () => {
    const [opcao, setOpcao] = useState('minhasPartidas');

    const alterarConteudo = () => {
        if (opcao === 'minhasPartidas') {
            setOpcao('criarPartida');
        } else {
            setOpcao('minhasPartidas');
        }
    };

    return (
        <Grid container justify="center" alignItems="center" style={{ minHeight: '100vh', overflowY: 'auto'}}>
            <Grid item xs={10} sm={8} md={8} lg={8} xl={6}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center">
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth  
                                style={{ marginTop: '10px', marginRight:'80px', marginLeft:'80px', marginBottom:'20px'}}
                                onClick={alterarConteudo}
                            >
                                {opcao === 'minhasPartidas' ? 'Convites Pendentes' : 'Criar convite de Partida'}
                            </Button>
                        </Grid>
                        <div id="conteudo">
                            {opcao === 'minhasPartidas' ? (
                                <div>
                                    {/* Conteúdo do arquivo MinhasPartidas */}
                                    <Typography variant="body1" component="p">
                                        <CriarPartidas/>
                                    </Typography>
                                </div>
                            ) : (
                                <div>
                                    {/* Conteúdo do arquivo CriarPartidas */}
                                    <Typography variant="body1" component="p">                                       
                                        <MinhasPartidas/>
                                    </Typography>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Partidas;