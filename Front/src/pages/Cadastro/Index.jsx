import React, { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText
} from '@material-ui/core';
import api from '../../api';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';

const estadosBrasil = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const esportes = [
  { value: 1, label: 'Futsal' },
  { value: 2, label: 'Futebol de Campo' },
  { value: 3, label: 'Futebol Suíço' },
  { value: 4, label: 'Vôlei' },
];

const Cadastro = () => {
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [cidades, setCidades] = useState([]);
  const [nomeEquipe, setNomeEquipe] = useState('');
  const [esporte, setEsporte] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [senhaError, setSenhaError] = useState(false);
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [erro, setErro] = useState(true);
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [confirmarSenhaError, setConfirmarSenhaError] = useState(false);
  const history = useNavigate();

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const formatarTelefone = (input) => {
    const onlyNumbers = input.replace(/[^\d]/g, '');
    return `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2, 7)}-${onlyNumbers.slice(7, 11)}`;
  };

  const handleSenhaChange = (e) => {
    const novaSenha = e.target.value;
    setSenha(novaSenha);

    if (novaSenha.length >= 8) {
      setSenhaError(false); 
    } else {
      setSenhaError(true); 
    }
  };

  const handleConfirmarSenhaChange = (e) => {
    const novaConfirmarSenha = e.target.value;
    setConfirmarSenha(novaConfirmarSenha);

    // Verifica se a senha de confirmação coincide com a senha
    if (novaConfirmarSenha === senha) {
      setConfirmarSenhaError(false); 
    } else {
      setConfirmarSenhaError(true); 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailValido = validarEmail(email);
    const senhaValida = senha.length >= 8;

    setEmailError(!emailValido);
    setSenhaError(!senhaValida);

    if (emailValido && senhaValida && estado && cidade && nomeEquipe && esporte && termosAceitos) {
      const telefoneFormatado = formatarTelefone(telefone);
      setOpenDialog(true);
    }
  };

  useEffect(() => {
    const data = {
      estado: estado
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
  }, [estado]);


  function verificaEmailCadastrado() {
    const headers = {
      headers: {
        'Content-Type': 'application/json',
        'access-control-allow-origin': '*'
      }
    };
    api.get('cadastro/usuario', headers).then(response => {
      for (let i = 0; i < response.data.length; i++) {
        if (email === response.data[i].email) {
          setEmailError(true);
        }
      }
      verificaErros();
    })
  }

  function verificaErros() {
    if (emailError === true) { setErro(true) }
    else if (senhaError === true) { setErro(true) }
    else if (email.length === 0) { setErro(true) }
    else if (senha.length === 0) { setErro(true) }
    else if (confirmarSenhaError === true) { setErro(true) }
    else { hashPassword() }

  }

  const hashPassword = async () => {
    try {
      const hashedPassword = await bcrypt.hash(senha, 10);
      cadastraUsuario(hashedPassword);
    } catch (error) {
      console.error('Erro ao criptografar senha:', error);
    }
  };

  function cadastraUsuario(senhaCrip) {
    const data = {
      email: email,
      senha: senhaCrip,
      contato: telefone,
      termos_de_uso: termosAceitos,
      cidadeId: cidade,
      equipe: nomeEquipe,
      esporteId: esporte
    };

    console.log(data)

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        'access-control-allow-origin': '*'
      }
    };
    api.post('cadastro/usuario', data, headers).then(response => {
      console.log(response.data)
      localStorage.setItem("user_id", response.data.id);
      localStorage.setItem("equipe", nomeEquipe);
      localStorage.setItem("equipe_id", response.data.equipe.equipe_id);
      localStorage.setItem("email", email);
      localStorage.setItem("esporte_id", esporte)
      history('/');
    })
  }


  return (
    <Grid container justify="center" alignItems="center" style={{maxHeight: '100vh', overflowY: 'auto'}}>
      <Grid item xs={8}>
        <Card>
          <CardContent>
            <Dialog
              PaperProps={{
                style: {
                  backgroundColor: '#00a152',
                  width: '500px'
                },
              }}
              open={modal}
            >
              <DialogTitle style={{
                color: "#fafafa",
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
                variant="contained">
                {"Usuário cadastrado com sucesso!"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText variant="body1" align="justify" paragraph={true}
                  style={{
                    color: "#fafafa"
                  }}>
                  <Button variant="contained" color="primary" href="/">
                    OK
                  </Button>
                </DialogContentText>
              </DialogContent>
            </Dialog>
            {/* Título */}
            <Typography variant="h4" component="h4" align="center" style={{ marginBottom: '10px', fontWeight: 'bold' }}>
              MATCHSTART
            </Typography>
            <Typography variant="P" component="h3" align="center" style={{ marginBottom: '10px', fontWeight: 'bold' }}>
              Cadastro de usuário 
            </Typography>
            {/* Formulário */}
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                helperText={emailError ? 'Email inválido ou email já cadastrado!' : ''}
                required

              />
              <TextField
                label="Senha"
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
                label="Confirmar Senha"
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
              <TextField
                label="Telefone"
                variant="outlined"
                fullWidth
                margin="normal"
                value={telefone}
                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                required
              />
              <hr />
              <Typography variant="h5" component="h5" align="left" style={{ marginBottom: '15px', marginTop: '10px', fontWeight: 'bold' }}>
                Local de atuação:
              </Typography>
              <Typography variant="p" component="p" align="left" style={{ marginBottom: '10px', fontWeight: 'bold', textTransform: 'none' }}>
                Após a finalização do cadastro você poderá alterar e inserir mais locais de atuação.
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                  <TextField
                    label="Estado"
                    variant="outlined"
                    fullWidth
                    select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    required
                  >
                    {estadosBrasil.map((estado) => (
                      <MenuItem key={estado} value={estado}>
                        {estado}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
                  <TextField
                    label="Cidade"
                    variant="outlined"
                    fullWidth
                    select
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    required
                    disabled={cidades.length === 0}
                    style={{ marginBottom: '15px' }}
                  >
                    {cidades.map((option) => (
                      <MenuItem key={option.cidade_id} value={option.cidade_id}>
                        {option.cidade}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              <hr />
              <Typography variant="h5" component="h5" align="left" style={{ marginTop: '10px', fontWeight: 'bold' }}>
                Primeira Equipe:
              </Typography>
              <TextField
                label="Nome da Primeira Equipe"
                variant="outlined"
                fullWidth
                margin="normal"
                value={nomeEquipe}
                onChange={(e) => setNomeEquipe(e.target.value)}
                required
                style={{ marginTop: '20px' }}
              />
              <TextField
                label="Esporte"
                variant="outlined"
                fullWidth
                margin="normal"
                select
                value={esporte}
                onChange={(e) => setEsporte(e.target.value)}
                required
              >
                {esportes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ backgroundColor: '#6abf59', color: 'white' }}
                onClick={verificaEmailCadastrado}
              >
                Cadastrar
              </Button>
              <Typography variant="body2" component="p" align="center" style={{ marginTop: '20px' }}>
                Já tem uma conta? <a href="/login">Login</a>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Cadastro;
