import React, { useState } from 'react';
import { Grid, Button, Card, CardContent, Typography} from '@material-ui/core';
import PartidaConvidado from './PartidaConvidado';
import PartidaCriada from './PartidaCriada';

const Inicio = () => {
    const [exibirPartidaCriada, setExibirPartidaCriada] = useState(true);

    const alternarComponente = () => {
        setExibirPartidaCriada(!exibirPartidaCriada);
    };

    return (
        <Grid container justify="center" alignItems="center" style={{ minHeight: '100vh', overflowY: 'auto' }}>
            <Grid item xs={10} sm={8} md={8} lg={8} xl={7}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="p" align="center" style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold' }}>
                            PARTIDAS EM ANDAMENTO
                        </Typography>
                        {exibirPartidaCriada ? 
                            <Button variant="contained" color="primary" onClick={alternarComponente} style={{ marginBottom: '10px', marginLeft: 'auto'}}>
                                Partidas Fora 
                            </Button>: 
                            <Button variant="contained" color="primary" onClick={alternarComponente} style={{ marginBottom: '10px', marginLeft: 'auto'}}>
                                Partidas em Casa
                            </Button>
                        }
                        {exibirPartidaCriada ? <PartidaCriada /> : <PartidaConvidado />}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Inicio;
