// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './components.css';
import { useState } from 'react';
import { useAuth } from '../utils/useAuth'; // Importando useAuth

function Header() {
    const { user, logout } = useAuth(); // Obtendo o usuário e a função de logout
    const [isConsultasDropdownOpen, setConsultasDropdownOpen] = useState(false);
    const [isPacientesDropdownOpen, setPacientesDropdownOpen] = useState(false);
    const [isMedicosDropdownOpen, setMedicosDropdownOpen] = useState(false);

    const handleConsultasMouseEnter = () => {
        setConsultasDropdownOpen(true);
        setPacientesDropdownOpen(false);
        setMedicosDropdownOpen(false);
    };

    const handleConsultasMouseLeave = () => {
        setConsultasDropdownOpen(false);
    };

    const handlePacientesMouseEnter = () => {
        setPacientesDropdownOpen(true);
        setConsultasDropdownOpen(false);
        setMedicosDropdownOpen(false);
    };

    const handlePacientesMouseLeave = () => {
        setPacientesDropdownOpen(false);
    };

    const handleMedicosMouseEnter = () => {
        setMedicosDropdownOpen(true);
        setPacientesDropdownOpen(false);
        setConsultasDropdownOpen(false);
    };

    const handleMedicosMouseLeave = () => {
        setMedicosDropdownOpen(false);
    };

    const handleLogout = () => {
        logout(); // Chama a função de logout
    };

    return (
        <header>
            <div>
                <Link to="/" className="abas">Home</Link>
            </div>
            <nav>
                {user && (user.tipo === 'ADMIN' || user.tipo === 'MEDICO') && (
                    <Link to="/artigos" className='abas'>Artigos</Link>
                )}
                {user && (user.tipo === 'ADMIN' || user.tipo === 'MEDICO') && (
                    <Link to="/categoriaartigos" className='abas'>Categoria Artigos</Link>
                )}

                {/*<div
                    className="dropdown"
                    onMouseEnter={handleConsultasMouseEnter}
                    onMouseLeave={handleConsultasMouseLeave}
                >
                    <button className="abas">
                        Consultas
                    </button>
                    {isConsultasDropdownOpen && (
                        <div className="dropdown-content">
                            <Link to='/marcarconsulta' className="sub-item">Marcar Consulta</Link>
                            <Link to='/consultas' className="sub-item">Ver Consultas</Link>
                        </div>
                    )}
                </div>*/}
                <Link to="/lembretes" className='abas'>Lembretes</Link>
                <Link to="/vacinas" className='abas'>Vacinas</Link>

                {/* Renderiza o menu de Pacientes apenas se o usuário for ADMIN */}
                {user && user.tipo === 'ADMIN' && (
                    <div
                        className="dropdown"
                        onMouseEnter={handlePacientesMouseEnter}
                        onMouseLeave={handlePacientesMouseLeave}
                    >
                        <button className="abas">
                            Pacientes
                        </button>
                        {isPacientesDropdownOpen && (
                            <div className="dropdown-content">
                                <Link to='/cadastrarpaciente' className="sub-item">Cadastrar Paciente</Link>
                                <Link to='/paciente' className="sub-item">Listar Pacientes</Link>
                                <Link to="/registropaciente" className='sub-item'>Cadastro Novo</Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Renderiza o menu de Médicos apenas se o usuário for ADMIN */}
                {user && user.tipo === 'ADMIN' && (
                    <div
                        className="dropdown"
                        onMouseEnter={handleMedicosMouseEnter}
                        onMouseLeave={handleMedicosMouseLeave}
                    >
                        <button className="abas">
                            Médicos
                        </button>
                        {isMedicosDropdownOpen && (
                            <div className="dropdown-content">
                                <Link to='/cadastrarmedico' className="sub-item">Cadastrar Médico</Link>
                                <Link to='/medicos' className="sub-item">Listar Médicos</Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Links de Perfil e Logout */}
                {user ? (
                    <>
                        <button onClick={handleLogout} className='abas'>Sair</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className='abas'>Entrar/Cadastrar</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;
