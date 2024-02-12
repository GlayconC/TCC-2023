import "../src/styles/main.scss";
import { BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import Inicio from "./pages/Inicio/Inicio";
import Notificacao from "./pages/noficacao/Notificacao";
import Convites from "./pages/convites/Convites";
import Partidas from "./pages/partidas/Partidas";
import Settings from "./pages/atuacao/Settings";
import Equipes from "./pages/Equipes/Equipes";
import Sidebar from "./components/Sidebar/Sidebar";
import Cadastro from "./pages/Cadastro/Index";
import Login from "./pages/login/index";
import Usuario from "./pages/usuario/index";


function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

function AppRoutes() {
    const location = useLocation();

    const isCadastroRoute = location.pathname === '/cadastro';
    const isLoginRoute = location.pathname === '/login';

    return (
        <div className="App">
            {(!isCadastroRoute && !isLoginRoute) && <Sidebar />}
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/notificacao" element={<Notificacao />} />
                <Route path="/convites" element={<Convites />} />
                <Route path="/atuacao" element={<Settings />} />
                <Route path="/equipes" element={<Equipes />} />
                <Route path="/partidas" element={<Partidas />} />
                <Route path="/configuracoes" element={<Usuario />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </div>
    );
}

export default App;