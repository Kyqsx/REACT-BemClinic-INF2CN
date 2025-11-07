import React, { useState, useEffect } from "react";
import api from "axios";
import Modal from "react-modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../../styles/artigos.css';

const CategoriaArtigos = () => {
    const [categorias, setCategorias] = useState([]);
    const [nome_categoria, setNome] = useState('');
    const [descricao_categoria, setDescricao] = useState('');
    const [ativo, setAtivo] = useState(true);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCategoriaId, setSelectedCategoriaId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [id, setEditingId] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const categoria = {
            nome_categoria,
            descricao_categoria,
            ativo
        };

        try {
            if (isEditing) {
                await api.put(`/api/v1/categoria-artigos/${id}`, categoria);
            } else {
                await api.post("/api/v1/categoria-artigos/create", categoria);
            }

            fetchCategorias(); // Atualiza a lista de categorias
            resetForm(); // Reseta o formulário
            closeModal(); // Fecha o modal
            setAlertMessage(isEditing ? 'Categoria atualizada com sucesso!' : 'Categoria criada com sucesso!');
            setShowAlert(true); // Mostra o popup de alerta
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (categoria) => {
        setIsEditing(true);
        setEditingId(categoria.id);
        setSelectedCategoriaId(categoria.id);
        setNome(categoria.nome_categoria);
        setDescricao(categoria.descricao_categoria);
        setAtivo(categoria.ativo);
        openModal(); // Abre o modal ao editar
    };

    const fetchCategorias = async () => {
        try {
            const response = await api.get("/api/v1/categoria-artigos");
            setCategorias(response.data);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
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
        setNome('');
        setDescricao('');
        setAtivo(true);
        setIsEditing(false); // Reseta o estado de edição
        setSelectedCategoriaId(null); // Reseta o ID selecionado
    };

    const handleDelete = (id) => {
        setDeleteMessage('Tem certeza que deseja excluir essa categoria?');
        setShowDelete(true);
        setSelectedCategoriaId(id); // Armazena o ID da categoria a ser excluída
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/api/v1/categoria-artigos/${selectedCategoriaId}`);
            setAlertMessage('Categoria excluída com sucesso!');
            fetchCategorias();
        } catch (error) {
            console.error("Erro ao excluir a categoria:", error);
            setAlertMessage('Erro ao excluir a categoria.');
        }
        setShowDelete(false); // Fecha o popup após a confirmação
        setShowAlert(true); // Mostra o popup de alerta
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    return (
        <div className="reminder-page">
            

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
                <h2 className="centerText">{isEditing ? 'Editar Categoria' : 'Criar Categoria'}</h2>
                <form onSubmit={handleSubmit} className="">
                    <div className="artigoInputGroup">
                        <label className="artigoInputLabel">Nome da Categoria</label>
                        <input
                            type="text"
                            placeholder="Nome da Categoria"
                            required
                            value={nome_categoria}
                            onChange={(e) => setNome(e.target.value)}
                            className="artigoInputField"
                        />
                    </div>
                    <div className="artigoInputGroup">
                        <label className="artigoInputLabel">Descrição da Categoria</label>
                        <input
                            type="text"
                            placeholder="Descrição da Categoria"
                            required
                            value={descricao_categoria}
                            onChange={(e) => setDescricao(e.target.value)}
                            className="artigoInputField"
                        />
                    </div>
                    <div className="artigoInputGroup">
                        <label className="artigoInputLabel">Ativo</label>
                        <label className="artigoToggle">
                            <input
                                type="checkbox"
                                checked={ativo}
                                onChange={(e) => setAtivo(e.target.checked)}
                            />
                            <span className="artigoSlider"></span>
                        </label>
                    </div>

                    <div className="row centerButton">
                        <button type="submit" className="artigoButton btnInfo">{isEditing ? 'Atualizar' : 'Cadastrar'}</button>
                        <button onClick={closeModal} className="artigoButton btnError">Fechar</button>
                    </div>
                </form>
            </Modal>
            <div className="container">
                <div className="form3">
                    <button onClick={openModal} className="artigoCatButton btnSuccess">Criar Categoria</button>
                    <h2 className="artigoTitulo">Lista de Categoria de Artigos</h2>
                    <div className="">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Descrição</th>
                                    <th>Status</th>
                                    <th className="artigoTh">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categorias.map(categoria => (
                                    <tr key={categoria.id}>
                                        <td>{categoria.id}</td>
                                        <td>{categoria.nome_categoria}</td>
                                        <td>{categoria.descricao_categoria}</td>
                                        <td>{categoria.ativo ? 'Ativo' : 'Inativo'}</td>
                                        <td className="artigoTd">
                                            <button onClick={() => handleEdit(categoria)} className="artigoTableButton"><FontAwesomeIcon icon={faPencil} /></button>
                                            <button onClick={() => handleDelete(categoria.id)} className="artigoTableButton"><FontAwesomeIcon icon={faTrash} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showDelete && (
                <div className="artigoPopup">
                    <div className="artigoPopup-content">
                        <p>{deleteMessage}</p>
                        <div className="artigoButtons">
                            <button onClick={confirmDelete} className="artigoPopupButton">Confirmar</button>
                            <button onClick={() => setShowDelete(false)} className="btnError">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {showAlert && (
                <div className="artigoPopup">
                    <div className="artigoPopup-content">
                        <p>{alertMessage}</p>
                        <button onClick={() => setShowAlert(false)} className="artigoPopupButton">Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriaArtigos;
