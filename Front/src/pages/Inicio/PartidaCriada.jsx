import React, { useState, useEffect } from 'react';
import { Grid,  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import moment from 'moment';
import api from '../../api';

const PartidaCriada = () => {

    const [partidas, setPartidas] = useState([]);
    const [celulaExpandida, setCelulaExpandida] = useState(null);
    const [contatos, setContatos] = useState([]);

    useEffect(() => {
        const fetchContatos = async () => {
            const novosContatos = await Promise.all(partidas.map(async (partida) => {
                const data = {
                    equipe_id: partida.equipe_convidada_id
                };
    
                const headers = {
                    headers: {
                        'Content-Type': 'application/json',
                        'access-control-allow-origin': '*'
                    }
                };
    
                try {
                    const response = await api.post('cadastro/equipe/contato', data, headers);
                    if (response.data[0].termos_de_uso === true) {
                        return response.data[0].contato;
                    } else {
                        return 'Contato não divulgado';
                    }
                } catch (error) {
                    console.error('Erro:', error);
                    return null;
                }
            }));
            setContatos(novosContatos);
        };
    
        fetchContatos();
    }, [partidas]);

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

        api.post('partida/andamento/mandante', data, headers)
            .then(response => {
                const partidasFormatadas = response.data.conv.map(partida => ({
                    ...partida,
                    data_hora_inicio: moment(partida.data_hora_inicio).format('YYYY-MM-DD HH:mm:ss'),
                    data_hora_fim: moment(partida.data_hora_fim).format('YYYY-MM-DD HH:mm:ss'),
                }));

                // Filtra as partidas em que a data_hora_fim seja maior que a hora atual
                const agora = moment(); // Obtém a hora atual usando moment.js
                const partidasFiltradas = partidasFormatadas.filter(partida => moment(partida.data_hora_fim) > agora);

                setPartidas(partidasFiltradas);
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }, []);

    const handleExpansaoCelula = (index) => {
        if (celulaExpandida === index) {
            setCelulaExpandida(null);
        } else {
            setCelulaExpandida(index);
        }
    };


    return (
        <Grid container justify="center" alignItems="center" style={{ minHeight: '1vh', overflowY: 'auto' }}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Card>
                    <CardContent>
                        <Typography variant="p" component="p" align="center" style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold' }}>
                            Partidas em casa
                        </Typography>
                        <div style={{ marginTop: '20px', maxHeight: '400px', overflowY: 'auto' }}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold' }}>Adversário</TableCell>
                                            <TableCell style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold' }}>Cidade</TableCell>
                                            <TableCell style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold' }}>Rua</TableCell>
                                            <TableCell style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold' }}>Local</TableCell>
                                            <TableCell style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold' }}>Hora Início</TableCell>
                                            <TableCell style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold' }}>Hora Fim</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {partidas.map((partida, index) => (
                                            <React.Fragment key={index}>
                                                <TableRow onClick={() => handleExpansaoCelula(index)}>
                                                    <TableCell>
                                                        <IconButton
                                                            aria-label="expandir"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleExpansaoCelula(index);
                                                            }}
                                                        >
                                                            {celulaExpandida === index ? <ExpandMoreIcon /> : <KeyboardArrowRightIcon />}
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell>{partida.equipe_nome}</TableCell>
                                                    <TableCell>{partida.cidade}</TableCell>
                                                    <TableCell>{partida.rua}</TableCell>
                                                    <TableCell>{partida.nome_local}</TableCell>
                                                    <TableCell>{partida.data_hora_inicio}</TableCell>
                                                    <TableCell>{partida.data_hora_fim}</TableCell>
                                                </TableRow>
                                                {celulaExpandida === index && (
                                                    <TableRow>
                                                        <TableCell></TableCell>
                                                        <TableCell colSpan={2}>
                                                            <Typography variant="body1" style={{ fontWeight: 'bold', textTransform: 'none' }}>
                                                                Contato:
                                                            </Typography>
                                                            {contatos[index]}
                                                        </TableCell>
                                                        <TableCell colSpan={4} style={{ wordWrap: 'break-word', maxWidth: 150, textTransform: 'none' }}>
                                                            <Typography variant="body1" style={{ fontWeight: 'bold', textTransform: 'none' }}>
                                                                Observação:
                                                            </Typography>
                                                            {partida.observacao}
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
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
export default PartidaCriada;
