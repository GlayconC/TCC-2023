import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const Settings = () => {
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [cidades, setCidades] = useState([]);
    const [pairs, setPairs] = useState([]);
    const [atualiza, setAtualiza] = useState('');

    const states = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
        'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    useEffect(() => {
        // Função assíncrona para fazer a requisição à API
        const fetchData = async () => {
            try {
                const response = await api.post('atuacao/listar', {
                    user_id: localStorage.getItem("user_id")
                });

                setPairs(response.data.map(item => ({
                    state: item.estado,
                    city: item.cidade,
                    local_atuacao_id: item.local_atuacao_id
                })));
            } catch (error) {
                console.error('Erro ao obter dados:', error);
            }
        };

        fetchData();
    }, [atualiza]);



    useEffect(() => {
        // Função assíncrona para fazer a requisição à API
        const data = {
          estado: selectedState
        }
        const headers = {
          headers: {
            'Content-Type': 'application/json',
            'access-control-allow-origin': '*'
          }
        };
        api.post('cidades', data, headers).then(response => {
          setCidades(response.data.id)
        })
      }, [selectedState]);

    const handleStateChange = (event) => {
        setSelectedState(event.target.value);
    };

    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
    };


    const handleAddCidade = () => {
        if (selectedState && selectedCity) {
            const data = {
                cidade_id: selectedCity,
                user_id: localStorage.getItem("user_id")
            }
            const headers = {
                headers: {
                    'Content-Type': 'application/json',
                    'access-control-allow-origin': '*'
                }
            };
            api.post('atuacao/inserir', data, headers).then(response => {
                console.log(response.data)                
                setPairs([]);
                setSelectedCity('');
                setAtualiza(selectedCity)
            })
        }
    };
    
    const handleRemovePair = (index) => {
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'access-control-allow-origin': '*'
            }
        };
        api.delete(`atuacao/${index}`, headers).then(response => {
            console.log(response.data)
            setPairs([]); // Remover isso, pois será populado novamente após a chamada de recarregaCidades()
            setAtualiza(response.data)
        })
    };
    

    return (
        <Grid container justify="center" alignItems="center" style={{ minHeight: '100vh' }}>
            <Grid item xs={10} sm={8} md={6} lg={4} xl={4}>
                <Card>
                    <CardContent>
                        <Typography variant="p" component="p" align="center" style={{ marginBottom: '20px', fontWeight: 'bold', textTransform: 'none' }}>
                            Adicione e remova as cidades que suas equipes disputam partidas.
                        </Typography>
                        <Grid container spacing={2} alignItems="center">                       
                            <Grid item xs={6}>
                                <TextField
                                    label="Estado"
                                    variant="outlined"
                                    fullWidth
                                    select
                                    value={selectedState}
                                    onChange={handleStateChange}
                                >
                                    <MenuItem value="">Selecione um Estado</MenuItem>
                                    {states.map((state) => (
                                        <MenuItem key={state} value={state}>{state}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Cidade"
                                    variant="outlined"
                                    fullWidth
                                    select
                                    disabled={cidades.length === 0}
                                    value={selectedCity}
                                    onChange={handleCityChange}
                                >
                                    {cidades.map((option) => (
                                        <MenuItem key={option.cidade_id} value={option.cidade_id}>
                                            {option.cidade}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>

                        <Button variant="contained" color="primary" onClick={handleAddCidade} style={{ marginTop: '15px', backgroundColor:'#282c34'}}>
                            Adicionar Cidade
                        </Button>

                        <div style={{ marginTop: '20px', maxHeight: '400px', overflowY: 'auto' }}>
    <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold' }}>Estado</TableCell>
                    <TableCell style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold' }}>Cidade</TableCell>
                    <TableCell style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold', textAlign: 'center' }}>Ações</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {pairs.map((pair, index) => (
                    <TableRow key={index}>
                        <TableCell>{pair.state}</TableCell>
                        <TableCell>{pair.city}</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                            <Button variant="contained" color="secondary" onClick={() => handleRemovePair(pair.local_atuacao_id)}>
                                Remover
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

export default Settings;