import React, { useState, useEffect } from "react";
import api from "axios";
import { useAuth } from '../../utils/useAuth';
import Modal from "react-modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendar, faPencil, faTrash, faHome, faHeading, faClock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import '../../styles/outras.css';

const Lembretes = () => {
    const { userId } = useAuth();
    const [titulo_lembrete, setTitulo] = useState('');
    const [data_lembrete, setData] = useState('');
    const [hora_lembrete, setHora] = useState('');
    const [id_usuario, setIdUsuario] = useState('');
    const [nome_paciente, setNome] = useState('');
    const [local_lembrete, setLocal] = useState('');
    const [status_lembrete, setStatus] = useState("PENDENTE");
    const [lembretes, setLembretes] = useState([]);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedLembreteId, setSelectedLembreteId] = useState(null);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [id, setEditingId] = useState(null);

    // Estado para controlar o popup de confirmação de exclusão
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const lembrete = {
            titulo_lembrete,
            data_lembrete,
            hora_lembrete,
            id_usuario: userId,
            nome_paciente,
            local_lembrete,
            status_lembrete
        };

        try {
            if (isEditing) {
                await api.put(`/api/v1/lembretes/${id}`, lembrete);
                setMessage('Lembrete atualizado com sucesso!'); // Mensagem de sucesso ao atualizar
            } else {
                await api.post("/api/v1/lembretes/create", lembrete);
                setMessage('Lembrete criado com sucesso!'); // Mensagem de sucesso ao criar
            }

            fetchLembretes(); // Atualiza a lista de lembretes
            resetForm(); // Reseta o formulário
            closeModal(); // Fecha o modal
        } catch (err) {
            console.error(err);
            setMessage('Erro ao salvar o lembrete.'); // Mensagem de erro
        }
        setShowMessage(true); // Mostra o popup de mensagem
    };

    const handleEdit = (lembrete) => {
        setIsEditing(true);
        setEditingId(lembrete.id);
        setSelectedLembreteId(lembrete.id);
        setTitulo(lembrete.titulo_lembrete);
        setData(lembrete.data_lembrete);
        setHora(lembrete.hora_lembrete);
        setNome(lembrete.nome_paciente);
        setLocal(lembrete.local_lembrete);
        openModal(); // Abre o modal ao editar
    };

    const fetchLembretes = async () => {
        try {
            const response = await api.get("/api/v1/lembretes");
            setLembretes(response.data);
        } catch (error) {
            console.error("Erro ao buscar lembretes:", error);
        }
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setTitulo('');
        setData('');
        setHora('');
        setNome('');
        setLocal('');
        setStatus('');
        setIsEditing(false); // Reseta o estado de edição
        setSelectedLembreteId(null); // Reseta o ID selecionado
    };

    const handleLembreteClick = (id) => {
        setSelectedLembreteId(selectedLembreteId === id ? null : id); // Alterna a seleção do lembrete
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/api/v1/lembretes/${selectedLembreteId}`);
            setMessage('Lembrete excluído com sucesso!'); // Mensagem de sucesso ao excluir
            fetchLembretes();
            setSelectedLembreteId(null);
        } catch (error) {
            console.error("Erro ao excluir o lembrete:", error);
            setMessage('Erro ao excluir o lembrete.'); // Mensagem de erro
        }
        setShowMessage(true); // Mostra o popup de mensagem
        setShowDeleteConfirm(false); // Fecha o popup de confirmação
    };

    const handleDelete = (id) => {
        setSelectedLembreteId(id); // Armazena o ID do lembrete a ser excluído
        setShowDeleteConfirm(true); // Abre o popup de confirmação
    };

    useEffect(() => {
        fetchLembretes();
    }, []);

    return (
        <div className="reminder-page">
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
                <h2 className="centerText">{isEditing ? 'Editar Lembrete' : 'Criar Lembrete'}</h2>
                <form onSubmit={handleSubmit} className="">
                    <div className="lembreteInputGroup horizontal">
                        <label className="lembreteInputLabel" title="Título">
                            <FontAwesomeIcon icon={faHeading} />
                        </label>
                        <input
                            type="text"
                            className="lembreteInputField"
                            placeholder="Título do lembrete"
                            required
                            value={titulo_lembrete}
                            onChange={(e) => setTitulo(e.target.value)}
                        />
                    </div>
                    <div className="lembreteInputGroup horizontal">
                        <label className="lembreteInputLabel" title="Data">
                            <FontAwesomeIcon icon={faCalendar} />
                        </label>
                        <input
                            type="date"
                            className="lembreteInputField"
                            required
                            value={data_lembrete}
                            onChange={(e) => setData(e.target.value)}
                        />
                    </div>
                    <div className="lembreteInputGroup horizontal">
                        <label className="lembreteInputLabel" title="Hora">
                            <FontAwesomeIcon icon={faClock} />
                        </label>
                        <input
                            type="time"
                            className="lembreteInputField"
                            required
                            value={hora_lembrete}
                            onChange={(e) => setHora(e.target.value)}
                        />
                    </div>
                    <div className="lembreteInputGroup horizontal">
                        <label className="lembreteInputLabel" title="Nome do Paciente">
                            <FontAwesomeIcon icon={faUser} />
                        </label>
                        <input
                            type="text"
                            className="lembreteInputField"
                            placeholder="Nome do paciente"
                            required
                            value={nome_paciente}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>
                    <div className="lembreteInputGroup horizontal">
                        <label className="lembreteInputLabel" title="Local">
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                        </label>
                        <input
                            type="text"
                            className="lembreteInputField"
                            placeholder="Local do lembrete"
                            required
                            value={local_lembrete}
                            onChange={(e) => setLocal(e.target.value)}
                        />
                    </div>
                    <div className="row centerButton">
                        <button type="submit" className="button btnInfo">{isEditing ? 'Atualizar' : 'Cadastrar'}</button>
                        <button onClick={closeModal} className="button btnError">Fechar</button>
                    </div>
                </form>
            </Modal>

            <div className="container">
                <div className="form3">
                    <button onClick={openModal} className="lembreteButton btnSuccess">Criar Lembrete</button>
                    <h2 className="lembreteTitulo">Lista de Lembretes</h2>
                    <div className="reminder-grid">
                        {lembretes.filter(lembrete => lembrete.id_usuario === userId).map((lembrete) => (
                            <div
                                className="reminder-card"
                                key={lembrete.id}
                                onClick={() => handleLembreteClick(lembrete.id)} // Adiciona o evento de clique
                            >
                                <h3 className="reminder-title">{lembrete.titulo_lembrete}</h3>
                                <p className="reminder-content"><FontAwesomeIcon icon={faCalendar} /> {lembrete.data_lembrete}  às {lembrete.hora_lembrete}</p>
                                <p className="reminder-content"><FontAwesomeIcon icon={faUser} /> {lembrete.nome_paciente}</p>
                                <p className="reminder-content"><FontAwesomeIcon icon={faHome} /> {lembrete.local_lembrete}</p>
                                {/* Exibe os botões se o lembrete estiver selecionado */}
                                {selectedLembreteId === lembrete.id && (
                                    <div className="lembreteButtons">
                                        <button
                                            className="lembreteTableButton btnError"
                                            onClick={(e) => { e.stopPropagation(); handleDelete(lembrete.id); }}
                                        ><FontAwesomeIcon icon={faTrash} /></button>
                                        <button
                                            className="lembreteTableButton btnInfo"
                                            onClick={(e) => { e.stopPropagation(); handleEdit(lembrete); }}
                                        ><FontAwesomeIcon icon={faPencil} /></button> {/* Botão de edição */}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showMessage && (
                <div className="lembretePopup">
                    <div className="lembretePopup-content">
                        <p>{message}</p>
                        <button onClick={() => setShowMessage(false)} className="lembretePopupButton">Fechar</button>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="lembretePopup">
                    <div className="lembretePopup-content">
                        <p>Tem certeza que deseja excluir este lembrete?</p>
                        <div className="lembreteButtons">
                            <button onClick={confirmDelete} className="button btnError">Confirmar</button>
                            <button onClick={() => setShowDeleteConfirm(false)} className="button btnInfo">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Lembretes;
