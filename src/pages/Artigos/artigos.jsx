import React, { useState, useEffect } from "react";
import api from "axios";
import Modal from "react-modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendar, faPencil, faTrash, faHome } from '@fortawesome/free-solid-svg-icons';
import './artigos.css';

Modal.setAppElement('#root');

const Artigos = () => {
    const [artigos, setArtigos] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [conteudo, setConteudo] = useState('');
    const [imagem, setImagem] = useState('');
    const [data_criacao, setDataCriacao] = useState('');
    const [data_atualizacao, setDataAtualizacao] = useState('');
    const [ativo, setAtivo] = useState(true);
    const [id_categoria, setCategoriaId] = useState('');

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedArtigoId, setSelectedArtigoId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const artigo = {
            titulo,
            descricao,
            conteudo,
            imagem,
            data_criacao,
            data_atualizacao,
            ativo,
            id_categoria
        };

        try {
            if (isEditing) {
                await api.put(`http://localhost:8080/api/v1/artigos/${selectedArtigoId}`, artigo);
                setAlertMessage('Artigo atualizado com sucesso!'); // Mensagem de sucesso ao atualizar
            } else {
                await api.post("http://localhost:8080/api/v1/artigos/create", artigo);
                setAlertMessage('Artigo criado com sucesso!'); // Mensagem de sucesso ao criar
            }
            fetchArtigos(); // Atualiza a lista de artigos
            resetForm(); // Reseta o formulário
            closeModal(); // Fecha o modal
        } catch (err) {
            console.error(err);
            setAlertMessage('Erro ao atualizar/criar o artigo. Verifique os dados e tente novamente.');
        }
        setShowAlert(true); // Mostra o popup de alerta
    };

    const handleEdit = (artigo) => {
        setIsEditing(true);
        setSelectedArtigoId(artigo.id);
        setTitulo(artigo.titulo);
        setDescricao(artigo.descricao);
        setConteudo(artigo.conteudo);
        setImagem(artigo.imagem);
        setAtivo(artigo.ativo);
        setCategoriaId(artigo.id_categoria);
        openModal(); // Abre o modal ao editar
    };

    const fetchArtigos = async () => {
        try {
            const response = await api.get("http://localhost:8080/api/v1/artigos");
            setArtigos(response.data);
        } catch (error) {
            console.error("Erro ao buscar artigos:", error);
        }
    };

    useEffect(() => {
        api.get("http://localhost:8080/api/v1/categoria-artigos")
            .then(res => setCategorias(res.data))
            .catch(() => console.error("Erro ao buscar categorias"));
    }, []);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setTitulo('');
        setDescricao('');
        setConteudo('');
        setImagem('');
        setAtivo(true);
        setCategoriaId('');
        setIsEditing(false); // Reseta o estado de edição
        setSelectedArtigoId(null); // Reseta o ID selecionado
    };

    const handleDelete = (id) => {
        setDeleteMessage('Tem certeza que deseja excluir esse artigo?');
        setShowDelete(true);
        setSelectedArtigoId(id); // Armazena o ID do artigo a ser excluído
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`http://localhost:8080/api/v1/artigos/${selectedArtigoId}`);
            setAlertMessage('Artigo excluído com sucesso!');
            fetchArtigos();
        } catch (error) {
            console.error("Erro ao excluir o artigo:", error);
            setAlertMessage('Erro ao excluir o artigo. ' + (error.response?.data.message || 'Tente novamente.'));
        }
        setShowDelete(false); // Fecha o popup após a confirmação
        setShowAlert(true); // Mostra o popup de alerta
    };

    useEffect(() => {
        fetchArtigos();
    }, []);

    return (
        <div className="reminder-page">
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
                <h2 className="centerText">{isEditing ? 'Editar Artigo' : 'Criar Artigo'}</h2>
                <form onSubmit={handleSubmit} className="reminder-form">
                    <div className="artigoInputGroup">
                        <label className="artigoInputLabel">Título</label>
                        <input
                            type="text"
                            value={titulo}
                            required
                            onChange={(e) => setTitulo(e.target.value)}
                            className="artigoInputField"
                        />
                    </div>
                    <div className="artigoInputGroup">
                        <label className="artigoInputLabel">Descrição</label>
                        <input
                            type="text"
                            value={descricao}
                            required
                            onChange={(e) => setDescricao(e.target.value)}
                            className="artigoInputField"
                        />
                    </div>
                    <div className="artigoInputGroup">
                        <label className="artigoInputLabel">Conteúdo</label>
                        <textarea
                            value={conteudo}
                            required
                            onChange={(e) => setConteudo(e.target.value)}
                            className="artigoInputField"
                        />
                    </div>
                    <div className="artigoInputGroup">
                        <label className="artigoInputLabel">Imagem</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    setImagem(reader.result); // Salva a imagem em base64 no estado foto
                                };
                                if (file) {
                                    reader.readAsDataURL(file); // Lê o arquivo selecionado
                                }
                            }}
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

                    <div className="artigoInputGroup">
                        <label className="artigoInputLabel">Categoria</label>
                        <select value={id_categoria} required onChange={(e) => setCategoriaId(e.target.value)} className="artigoInputField">
                            <option value="">Selecione a categoria</option>
                            {categorias.filter(categoria => categoria.ativo).map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>{categoria.nome_categoria}</option>
                            ))}
                        </select>
                    </div>

                    <div className="inputGroup row centerButton">
                        <button type="submit" className="artigoButton btnInfo">{isEditing ? 'Atualizar' : 'Cadastrar'}</button>
                        <button onClick={closeModal} className="artigoButton btnError">Fechar</button>
                    </div>
                </form>
            </Modal>

            <div className="container">
                <div className="form3">
                    <button onClick={openModal} className="artigoButton btnSuccess">Criar Artigo</button>
                    <h2 className="artigoTitulo">Lista de Artigos</h2>
                    <div className="reminder-grid">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Titulo</th>
                                    <th>Descrição</th>
                                    <th>Id Categoria</th>
                                    <th>Status</th>
                                    <th className="artigoTh">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {artigos.map(artigo => (
                                    <tr key={artigo.id}>
                                        <td>{artigo.id}</td>
                                        <td>{artigo.titulo}</td>
                                        <td>{artigo.descricao}</td>
                                        <td>{artigo.id_categoria}</td>
                                        <td>{artigo.ativo ? 'Ativo' : 'Inativo'}</td>
                                        <td className="artigoTd">
                                            <button onClick={() => handleEdit(artigo)} className="artigoTableButton"><FontAwesomeIcon icon={faPencil} /></button>
                                            <button onClick={() => handleDelete(artigo.id)} className="artigoTableButton"><FontAwesomeIcon icon={faTrash} /></button>
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

export default Artigos;
