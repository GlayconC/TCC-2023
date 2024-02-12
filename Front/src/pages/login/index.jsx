import React, { useState } from 'react';
import { Grid, TextField, Button, Card, CardContent, Typography } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const history = useNavigate();

    function verificaCredenciais() {

        if (email.length > 0) {

            const data = {
                email: email,
                senha: senha
            }

            const headers = {
                headers: {
                    'Content-Type': 'application/json',
                    'access-control-allow-origin': '*'
                }
            };
            api.post('login/', data, headers).then(response => {
                console.log('a', response)
                if (response.status === 200) {
                    console.log(response.data.emailRetornado[0])
                    localStorage.setItem("user_id", response.data.emailRetornado[0].usuario_id);
                    localStorage.setItem("equipe", response.data.emailRetornado[0].nome);
                    localStorage.setItem("equipe_id", response.data.emailRetornado[0].equipe_id);
                    localStorage.setItem("email", email);
                    localStorage.setItem("esporte_id", response.data.emailRetornado[0].esporte_id)
                    history('/');
                } 
            }).catch(error => {
                console.error('Erro na requisição:', error);
                setError('E-mail ou senha incorretos.');
              });
        } else {
            setError('Informe suas credenciais.');
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica de validação do email e senha (por exemplo, enviar dados para a API)
        if (email === 'usuario@example.com' && senha === 'senha123') {
        }
    };

    return (
        <Grid container justify="center" alignItems="center" style={{ minHeight: '100vh' }}>
            <Grid item xs={10} sm={8} md={6} lg={4} xl={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h3" component="h2" align="center" style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                            MatchStart
                        </Typography>
                        <Typography variant="p" component="p" align="center" style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                            PROTÓTIPO DE SOFTWARE PARA AGENDAMENTO DE PARTIDA PARA EQUIPES CASUAIS
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <TextField
                                    label="Senha"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                />
                            </div>
                            {error && (
                                <div style={{ marginBottom: '20px', color: 'red' }}>
                                    {error}
                                </div>
                            )}
                            <div>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    style={{ backgroundColor: '#6abf59', color: 'white' }}
                                    onClick={verificaCredenciais}
                                >
                                    Entrar
                                </Button>
                                <Typography variant="body2" component="p" align="center" style={{ marginTop: '20px' }}>
                                    Não está cadastrado? <a href="/cadastro">Criar conta</a>
                                </Typography>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Login;