import React, { useState, useEffect } from "react";
import {Grid, Button, Card, CardContent, Typography, TextField, MenuItem, Snackbar } from '@material-ui/core';
import api from '../../api'; 
import moment from 'moment';

const CriarPartidas = () => {

    const initialValues = {
        nomeLocal: '',
        rua: '',
        observacao: '',
        horaInicio: '',
        horaFim: '',
        equipeConvidada: ''
    };

    const [cidades, setCidades] = useState([]);
    const [cidadeSelecionada, setCidadeSelecionada] = useState('');
    const [equipes, setEquipes] = useState([]);
    const [formData, setFormData] = useState({ ...initialValues });
    const [erroDataInicio, setErroDataInicio] = useState(false);
    const [erroDataFim, setErroDataFim] = useState(false);
    const [horaInicioSelecionada, setHoraInicioSelecionada] = useState(false);
    const [teste,setTeste] = useState(false)
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [horarioIndisponivel, setHorarioIndisponivel] = useState(false);


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
        setOpen2(false);
      };

    const minDate = new Date(); 
    minDate.setHours(minDate.getHours() + 3); 

    useEffect(() => {
        const data = {
            user_id: localStorage.getItem("user_id")
        };

        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'access-control-allow-origin': '*'
            }
        };

        api.post('atuacao/listar', data, headers)
            .then(response => {
                console.log(response.data);
                setCidades(response.data);
            })
            .catch(error => {
                console.error('Erro :', error);
            });
    }, []);  

    useEffect(() => {
        const data = {
            user_id: localStorage.getItem('user_id'),
            cidade_id: cidadeSelecionada,
            esporte_id: localStorage.getItem('esporte_id')
        };

        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'access-control-allow-origin': '*'
            }
        };

        api.post('atuacao/listar/equipes', data, headers)
            .then(response => {
                setEquipes(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Erro ao obter equipes:', error);
            });
    }, [cidadeSelecionada]);

    const handleSetCidade = (e) => {
        setCidadeSelecionada(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'horaInicio') {
            const selectedDate = new Date(value);
            if (selectedDate < minDate) {
                setErroDataInicio(true); 
                setHoraInicioSelecionada(false); 
            } else {
                setErroDataInicio(false);
                setHoraInicioSelecionada(true); 
            }
        } else if (name === 'horaFim') {
            const horaInicio = new Date(formData.horaInicio);
            const horaFim = new Date(value);
            const diferencaHoras = Math.abs((horaFim - horaInicio) / 36e5); 

            if (diferencaHoras >= 1 && diferencaHoras <= 2) {
                setErroDataFim(false); 
            } else {
                setErroDataFim(true); 
            }
        }

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const verificaErros = () => {
        if (erroDataFim === false && erroDataInicio === false){
            setHorarioIndisponivel(false)
            verificaPartidas();
        }
    }

    function verificaPartidas() {
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
        const novaHoraInicio = moment(formData.horaInicio);
        const novaHoraFim = moment(formData.horaFim);
    
        return api.post('partida/todasPartidas', data, headers)
            .then(response => {
                const partidasExistentes = response.data;
                console.log(response.data)
    
                // Verificar se há sobreposição de horários com as partidas existentes
                for (let i = 0; i < partidasExistentes.length; i++) {
                    const partidaExistente = partidasExistentes[i];
                    console.log('aaa')
    
                    // Criando objetos Moment.js para hora de início e fim da partida existente
                    const horaInicioExistente = moment(partidaExistente.data_hora_inicio);
                    const horaFimExistente = moment(partidaExistente.data_hora_fim);
    
                    // Verificar se há sobreposição de horários
                    if (
                        (novaHoraInicio.isBetween(horaInicioExistente, horaFimExistente) ||
                        novaHoraFim.isBetween(horaInicioExistente, horaFimExistente)) ||
                        (horaInicioExistente.isBetween(novaHoraInicio, novaHoraFim) ||
                        horaFimExistente.isBetween(novaHoraInicio, novaHoraFim))
                    ) {
                        // Há sobreposição de horários
                        console.log('Sobreposição de horários com a partida existente:', partidaExistente);
                        setHorarioIndisponivel(true)
                        setOpen2(true)
                        return true;
                    }
                }
    
                // Não há sobreposição de horários com nenhuma partida existente
                console.log('Não há sobreposição de horários com nenhuma partida existente.');
                verificaCampos()
                return false;
            })
            .catch(error => {
                console.error('Erro ao obter partidas:', error);
                return false; // Indica que houve um erro ao obter as partidas
            });
    }


    function verificaCampos(){
        if(formData.equipeConvidada.length === 0){
            setTeste(true);
        } else if(formData.horaInicio.length === 0){
            setTeste(true);
        } else if(formData.horaFim.length === 0){
            setTeste(true);
        } else if(formData.nomeLocal.length === 0){
            setTeste(true);
        } else if(formData.rua.length === 0){
            setTeste(true);
        }  else {

            const data = {
                equipe_mandante_id: localStorage.getItem('equipe_id'),
                equipe_convidada_id: formData.equipeConvidada,
                cidade_id: cidadeSelecionada,
                nome_local: formData.nomeLocal,
                rua: formData.rua,
                observacao:formData.observacao, 
                data_hora_inicio:formData.horaInicio, 
                data_hora_fim: formData.horaFim
            }

            const headers = {
                headers: {
                  'Content-Type': 'application/json',
                  'access-control-allow-origin': '*'
                }
              };
              console.log(data)
              api.post('partida/criar', data, headers).then(response => {
                console.log(response.data)
                setOpen(true)
                setFormData({ ...initialValues });
                setErroDataFim(false)
                setCidadeSelecionada('')
              })
        }     
          
    }

    return (
        <Grid container justify="center" alignItems="center" style={{ minHeight: '50vh' }}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="p" align="center" style={{fontWeight: 'bold'}} >
                            CRIAR CONVITE DE PARTIDA
                        </Typography>
                            <Snackbar
                            open={open}
                            autoHideDuration={6000} 
                            onClose={handleClose}
                            message="Convite de Partida enviado! Acesse minhas partidas para visualizar."
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center'
                              }}
                              />
                              <Snackbar
                                open={open2}
                                autoHideDuration={6000} 
                                onClose={handleClose}
                                message="É necessário alterar o horário da partida!."
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center'
                                }}
                              />
                        {teste === true ? (
                            <Typography variant="h5" component="p" align="center" style={{ color:'red' }}>
                                É necessário preencher todos os campos.
                            </Typography>
                        ) :
                        ('')
                        }
                        {horarioIndisponivel === true ? (
                            <Typography variant="h5" component="p" align="center" style={{ color:'red', textTransform:'none' }}>
                                Você já tem uma partida neste horário!
                            </Typography>
                        ) :
                        ('')
                        }
                        <form>
                            <TextField
                                fullWidth
                                label="Nome do Local"
                                name="nomeLocal"
                                variant="outlined"
                                value={formData.nomeLocal}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Rua"
                                name="rua"
                                variant="outlined"
                                value={formData.rua}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Cidade da Partida"
                                name="cidade"
                                variant="outlined"
                                select
                                value={cidadeSelecionada}
                                onChange={handleSetCidade}
                                margin="normal"
                                required
                            >
                                {cidades.map(cidade => (
                                    <MenuItem key={cidade.cidade_id} value={cidade.cidade_id}>
                                        {cidade.cidade}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                fullWidth
                                label="Observação"
                                name="observacao"
                                variant="outlined"
                                value={formData.observacao}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Hora de Início da Partida"
                                type="datetime-local"
                                name="horaInicio"
                                variant="outlined"
                                value={formData.horaInicio}
                                onChange={handleInputChange}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                error={erroDataInicio} 
                                helperText={erroDataInicio ? "A hora de início deve ser maior que a data atual + 3 horas." : ""}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Hora do Fim da Partida"
                                type="datetime-local"
                                name="horaFim"
                                variant="outlined"
                                value={formData.horaFim}
                                onChange={handleInputChange}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                error={erroDataFim}
                                helperText={erroDataFim ? "A diferença de horas deve ser entre 1 e 2 horas." : ""}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Equipe Convidada"
                                name="equipeConvidada"
                                variant="outlined"
                                select
                                value={formData.equipeConvidada}
                                onChange={handleInputChange}
                                margin="normal"
                                disabled={!cidadeSelecionada} 
                                required
                            >
                                {equipes.map(equipe => (
                                    <MenuItem key={equipe.equipe_id} value={equipe.equipe_id}>
                                        {equipe.nome}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginTop: '20px' }}
                                onClick={verificaErros}
                            >
                                Enviar convite
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default CriarPartidas;
