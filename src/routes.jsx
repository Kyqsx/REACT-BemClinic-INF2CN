import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from './utils/useAuth';
import Home from "./pages/Home/home";
import Login from "./pages/Auth/login";
import Consulta from './pages/Consultas/consulta';
import MarcarConsulta from './pages/Consultas/marcarconsulta';
import Paciente from './pages/Paciente/pacientes';
import CadastrarPaciente from './pages/Paciente/cadastrarpaciente';
import Signup from './pages/Auth/signup';
import Medicos from './pages/Medicos/medicos';
import CadastrarMedicos from './pages/Medicos/cadastrarmedicos';
import Lembretes from './pages/Lembretes/lembretes';
import CategoriaArtigos from './pages/Artigos/categoriaArtigo';
import Artigos from './pages/Artigos/artigos';
import Perfil from './pages/Perfil/perfil';
import CompletarPerfil from './pages/Perfil/completar_perfil'
import CadastrarEndereco from './pages/CadastroEndereco/cadastrarendereco'
import Vacinas from './pages/Vacinas/vascinas'

import Header from "./components/header";


function RotasApp(){
    return(
        <AuthProvider>
        <BrowserRouter>
                <Routes>

                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/completar-perfil/:userId" element={<CompletarPerfil />} />
                    <Route path="/cadastrar-endereco" element={<CadastrarEndereco/>}/>
                <Route element={<Layout/>}>

                    <Route path="/" element={<Home/>}/>
                    <Route path="/consultas" element={<Consulta/>}/>
                    <Route path="/marcarconsulta" element={<MarcarConsulta/>}/>
                    <Route path="/paciente" element={<Paciente/>}/>
                    <Route path="/cadastrarpaciente" element={<CadastrarPaciente/>}/>
                    <Route path="/lembretes" element={<Lembretes/>}/>
                    <Route path="/categoriaartigos" element={<CategoriaArtigos/>}/>
                    <Route path="/artigos" element={<Artigos/>}/>
                    <Route path="/medicos" element={<Medicos/>}/>
                    <Route path="/vacinas" element={<Vacinas/>}/>
                    <Route path="/perfil" element={<Perfil/>}/>
                    
                    <Route path="/cadastrarmedicos" element={<CadastrarMedicos/>}/>
                    </Route>
                </Routes>
        </BrowserRouter>
        </AuthProvider>
    );
}

function Layout(){
    return(
        <>
        <Header/>

        <main>
            <Outlet/>
        </main>
        </>
    )
}
export default RotasApp;