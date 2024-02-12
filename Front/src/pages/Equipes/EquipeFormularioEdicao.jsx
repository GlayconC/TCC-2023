import React, { useState, useEffect } from 'react';
import { Grid, Button, Card, CardContent, Typography, TextField, MenuItem } from '@material-ui/core';
import api from '../../api';

const EquipeFormulario = ({ equipe, onCancel, onSave }) => {
    console.log('aaaa', equipe)
    const [equipeId, setEquipeId] = useState(equipe.equipe_id)
    const [nome, setNome] = useState(equipe.nome);
    const [esporte, setEsporte] = useState(equipe.esporte_id);

    const esportes = [
        { value: 1, label: 'Futsal' },
        { value: 2, label: 'Futebol de Campo' },
        { value: 3, label: 'Futebol Suíço' },
        { value: 4, label: 'Vôlei' },
      ];

    useEffect(() => {
        setEquipeId(equipe.equipe_id);
        setNome(equipe.nome);
        setEsporte(equipe.esporte_id);
    }, [equipe]);

    const handleSalvar = () => {
        console.log('Dados a serem salvos:', { equipeId, nome, esporte });
        onSave({ equipeId, nome, esporte});
    };

    const handleNomeChange = (e) => {
        console.log('Novo valor do nome:', e.target.value);
        setNome(e.target.value);
    };
    
    const handleEsporteChange = (e) => {
        console.log('Novo valor do esporte:', e.target.value);
        setEsporte(e.target.value);
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="p" align="center">
                    Editar Equipe
                </Typography>
                <TextField
                    label="Nome da Equipe"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <TextField
                    label="Esporte"
                    fullWidth
                    variant="outlined"
                    margin="normal"
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
                <Grid container justify="center" style={{ marginTop: '20px' }}>
                    <Button variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={handleSalvar}>
                        Salvar
                    </Button>
                    <Button variant="contained" onClick={onCancel}>
                        Cancelar
                    </Button>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default EquipeFormulario;