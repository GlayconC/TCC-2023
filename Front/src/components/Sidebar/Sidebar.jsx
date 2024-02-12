import React, { useState, useEffect } from "react";
import Profile from "../../Images/profile.png";
import Player from "../../Images/player.png";
import Dashboard from "../../Images/dashboard.svg";
import Transactions from "../../Images/transactions.svg";
import Lupa from '../../Images/lupa.svg';
import News from "../../Images/news.svg";
import Settings from "../../Images/settings.svg";
import Support from "../../Images/support.svg";
import Login from "../../Images/login.svg";
import { useLocation } from "react-router-dom";
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import { TextField, MenuItem, Grid } from "@material-ui/core";


const Sidebar = () => {
    const location = useLocation();

    const [closeMenu, setCloseMenu] = useState(false);
    const [equipe, setEquipe] = useState(localStorage.getItem('equipe_id'));
    const [equipes, setEquipes] = useState([]);
    const history = useNavigate();


    const handleCloseMenu = () => {
        setCloseMenu(!closeMenu);
    };

    const deslogar = () => {
        localStorage.setItem('user_id', '')
        history('/login');
        
    }

    useEffect(() => {
        if(localStorage.getItem('user_id') === '' || localStorage.getItem('user_id') === null){
            history('/login');
        }

        setEquipe(localStorage.getItem('equipe_id'))

        const data = {
          user_id: localStorage.getItem('user_id')
        }
        const headers = {
          headers: {
            'Content-Type': 'application/json',
            'access-control-allow-origin': '*'
          }
        };
        api.post('equipes/me', data, headers).then(response => {
            console.log(response.data)
          setEquipes(response.data)
        })
      }, []);

      const handleEquipeChange = (e) => {
        setEquipe(e.target.value);
        localStorage.setItem("equipe_id", e.target.value)
        api.get(`equipes/esporte/${e.target.value}`)
        .then(response => {
            console.log(response.data);
            localStorage.setItem("esporte_id", response.data[0].esporte_id)
            window.location.reload();
        })
        .catch(error => {
            console.error('Erro:', error);
        });

        localStorage.setItem("esporte_id", )
        window.location.reload();
    };

    return (
        <div className={closeMenu === false ? "sidebar" : "sidebar active"}>
            <div
                className={
                    closeMenu === false
                        ? "burgerContainer"
                        : "burgerContainer active"
                }
            >
                <div
                    className="burgerTrigger"
                    onClick={() => {
                        handleCloseMenu();
                    }}
                ></div>
                <div className="burgerMenu"></div>
            </div>
            {closeMenu === false && (
                <>
                    
                    <div className="profileContainer">
                        <img src={Profile} alt="profile" className="profile" />
                        <div className="profileContents">
                            <p className="name" style={{textTransform: 'none' }}>Bem vindo, {localStorage.getItem('email')}</p>
                        </div>
                    </div>
                    <div className="profileContainer">
                        <img src={Player} alt="player" className="player" />
                        <div className="profileContents">
                            <Grid item xs={12}>
                                <TextField
                                variant="outlined"
                                label="Equipe:"
                                fullWidth
                                select
                                value={equipe}
                                onChange={handleEquipeChange}
                                >
                                {equipes.map((equipe) => (
                                <MenuItem key={equipe.equipe_id} value={equipe.equipe_id}>
                                    {equipe.nome}
                                </MenuItem>
                                ))}
                                </TextField>
                            </Grid>
                        </div>
                    </div>
                </>
            )}
            {closeMenu === false && (
                 <div className="contentsContainer" style={{ maxWidth: '250px', overflowX: 'auto' }}>
                    <ul>
                        <li className={location.pathname === "/" ? "active" : ""}>
                            <img src={Dashboard} alt="dashboard" />
                            <a href="/">Início</a>
                        </li>
                        <li
                            className={
                                location.pathname === "/partidas" ? "active" : ""
                            }
                        >
                            <img src={Transactions} alt="partidas" />
                            <a href="/partidas">minhas partidas</a>
                        </li>

                        <li
                            className={
                                location.pathname === "/convites" ? "active" : ""
                            }
                        >
                            <img src={Lupa} alt="Lupa" />
                            <a href="/convites">Convites de partidas</a>
                        </li>
                        <p>Configurações de Usuário:</p>
                        <li
                            className={
                                location.pathname === "/notificacao" ? "active" : ""
                            }
                        >
                            <img src={News} alt="Notificacao" />
                            <a href="/notificacao">Notificações</a>
                        </li>
                        <li
                            className={
                                location.pathname === "/atuacao" ? "active" : ""
                            }
                        >
                            <img src={Settings} alt="Atuacao" />
                            <a href="/atuacao">Locais de Atuação</a>
                        </li>
                        <li
                            className={
                                location.pathname === "/equipes" ? "active" : ""
                            }
                        >
                            <img src={Support} alt="Support" />
                            <a href="/equipes">Criar/Alterar Equipe</a>
                        </li>
                        <li
                            className={
                                location.pathname === "/configuracoes" ? "active" : ""
                            }
                        >
                            <img src={Login} alt="Login" />
                            <a href="/configuracoes">Alterar usuário</a>
                            
                        </li>
                        <li
                            className={
                                location.pathname === "/logout" ? "active" : ""
                            }
                        >
                            <a onClick={() => {deslogar()}} >Logout</a>
                            
                        </li>

                        
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Sidebar;