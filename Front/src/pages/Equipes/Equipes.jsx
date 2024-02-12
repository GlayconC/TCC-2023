import React, { useState, useEffect } from 'react';
import { Grid, Button, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Snackbar } from '@material-ui/core';
import api from '../../api';
import EquipeFormulario from './EquipeFormularioEdicao';

const Equipes = () => {
    const [equipes, setEquipes] = useState([]);
    const [equipeEditando, setEquipeEditando] = useState(null);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [atualizaEquipe, setAtualizaEquipe] = useState();
    const [esporte, setEsporte] = useState();
    const [novaEquipe, setNovaEquipe] = useState();
    const [qntEquipes, setQntEquipes] = useState();
    const [open, setOpen] = useState(false);

    const esportes = [
        { value: 1, label: 'Futsal' },
        { value: 2, label: 'Futebol de Campo' },
        { value: 3, label: 'Futebol Suíço' },
        { value: 4, label: 'Vôlei' },
    ];

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
    };

    useEffect(() => {
        const data = {
            user_id: localStorage.getItem("user_id"),
            timestamp: new Date().toISOString()  // Adicione um parâmetro de data/hora
        };
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'access-control-allow-origin': '*'
            }
        };

        api.post('/equipes/me', data, headers)
            .then(response => {
                setEquipes(response.data);
            })
            .catch(error => {
                console.error('Erro ao carregar equipes:', error);
            });
    }, []);

    useEffect(() => {
        const data = {
            user_id: localStorage.getItem("user_id")
        }
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'access-control-allow-origin': '*'
            }
        };

        api.post('/equipes/me', data, headers)
            .then(response => {
                const quantidadeDeEquipes = response.data.length;
                setEquipes(response.data);
                setQntEquipes(quantidadeDeEquipes); // Atualiza o estado com a quantidade de equipes
            })
            .catch(error => {
                console.error('Erro ao carregar equipes:', error);
            });


    }, [atualizaEquipe]);


    const handleRemoverEquipe = (id) => {
        api.delete(`equipes/${id}`)
            .then(response => {
                setEquipes(equipes.filter(equipe => equipe.id !== id));
                console.log('Equipe removida com sucesso!');
                setAtualizaEquipe(id)
            })
            .catch(error => {
                console.error('Erro ao remover equipe:', error);
                setOpen(true);
            });
    };


    const handleEditarEquipe = (equipe) => {
        console.log('Equipe para editar:', equipe);
        setEquipeEditando(equipe);
    };


    const handleSalvarEdicao = (equipeAtualizada) => {
        console.log('a', equipeAtualizada)
        localStorage.setItem("esporte_id", equipeAtualizada.esporte)

        const data = {
            nome: equipeAtualizada.nome,
            esporte_id: equipeAtualizada.esporte
        }

        api.put(`equipes/${equipeAtualizada.equipeId}`, data)
            .then(response => {
                setEquipes(equipes.map(equipe => (equipe.id === equipeAtualizada.id ? equipeAtualizada : equipe)));
                setEquipeEditando(null);
                console.log('Equipe editada com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao editar equipe:', error);
            });

        setAtualizaEquipe(equipeAtualizada)
    };

    const handleCancelarEdicao = () => {
        setEquipeEditando(null);
    };

    const cadastraEquipe = () => {
        console.log(novaEquipe)
        console.log(esporte)

        const data = {
            user_id: localStorage.getItem("user_id"),
            esporte_id:esporte,
            nome:novaEquipe
        }
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'access-control-allow-origin': '*'
            }
        };

        api.post('/equipes/insere', data, headers)
            .then(response => {
                setAtualizaEquipe('Atualiza')
                setNovaEquipe(null)
                setEsporte(null)
                console.log(response.data)              
            })
            .catch(error => {
                console.error('Erro ao carregar equipes:', error);
            });


    }
    return (
        <Grid container justify="center" alignItems="center" style={{ minHeight: '100vh' }}>
            <Grid item xs={10} sm={8} md={8} lg={6} xl={4}>
                {equipeEditando ? (
                    <EquipeFormulario equipe={equipeEditando} onCancel={handleCancelarEdicao} onSave={handleSalvarEdicao} />
                ) : (
                    <Card>
                        <CardContent>
                            <Typography variant="p" component="p" align="center" style={{ marginBottom: '20px', fontWeight: 'bold', textTransform: 'none' }}>
                                Crie, altere e remova as suas equipes.
                            </Typography>
                            <Typography variant="p" component="p" align="center" style={{ marginBottom: '20px', fontWeight: 'bold', textTransform: 'none' }}>
                                Você pode ter até 3 equipes.
                            </Typography>
                            <Snackbar
                                open={open}
                                autoHideDuration={6000} 
                                onClose={handleClose}
                                style={{textTransform:"none"}}
                                message="Esta equipe está vinculada a uma partida ou convite pendente! Finalize a partida ou cancele os convites para remover esta equipe."
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center'
                                }}
                            />
                            {qntEquipes < 3 ? (
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Nome da Equipe"
                                            variant="outlined"
                                            fullWidth
                                            value={novaEquipe}
                                            onChange={(e) => setNovaEquipe(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Esporte"
                                            fullWidth
                                            variant='outlined'
                                            select
                                            value={esporte}
                                            onChange={(e) => setEsporte(e.target.value)}
                                        >
                                            {esportes.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                        <Button variant="contained" color="primary" onClick={cadastraEquipe} style={{ marginLeft:'7px', marginTop: '5px', marginBottom: '25px', backgroundColor: '#282c34' }}>
                                            Adicionar Equipe
                                        </Button>
                                </Grid>
                            ) : null}

                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ minWidth: '150px' }}>Nome da Equipe</TableCell>
                                            <TableCell style={{ minWidth: '100px' }}>Esporte</TableCell>
                                            <TableCell>Ações</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {equipes.map(equipe => (
                                            <TableRow key={equipe.id}>
                                                <TableCell>{equipe.nome}</TableCell>
                                                <TableCell>{equipe.esporte_nome}</TableCell>
                                                <TableCell>
                                                    <Button variant="contained" color="primary" style={{marginLeft: '3px', marginRight: '10px', marginBottom:'3px' }} onClick={() => handleEditarEquipe(equipe)}>
                                                        Alterar
                                                    </Button>
                                                    <Button variant="contained" color="secondary" style={{ marginBottom:'3px' }} onClick={() => handleRemoverEquipe(equipe.equipe_id)}>
                                                        Remover
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                )}
            </Grid>
        </Grid>
    );
};

export default Equipes;






