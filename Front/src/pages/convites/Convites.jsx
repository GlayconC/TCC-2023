import React, { useState, useEffect } from 'react';
import { Grid, Button, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Snackbar } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import api from '../../api'; 
import moment from 'moment';

const Convites = () => {

    const [convites, setConvites] = useState([]);
    const [atualizaConvites, setAtualizaConvites] = useState();
    const [celulaExpandida, setCelulaExpandida] = useState(null);
    const [openRecusado, setOpenRecusado] = useState(false);
    const [openAceito, setOpenAceito] = useState(false);
    const [open2, setOpen2] = useState(false);

    const handleExpansaoCelula = (index) => {
        if (celulaExpandida === index) {
            setCelulaExpandida(null);
        } else {
            setCelulaExpandida(index);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenRecusado(false);
        setOpenAceito(false);
        setOpen2(false);
      };

    // Busca os Convites de Partidas
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

        api.post('partida/convites', data, headers)
        .then(response => {
            console.log(response.data);
    
            const partidasFormatadas = response.data.conv.map(partida => ({
                ...partida,
                data_hora_inicio: moment(partida.data_hora_inicio).format('YYYY-MM-DD HH:mm:ss'),
                data_hora_fim: moment(partida.data_hora_fim).format('YYYY-MM-DD HH:mm:ss'),
            }));
    
            // Filtrar convites cuja data seja maior que a data atual
            const convitesFiltrados = partidasFormatadas.filter(partida => moment(partida.data_hora_inicio).isAfter(moment()));
    
            setConvites(convitesFiltrados);
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    },[atualizaConvites],[]);


    function verificaPartidas(equipe_mandante_id, equipe_nome, partida_id, data_hora_inicio, data_hora_fim) {
        const data = {
            equipe_id: localStorage.getItem('equipe_id')
        };
    
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'access-control-allow-origin': '*'
            }
        };
    
        // Criando objetos Moment.js para hora de início e fim da nova partida
        const novaHoraInicio = moment(data_hora_inicio);
        const novaHoraFim = moment(data_hora_fim);
    
        return api.post('partida/partidaAndamento', data, headers)
            .then(response => {
                const partidasExistentes = response.data;
    
                // Verificar se há sobreposição de horários com as partidas existentes
                const sobreposto = partidasExistentes.some(partidaExistente => {
                    const horaInicioExistente = moment(partidaExistente.data_hora_inicio);
                    const horaFimExistente = moment(partidaExistente.data_hora_fim);
    
                    return (
                        novaHoraInicio.isBetween(horaInicioExistente, horaFimExistente, null, '[]') ||
                        novaHoraFim.isBetween(horaInicioExistente, horaFimExistente, null, '[]') ||
                        horaInicioExistente.isBetween(novaHoraInicio, novaHoraFim, null, '[]') ||
                        horaFimExistente.isBetween(novaHoraInicio, novaHoraFim, null, '[]')
                    );
                });
    
                if (sobreposto) {
                    // Há sobreposição de horários
                    console.log('Sobreposição de horários com uma partida existente.');
                    setOpen2(true);
                    return true;
                } else {
                    // Não há sobreposição de horários com nenhuma partida existente
                    console.log('Não há sobreposição de horários com nenhuma partida existente.');
                    aceitaPartida(equipe_mandante_id, equipe_nome, partida_id)
                    return false;
                }
            })
            .catch(error => {
                console.error('Erro ao obter partidas:', error);
                return false; // Indica que houve um erro ao obter as partidas
            });
    }


    function aceitaPartida(equipe_mandante_id, equipe_nome, partida_id){

        const data = {
            equipe_mandante_id: equipe_mandante_id,
            partida_id: partida_id,
            descricao: `Equipe '${equipe_nome}' aceitou a partida!`
        };

        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'access-control-allow-origin': '*'
            }
        };

        api.post('partida/aceita', data, headers)
            .then(response => {
                console.log(response.data)
                setAtualizaConvites(partida_id)
                setOpenAceito(true)
            })
            .catch(error => {
                console.error('Erro ao aceitar partida:', error);
            });
    
    }

    function recusaPartida(equipe_mandante_id, equipe_nome, partida_id){
        const data = {
            equipe_mandante_id: equipe_mandante_id,
            partida_id: partida_id,
            descricao: `Equipe '${equipe_nome}' recusou a partida!`
        };

        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'access-control-allow-origin': '*'
            }
        };

        api.post('partida/recusa', data, headers)
            .then(response => {
                console.log(response.data)
                setAtualizaConvites(partida_id)
                setOpenRecusado(true)
            })
            .catch(error => {
                console.error('Erro ao recusar partida:', error);
            });

    }

    return (
        <Grid container justify="center" alignItems="center" style={{ minHeight: '100vh', overflowY: 'auto' }}>
            <Grid item xs={10} sm={8} md={8} lg={8} xl={7}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="p" align="center" style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'bold' }}>
                            CONVITES RECEBIDOS
                        </Typography>
                        <Snackbar
                            open={openRecusado}
                            autoHideDuration={6000} 
                            onClose={handleClose}
                            message="Convite de partida recusado com sucesso!"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center'
                              }}
                              />
                        <Snackbar
                            open={openAceito}
                            autoHideDuration={6000} 
                            onClose={handleClose}
                            message="Convite de partida aceito com sucesso!"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center'
                              }}
                              />
                        <Snackbar
                                open={open2}
                                autoHideDuration={6000} 
                                onClose={handleClose}
                                message="Você já tem uma partida em andamento neste horário!."
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center'
                                }}
                        />
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
                                        {convites.map((convite, index) => (
                                            <React.Fragment key={index}>
                                                <TableRow onClick={() => handleExpansaoCelula(index)}>
                                                    <TableCell>
                                                        <IconButton
                                                            aria-label="expandir"
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Impede a propagação do clique para a célula
                                                                handleExpansaoCelula(index); // Chama o evento para expandir a célula
                                                            }}
                                                        >
                                                            {celulaExpandida === index ? <ExpandMoreIcon /> : <KeyboardArrowRightIcon />}
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell>{convite.adversario}</TableCell>
                                                    <TableCell>{convite.cidade}</TableCell>
                                                    <TableCell>{convite.rua}</TableCell>
                                                    <TableCell>{convite.nome_local}</TableCell>
                                                    <TableCell>{convite.data_hora_inicio}</TableCell>
                                                    <TableCell>{convite.data_hora_fim}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={(e) => {
                                                                e.stopPropagation(); 
                                                                verificaPartidas(convite.equipe_mandante_id, convite.equipe_nome, convite.partida_id, convite.data_hora_inicio, convite.data_hora_fim);
                                                            }}
                                                            style={{marginBottom: '3px' }}
                                                        >
                                                            Aceitar
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                recusaPartida(convite.equipe_mandante_id, convite.equipe_nome, convite.partida_id);
                                                            }}
                                                            style={{ marginBottom: '3px' }}
                                                        >
                                                            Recusar
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                                {celulaExpandida === index && (
                                                    <TableRow>
                                                        <TableCell></TableCell>
                                                        <TableCell colSpan={6} style={{ wordWrap: 'break-word', maxWidth: 150 }}>Observação: {convite.observacao}</TableCell>
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

export default Convites;