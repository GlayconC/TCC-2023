import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Snackbar } from '@material-ui/core';
import api from '../../api'; 
import moment from 'moment';

const MinhasPartidas = () => {
    const [partidas, setPartidas] = useState([]);
    const [atualizaEquipes, setAtualizaEquipe] = useState();
    const [open, setOpen] = useState(false);


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
      };

    // Busca os convites pendentes
    useEffect(() => {
        const data = {
            equipe_id: localStorage.getItem("equipe_id")
        };

        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'access-control-allow-origin': '*'
            }
        };

        api.post('partida/pendentes', data, headers)
            .then(response => {
                const partidasFormatadas = response.data.map(partida => ({
                    ...partida,
                    data_hora_inicio: moment(partida.data_hora_inicio).format('YYYY-MM-DD HH:mm:ss'),
                    data_hora_fim: moment(partida.data_hora_fim).format('YYYY-MM-DD HH:mm:ss'),
                }));

                setPartidas(partidasFormatadas);
            })
            .catch(error => {
                console.error('Erro: ', error);
            });
    },[atualizaEquipes]);

    const handleCancelar = (id) => {
        api.delete(`partida/delete/${id}`)
        .then(response => {
            console.log('Equipe removida com sucesso!');
            setAtualizaEquipe(id)
            setOpen(true)
        })
        .catch(error => {
            console.error('Erro ao remover equipe:', error);
        });
    };

    return (
        <Grid container justify="center" alignItems="center" style={{ minHeight: '10vh', overflowY: 'auto', overflowX: 'auto' }}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="p" align="center" style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold' }}>
                            CONVITES PENDENTES
                        </Typography>
                        <Snackbar
                            open={open}
                            autoHideDuration={6000} 
                            onClose={handleClose}
                            message="Convite de partida cancelado com sucesso!"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center'
                            }}
                        />
                        <div style={{ marginTop: '20px', maxHeight: '400px', overflowY: 'auto', overflowX: 'auto' }}>
                            <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold', width: '150px' }}>Adversário</TableCell>
                                            <TableCell style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold', width: '100px' }}>Cidade</TableCell>
                                            <TableCell style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold', width: '100px' }}>Local</TableCell>
                                            <TableCell style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold', width: '100px' }}>Rua</TableCell>
                                            <TableCell style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold', width: '200px' }}>Observação</TableCell>
                                            <TableCell style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold', width: '200px' }}>Início</TableCell>
                                            <TableCell style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold', width: '200px' }}>Fim</TableCell>
                                            <TableCell style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold' }}>Ações</TableCell> 
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {partidas.map(partida => (
                                            <TableRow key={partida.id}>
                                                <TableCell>{partida.equipe_nome}</TableCell>
                                                <TableCell>{partida.cidade}</TableCell>
                                                <TableCell>{partida.nome_local}</TableCell>
                                                <TableCell>{partida.rua}</TableCell>
                                                <TableCell>{partida.observacao}</TableCell>
                                                <TableCell>{partida.data_hora_inicio}</TableCell>
                                                <TableCell>{partida.data_hora_fim}</TableCell>
                                                <TableCell>
                                                    <Button variant="contained" color="secondary" onClick={() => handleCancelar(partida.partida_id)}>
                                                        Cancelar
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default MinhasPartidas;