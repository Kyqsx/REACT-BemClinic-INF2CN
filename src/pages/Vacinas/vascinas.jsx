import api from 'axios';
import { useAuth } from '../../utils/useAuth';
import Modal from 'react-modal'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faPencil, faTrash, faHome, faPaperclip, faSyringe, faNotesMedical, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import '../../styles/outras.css';

const Vacinas = () => {
    const { userId } = useAuth();
    const [id_usuario, setIdUsuario] = useState('');
    const [vacinas, setVacinas] = useState([]);
    const [nome_vacina, setNomeVacina] = useState('');
    const [data_vacina, setDataVacina] = useState('');
    const [dose, setDose] = useState('');
    const [local_vacina, setLocalVacina] = useState('');
    const [observacao, setObservacao] = useState('');

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedVacinaId, setSelectedVacinaId] = useState(null);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [id, setEditingId] = useState(null);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const handleSubmit = async (v) => {
        v.preventDefault();
        const vacina = {
            id_usuario: userId,
            nome_vacina,
            data_vacina,
            dose,
            local_vacina,
            observacao
        }

        try {
            if (isEditing) {
                await api.put(`/api/v1/vacinas/${id}`, vacina)
                setMessage('Vacina atualizada com sucesso!');
            } else {
                await api.post(`/api/v1/vacinas/create`, vacina)
                setMessage('Vacina criada com sucesso!')
            }

            fetchVacinas();
            resetForm();
            closeModal();
        } catch (err) {
            console.error(err)
            setMessage('Erro ao salvar a vacina');
        }
        setShowMessage(true);
    }

    const handleEdit = (vacina) => {
        setIsEditing(true);
        setEditingId(vacina.id);
        setSelectedVacinaId(vacina.id);
        setNomeVacina(vacina.nome_vacina);
        setDataVacina(vacina.data_vacina);
        setDose(vacina.dose);
        setLocalVacina(vacina.local_vacina);
        setObservacao(vacina.observacao);
        openModal(true);
    }

    const fetchVacinas = async () => {
        try {
            const response = await api.get("/api/v1/vacinas/listall");
            setVacinas(response.data)
        } catch (error) {
            console.error("Erro ao buscar a vacina:", error)
        }
    }

    const openModal = () => {
        setModalIsOpen(true);
    }
    const closeModal = () => {
        setModalIsOpen(false);
        resetForm();
    }

    const resetForm = () => {
        setNomeVacina('');
        setDataVacina('');
        setDose('');
        setLocalVacina('');
        setObservacao('');
        setIsEditing(false);
        setSelectedVacinaId(null);
    }

    const handleVacinaClick = (id) => {
        setSelectedVacinaId(selectedVacinaId === id ? null : id);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/api/v1/vacinas/${selectedVacinaId}`);
            setMessage('Vacina excluída com sucesso!'); // Mensagem de sucesso ao excluir
            fetchVacinas();
            setSelectedVacinaId(null);
        } catch (error) {
            console.error("Erro ao excluir a vacina:", error);
            setMessage('Erro ao excluir a vacina.'); // Mensagem de erro
        }
        setShowMessage(true); // Mostra o popup de mensagem
        setShowDeleteConfirm(false); // Fecha o popup de confirmação
    };

    const handleDelete = (id) => {
        setDataVacina(id); // Armazena o ID do vacina a ser excluído
        setShowDeleteConfirm(true); // Abre o popup de confirmação
    };

    useEffect(() => {
        fetchVacinas();
    }, []);

    return (
        <div className="reminder-page">
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
                <h2 className="centerText">{isEditing ? 'Editar Vacina' : 'Criar Vacina'}</h2>
                <form onSubmit={handleSubmit} className="">
                    <div className="vacinaInputGroup horizontal">
                        <label className="vacinaInputLabel" title="Nome da Vacina">
                            <FontAwesomeIcon icon={faSyringe} />
                        </label>
                        <input
                            type="text"
                            className="vacinaInputField"
                            required
                            placeholder="Nome da vacina"
                            value={nome_vacina}
                            onChange={(e) => setNomeVacina(e.target.value)}
                        />
                    </div>
                    <div className="vacinaInputGroup horizontal">
                        <label className="vacinaInputLabel" title="Data da Vacina">
                            <FontAwesomeIcon icon={faCalendar} />
                        </label>
                        <input
                            type="date"
                            className="vacinaInputField"
                            required
                            value={data_vacina}
                            onChange={(e) => setDataVacina(e.target.value)}
                        />
                    </div>
                    <div className="vacinaInputGroup horizontal">
                        <label className="vacinaInputLabel" title="Dose">
                            <FontAwesomeIcon icon={faNotesMedical} />
                        </label>
                        <select
                            className="vacinaInputField"
                            value={dose}
                            onChange={(e) => setDose(e.target.value)}
                            required
                        >
                            <option value="">Selecione a dose</option>
                            <option value="dose1">1º Dose</option>
                            <option value="dose2">2º Dose</option>
                            <option value="doseReforco">Dose de Reforço</option>
                            <option value="doseAdicional">Dose Adicional</option>
                        </select>
                    </div>
                    <div className="vacinaInputGroup horizontal">
                        <label className="vacinaInputLabel" title="Local">
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                        </label>
                        <input
                            type="text"
                            className="vacinaInputField"
                            required
                            placeholder="Local da vacinação"
                            value={local_vacina}
                            onChange={(e) => setLocalVacina(e.target.value)}
                        />
                    </div>
                    <div className="vacinaInputGroup horizontal">
                        <label className="vacinaInputLabel" title="Observação">
                            <FontAwesomeIcon icon={faPaperclip} />
                        </label>
                        <input
                            type="text"
                            placeholder="Observações"
                            value={observacao}
                            onChange={(e) => setObservacao(e.target.value)}
                            className="vacinaInputField"
                        />
                    </div>
                    <div className="inputGroup row centerButton">
                        <button type="submit" className="button btnInfo">{isEditing ? 'Atualizar' : 'Cadastrar'}</button>
                        <button onClick={closeModal} className="button btnError">Fechar</button>
                    </div>
                </form>
            </Modal>

            <div className="container">
                <div className="form3">
                    <button onClick={openModal} className="vacinaButton btnSuccess">Criar Vacina</button>
                    <h2 className="vacinaTitulo">Lista de Vacinas</h2>
                    <div className="reminder-grid">
                        {vacinas.filter(vacina => vacina.id_usuario === userId).map((vacina) => (
                            <div
                                className="reminder-card"
                                key={vacina.id}
                                onClick={() => handleVacinaClick(vacina.id)} // Adiciona o evento de clique
                            >
                                <h3 className="reminder-title">{vacina.nome_vacina}</h3>
                                <p className="reminder-content"><FontAwesomeIcon icon={faCalendar} /> {vacina.data_vacina}</p>
                                <p className="reminder-content"><FontAwesomeIcon icon={faSyringe} /> {vacina.dose}</p>
                                <p className="reminder-content"><FontAwesomeIcon icon={faHome} /> {vacina.local_vacina}</p>
                                <p className="reminder-content"><FontAwesomeIcon icon={faPaperclip}/> {vacina.observacao}</p>
                                {/* Exibe os botões se o vacina estiver selecionado */}
                                {selectedVacinaId === vacina.id && (
                                    <div className="vacinaButtons">
                                        <button
                                            className="vacinaTableButton btnError"
                                            onClick={(e) => { e.stopPropagation(); handleDelete(vacina.id); }}
                                        ><FontAwesomeIcon icon={faTrash} /></button>
                                        <button
                                            className="vacinaTableButton btnInfo"
                                            onClick={(e) => { e.stopPropagation(); handleEdit(vacina); }}
                                        ><FontAwesomeIcon icon={faPencil} /></button> {/* Botão de edição */}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showMessage && (
                <div className="vacinaPopup">
                    <div className="vacinaPopup-content">
                        <p>{message}</p>
                        <button onClick={() => setShowMessage(false)} className="vacinaPopupButton">Fechar</button>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="vacinaPopup">
                    <div className="vacinaPopup-content">
                        <p>Tem certeza que deseja excluir este vacina?</p>
                        <div className="vacinaButtons">
                            <button onClick={confirmDelete} className="button btnError">Confirmar</button>
                            <button onClick={() => setShowDeleteConfirm(false)} className="button btnInfo">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Vacinas