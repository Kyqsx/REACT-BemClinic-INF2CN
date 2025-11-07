import React, { useState, useEffect } from 'react';
import Header from '../../components/header';
import api from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth'; // Importe o hook useAuth
import Modal from 'react-modal'; // Importar Modal
import './home.css';

Modal.setAppElement('#root');

const HomePage = () => {
    const [artigos, setArtigos] = useState([]);
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const [paciente, setPaciente] = useState(null);
    const { userId } = useAuth();
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para controle do modal
    const [selectedArtigo, setSelectedArtigo] = useState(null); // Artigo selecionado

    const fetchArtigos = async () => {
        try {
            const response = await api.get("/api/v1/artigos");
            setArtigos(response.data);
        } catch (error) {
            console.error("Erro ao buscar artigos:", error);
        }
    };

    useEffect(() => {
        fetchArtigos();
    }, []);

    const fetchPacienteData = async () => {
        if (userId) {
            try {
                const response = await api.get(`/api/v1/pacientes/${userId}`);
                const paciente = response.data;

                console.log('Dados do paciente:', paciente);

                const isProfileComplete = paciente.cpf && paciente.rg;
                console.log('Perfil completo?', isProfileComplete);

                if (!isProfileComplete) {
                    setShowProfilePopup(true);
                } else {
                    setShowProfilePopup(false);
                }

                setPaciente(paciente);
            } catch (error) {
                console.error("Erro ao buscar dados do paciente:", error);
            }
        }
    };

    useEffect(() => {
        fetchArtigos();
        fetchPacienteData();
    }, [userId]);

    const handleCompleteProfile = () => {
        navigate(`/completar-perfil/${userId}`);
    };

    const openModal = (artigo) => {
        setSelectedArtigo(artigo);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedArtigo(null);
    };

    return (
        <div className="container">
            <div className='form3'>
                <h2 className='centerText'>Lista de Artigos</h2>
                <div className="reminder-grid">
                    {artigos.filter(artigo => artigo.ativo).map((artigo) => (
                        <div className="blog-post" key={artigo.id}>
                            <img src={artigo.imagem} alt={artigo.titulo} className="post-image" />
                            <h2 className='artigoTexto'>{artigo.titulo}</h2>
                            <p className="artigoDate">Criado em {moment(artigo.data_criacao).format('DD/MM/YYYY')}</p>
                            <p className='artigoTexto'>{artigo.descricao}</p>
                            <button className="button btnInfo" onClick={() => openModal(artigo)}>Ler Mais</button>
                        </div>
                    ))}
                </div>
            </div>

            {showProfilePopup && (
                <div className="popupCompleteProfile">
                    <div className="completeProfilePopup-content">
                        <p>Por favor, complete seu perfil para continuar navegando! 🚀</p>
                        <button onClick={handleCompleteProfile}>Completar Perfil</button>
                    </div>
                </div>
            )}

            {/* Modal para exibir detalhes do artigo */}
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modalArtigoContent" overlayClassName="modalArtigoOverlay">
                {selectedArtigo && (
                    <>
                        <h2 className="modalArtigoTitulo">{selectedArtigo.titulo}</h2>
                        <p className="modalArtigoConteudo">{selectedArtigo.conteudo}</p>
                        <button onClick={closeModal} className="button btnError">Fechar</button>
                    </>
                )}
            </Modal>

        </div>
    );
};

export default HomePage;
