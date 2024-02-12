import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button,  } from '@material-ui/core';

import api from '../../api';

const Notificacao = () => {

    const [notificacao, setNotificacao] = useState([])
    const [atualiza, setAtualiza] = useState('')


    useEffect(() => {
                const data = {
                    user_id: localStorage.getItem('user_id')
                };

                const headers = {
                    headers: {
                        'Content-Type': 'application/json',
                        'access-control-allow-origin': '*'
                    }
                };

            api.post('notificacao/busca', data, headers)
            .then(response => {

                setNotificacao(response.data)
            })
            .catch(error => {
                console.error('Erro:', error);
            });

    }, [atualiza],[]);

    function excluir(id){
        console.log('a')
        api.delete(`notificacao/${id}`)
            .then(response => {
                setAtualiza(id)
            })
            .catch(error => {
                console.error('Erro :', error);
            });
    }


    return (
        <Grid container justify="center" alignItems="center" style={{ minHeight: '100vh' }}>
            <Grid item xs={10} sm={8} md={8} lg={8} xl={7}>
                <Card>
                <CardContent>
                    <Typography variant="h5" component="p" align="center" style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold' }}>
                        NOTIFICAÇÕES
                    </Typography>
                    <div style={{ marginTop: '20px', maxHeight: '400px', overflowY: 'auto', overflowX: 'auto' }}>
                        {notificacao.length > 0 ? (
                            <TableContainer style={{ minWidth: 600 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold', marginLeft: '200px' }}></TableCell>
                                                <TableCell style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold' }}></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {notificacao.map((notificacao, index) => (
                                                <TableRow key={index}>
                                                    <TableCell colSpan={12} style={{ position: 'relative', padding: '20px' }}>
                                                        {notificacao.descricao}
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            onClick={() => excluir(notificacao.notificacao_id)}
                                                            style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }}
                                                        >
                                                            Excluir
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography variant="body1" align="center">
                                    Nenhuma notificação
                                </Typography>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Notificacao;
