// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './components.css';
import { useState } from 'react';
import { useAuth } from '../utils/useAuth'; // Importando useAuth
import Isotipo from '../assets/Isotipo.png'; // Importando isotipo
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faUser, faShield, faNewspaper, faList } from '@fortawesome/free-solid-svg-icons';

function Header() {
    const { user, logout } = useAuth(); // Obtendo o usuário e a função de logout
    const [isConsultasDropdownOpen, setConsultasDropdownOpen] = useState(false);
    const [isPacientesDropdownOpen, setPacientesDropdownOpen] = useState(false);
    const [isMedicosDropdownOpen, setMedicosDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
    const [isArtigosDropdownOpen, setArtigosDropdownOpen] = useState(false);

    const handleConsultasMouseEnter = () => {
        setConsultasDropdownOpen(true);
        setPacientesDropdownOpen(false);
        setMedicosDropdownOpen(false);
        setUserDropdownOpen(false);
        setArtigosDropdownOpen(false);
    };

    const handleConsultasMouseLeave = () => {
        setConsultasDropdownOpen(false);
    };

    const handlePacientesMouseEnter = () => {
        setPacientesDropdownOpen(true);
        setConsultasDropdownOpen(false);
        setMedicosDropdownOpen(false);
        setUserDropdownOpen(false);
        setArtigosDropdownOpen(false);
    };

    const handlePacientesMouseLeave = () => {
        setPacientesDropdownOpen(false);
    };

    const handleMedicosMouseEnter = () => {
        setMedicosDropdownOpen(true);
        setPacientesDropdownOpen(false);
        setConsultasDropdownOpen(false);
        setUserDropdownOpen(false);
        setArtigosDropdownOpen(false);
    };

    const handleMedicosMouseLeave = () => {
        setMedicosDropdownOpen(false);
    };

    const handleArtigosMouseEnter = () => {
        setArtigosDropdownOpen(true);
        setConsultasDropdownOpen(false);
        setPacientesDropdownOpen(false);
        setMedicosDropdownOpen(false);
        setUserDropdownOpen(false);
    };

    const handleArtigosMouseLeave = () => {
        setArtigosDropdownOpen(false);
    };

    const handleUserMouseEnter = () => {
        setUserDropdownOpen(true);
        setConsultasDropdownOpen(false);
        setPacientesDropdownOpen(false);
        setMedicosDropdownOpen(false);
        setArtigosDropdownOpen(false);
    };

    const handleUserMouseLeave = () => {
        setUserDropdownOpen(false);
    };

    const handleLogout = () => {
        logout(); // Chama a função de logout
    };

    return (
        <header>
            <div className="logo">
                <Link to="/" className="">
                    <img src={Isotipo} alt="BemClinic" className="logo-isotipo" />
                </Link>
            </div>
            <nav>
                {/* ==================== MENU PARA ADMIN ==================== */}
                {user && user.tipo === 'ADMIN' && (
                    <>
                        <Link to="/admin" className='abas dashboard-link'>
                            <FontAwesomeIcon icon={faShield} /> Admin
                        </Link>
                        
                        <div
                            className="dropdown"
                            onMouseEnter={handleArtigosMouseEnter}
                            onMouseLeave={handleArtigosMouseLeave}
                        >
                            <button className="abas">Artigos ▼</button>
                            {isArtigosDropdownOpen && (
                                <div className="dropdown-content">
                                    <Link to="/artigos" className="sub-item"><FontAwesomeIcon icon={faNewspaper} /> Ver Artigos</Link>
                                    <Link to="/categoriaartigos" className="sub-item"><FontAwesomeIcon icon={faList} /> Categorias</Link>
                                </div>
                            )}
                        </div>
                        
                        <Link to="/gerenciar-consultas" className='abas'>Consultas</Link>
                    </>
                )}

                {/* ==================== MENU PARA HOSPITAL ==================== */}
                {user && user.tipo === 'HOSPITAL' && (
                    <>
                        <Link to="/hospital" className='abas dashboard-link'>
                            🏥 Dashboard
                        </Link>
                        <Link to="/gerenciar-consultas" className='abas'>Consultas</Link>
                        <Link to="/medicos" className='abas'>Médicos</Link>
                        
                        <div
                            className="dropdown"
                            onMouseEnter={handleArtigosMouseEnter}
                            onMouseLeave={handleArtigosMouseLeave}
                        >
                            <button className="abas">Artigos ▼</button>
                            {isArtigosDropdownOpen && (
                                <div className="dropdown-content">
                                    <Link to="/artigos" className="sub-item"><FontAwesomeIcon icon={faNewspaper} /> Ver Artigos</Link>
                                    <Link to="/categoriaartigos" className="sub-item"><FontAwesomeIcon icon={faList} /> Categorias</Link>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* ==================== MENU PARA MÉDICO ==================== */}
                {user && user.tipo === 'MEDICO' && (
                    <>
                        <Link to="/consultas" className='abas'>Minhas Consultas</Link>
                        <Link to="/paciente" className='abas'>Pacientes</Link>
                        
                        <div
                            className="dropdown"
                            onMouseEnter={handleArtigosMouseEnter}
                            onMouseLeave={handleArtigosMouseLeave}
                        >
                            <button className="abas">Artigos ▼</button>
                            {isArtigosDropdownOpen && (
                                <div className="dropdown-content">
                                    <Link to="/artigos" className="sub-item">📖 Ver Artigos</Link>
                                    <Link to="/categoriaartigos" className="sub-item">🏷️ Categorias</Link>
                                </div>
                            )}
                        </div>
                        
                        <Link to="/lembretes" className='abas'>Lembretes</Link>
                    </>
                )}

                {/* ==================== MENU PARA PACIENTE ==================== */}
                {user && user.tipo === 'PACIENTE' && (
                    <>
                        <Link to="/solicitar-consulta" className='abas'>Solicitar Consulta</Link>
                        <Link to="/minhas-consultas" className='abas'>Minhas Consultas</Link>
                        <Link to="/vacinas" className='abas'>Vacinas</Link>
                        <Link to="/lembretes" className='abas'>Lembretes</Link>
                    </>
                )}

                {/* ==================== MENU PARA NÃO LOGADOS ==================== */}
                {!user && (
                    <>
                        <Link to="/" className='abas'>Início</Link>
                        <Link to="/medicos" className='abas'>Médicos</Link>
                        <Link to="/artigos" className='abas'>Artigos</Link>
                    </>
                )}

                {/* ==================== PERFIL E LOGOUT ==================== */}
                {user ? (
                    <div
                        className="dropdown user-dropdown"
                        onMouseEnter={handleUserMouseEnter}
                        onMouseLeave={handleUserMouseLeave}
                    >
                        <button className="abas perfil-link">
                            <FontAwesomeIcon icon={faUser} /> {user.nome || 'Perfil'}
                        </button>
                        {isUserDropdownOpen && (
                            <div className="dropdown-content user-dropdown-content">
                                <Link to="/perfil" className="sub-item">
                                    <FontAwesomeIcon icon={faUser} /> Ver Perfil
                                </Link>
                                <button onClick={handleLogout} className="sub-item logout-dropdown">
                                    <FontAwesomeIcon icon={faRightFromBracket} /> Sair
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link to="/login" className='abas login-btn'>Entrar</Link>
                        <Link to="/signup" className='abas signup-btn'>Cadastrar</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;
