import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from './utils/useAuth';
import Home from "./pages/Home/home";
import Login from "./pages/Auth/login";
import SolicitarConsulta from './pages/Consultas/solicitarConsulta';
import MinhasConsultas from './pages/Consultas/minhasConsultas';
import GerenciarConsultas from './pages/Consultas/gerenciarConsultas';
import Paciente from './pages/Paciente/pacientes';
import CadastrarPaciente from './pages/Paciente/cadastrarpaciente';
import Signup from './pages/Auth/signup';
import MedicosHospital from './pages/Hospital/medicos';
import CadastrarMedicosHospital from './pages/Hospital/cadastrarMedicos';
import Lembretes from './pages/Lembretes/lembretes';
import CategoriaArtigos from './pages/Artigos/categoriaArtigo';
import Artigos from './pages/Artigos/artigos';
import Perfil from './pages/Perfil/perfil';
import CompletarPerfil from './pages/Perfil/completar_perfil'
import CompletarPerfilHospital from './pages/Perfil/completarPerfilHospital'
import CadastrarEndereco from './pages/CadastroEndereco/cadastrarendereco'
import Vacinas from './pages/Vacinas/vascinas'
import AdminDashboard from './pages/Admin/adminDashboard'
import AdminHospitais from './pages/Admin/adminHospitais'
import AdminCadastrarHospital from './pages/Admin/adminCadastrarHospital'
import FixData from './pages/Admin/fixData'
import DashboardHospital from './pages/Hospital/dashboardHospital'
import AcessoNegado from './pages/AcessoNegado/acessoNegado'

import Header from "./components/header";


function RotasApp(){
    return(
        <AuthProvider>
        <BrowserRouter>
                <Routes>

                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/acesso-negado" element={<AcessoNegado/>}/>
                    <Route path="/completar-perfil/:userId" element={<CompletarPerfil />} />
                    <Route path="/completar-perfil-hospital" element={<CompletarPerfilHospital />} />
                    <Route path="/cadastrar-endereco" element={<CadastrarEndereco/>}/>
                <Route element={<Layout/>}>

                    <Route path="/" element={<Home/>}/>
                    <Route path="/solicitar-consulta" element={<SolicitarConsulta/>}/>
                    <Route path="/minhas-consultas" element={<MinhasConsultas/>}/>
                    <Route path="/gerenciar-consultas" element={<GerenciarConsultas/>}/>
                    <Route path="/paciente" element={<Paciente/>}/>
                    <Route path="/cadastrarpaciente" element={<CadastrarPaciente/>}/>
                    <Route path="/lembretes" element={<Lembretes/>}/>
                    <Route path="/categoriaartigos" element={<CategoriaArtigos/>}/>
                    <Route path="/artigos" element={<Artigos/>}/>
                    <Route path="/vacinas" element={<Vacinas/>}/>
                    <Route path="/perfil" element={<Perfil/>}/>
                    
                    {/* Rotas Admin */}
                    <Route path="/admin" element={<AdminDashboard/>}/>
                    <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
                    <Route path="/admin/hospitais" element={<AdminHospitais/>}/>
                    <Route path="/admin/cadastrar-hospital" element={<AdminCadastrarHospital/>}/>
                    <Route path="/admin/editar-hospital/:id" element={<AdminCadastrarHospital/>}/>
                    <Route path="/admin/fix" element={<FixData/>}/>
                    
                    {/* Rotas Hospital */}
                    <Route path="/hospital" element={<DashboardHospital/>}/>
                    <Route path="/hospital/dashboard" element={<DashboardHospital/>}/>
                    <Route path="/hospital/medicos" element={<MedicosHospital/>}/>
                    <Route path="/hospital/medicos/cadastrar" element={<CadastrarMedicosHospital/>}/>
                    <Route path="/hospital/medicos/editar/:id" element={<CadastrarMedicosHospital/>}/>
                    <Route path="/hospital/medicos/:id" element={<MedicosHospital/>}/>
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