import React, { useState, useEffect } from 'react';
import {
    Button,
    Grid,
    Card,
    CardContent,
    TextField,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    FormControlLabel,
    Typography,
    Snackbar
  } from '@material-ui/core';
import api from '../../api';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';


const Usuario = () => {

    const [senha, setSenha] = useState('');
    const [senhaAntiga, setSenhaAntiga] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senhaError, setSenhaError] = useState(false);
    const [novaSenhaError, setNovaSenhaError] = useState(false);
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [confirmarSenhaError, setConfirmarSenhaError] = useState(false);
    const [termosAceitos, setTermosAceitos] = useState(false);
    const [atualizaUsuario, setAtualizaUsuario] = useState('');
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const history = useNavigate();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
      };

    const formatarTelefone = (input) => {
        const onlyNumbers = input.replace(/[^\d]/g, '');
        return `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2, 7)}-${onlyNumbers.slice(7, 11)}`;
      };

      const alterarSenha = (e) => {
        e.preventDefault();

        // Verifica se a senha atual é válida (pode variar dependendo da lógica da sua API)
        if (!bcrypt.compareSync(senha, senhaAntiga)) {
            setSenhaError(true);
            return;
        }

        // Verifica se a nova senha tem pelo menos 8 caracteres
        if (novaSenha.length < 8) {
            setNovaSenhaError(true);
            return;
        }


        if (novaSenha !== confirmarSenha) {
            setConfirmarSenhaError(true);
            return;
        }


        const data = {
            user_id: localStorage.getItem("user_id"),
            senha: bcrypt.hashSync(novaSenha, 10) 
        };

        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'access-control-allow-origin': '*'
            }
        };



        api.put(`cadastro/senha/${localStorage.getItem("user_id")}`, data, headers)
            .then(response => {
                setOpen(true);
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    };

      const handleConfirmarSenhaChange = (e) => {
        const novaConfirmarSenha = e.target.value;
        setConfirmarSenha(novaConfirmarSenha);
    
        // Verifica se a senha de confirmação coincide com a senha
        if (novaConfirmarSenha === novaSenha) {
          setConfirmarSenhaError(false); 
        } else {
          setConfirmarSenhaError(true); 
        }
      };


    const alteraTelefone = () => {
        const data = {
            termos_de_uso: termosAceitos,
            contato: telefone
        };

        api.put(`cadastro/contato/${localStorage.getItem("user_id")}`, data)
            .then(response => {
                setOpen(true)
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }
    
    const handleModal = () => {
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
    }

    const handleDeletarConta = () => {
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'access-control-allow-origin': '*'
            }
        };

        api.delete(`cadastro/delete/${localStorage.getItem("user_id")}`, headers)
            .then(response => {
                console.log(response.data)
                history('/login');
                
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }

    useEffect(() => {
        const data = {
            user_id: localStorage.getItem("user_id"),
        };
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'access-control-allow-origin': '*'
            }
        };

        api.post('cadastro/usuario/me', data, headers)
            .then(response => {
                console.log(response.data);
                setTermosAceitos(response.data[0].termos_de_uso)
                setTelefone(response.data[0].contato)
                setSenhaAntiga(response.data[0].senha)
            })
            .catch(error => {
                console.error('Erro ao carregar equipes:', error);
            });
    },[atualizaUsuario],[]);


    return (
        <Grid container justify="center" alignItems="center" style={{ minHeight: '100vh', overflowY: 'auto'}}>
            <Grid item xs={10} sm={8} md={8} lg={8} xl={6}>
                <Card>
                    <CardContent>
                    <Dialog
                        PaperProps={{
                            style: {
                            backgroundColor: '#fafafa',
                            width: '600px'
                            },
                        }}
                        open={openModal}
                        >
                        <DialogTitle style={{
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            textTransform: 'none'
                        }}
                            variant="contained">
                            {"Você tem certeza que deseja excluir sua conta?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText variant="body1" align="justify" paragraph={true}>
                            <Button variant="contained" color="secondary" onClick={handleDeletarConta} >
                                SIM
                            </Button>
                            <Button variant="contained" color="primary" style={{marginLeft: '5px'}} onClick={handleCloseModal}>
                                NÃO
                            </Button>
                            </DialogContentText>
                        </DialogContent>
                        </Dialog>
                    <Typography variant="h4" component="h3" align="center" style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                        Alterar Usuário 
                    </Typography>
                    <Snackbar
                            open={open}
                            autoHideDuration={6000} 
                            onClose={handleClose}
                            message="Informações de usuário alteradas com sucesso!"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center'
                              }}
                        />
                    <form>
                        <TextField
                            label="Senha Atual"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            error={senhaError}
                            helperText={senhaError ? 'A senha deve ter pelo menos 8 caracteres' : ''}
                            required
                        />
                        <TextField
                            label="Nova Senha"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            error={novaSenhaError}
                            helperText={novaSenhaError ? 'A senha deve ter pelo menos 8 caracteres' : ''}
                            required
                        />
                        <TextField
                            label="Confirmar Nova Senha"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={confirmarSenha}
                            onChange={handleConfirmarSenhaChange}
                            error={confirmarSenhaError}
                            helperText={confirmarSenhaError ? 'As senhas não coincidem' : ''}
                            required
                        />
                        <Grid item xs={6} xl={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                style={{marginTop:'10px'}}
                                onClick={alterarSenha}
                            >
                                Alterar Senha
                            </Button>
                        </Grid>
                    </form>
                    <hr/>
                        <TextField
                            label="Telefone"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={telefone}
                            onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                            required
                        />
                        <div style={{ marginTop: '20px' }}>
                            <FormControlLabel
                            style={{ marginBottom: '10px', fontWeight: 'bold', textTransform: 'none' }}
                            control={
                                <Checkbox
                                checked={termosAceitos}
                                onChange={() => setTermosAceitos(!termosAceitos)}
                                color="primary"
                                
                                />
                            }
                            label="Termo de Uso: Ao marcar este checkbox o usuário aceita que seu número seja compartilhado com outras equipes para facilitar a comunicação."
                            />
                        </div>

                        <Grid item xs={6} xl={3}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                style={{marginTop:'10px'}}
                                onClick={alteraTelefone}
                            >
                                Alterar Telefone
                            </Button>
                        </Grid>
                        <hr/>
                        <Grid item xs={6} xl={3}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                fullWidth
                                style={{marginTop:'10px'}}
                                onClick={handleModal}     
                            >
                                Deletar Conta
                            </Button>
                        </Grid>
                    
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Usuario;