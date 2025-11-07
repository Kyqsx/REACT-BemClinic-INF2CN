import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import axios from '../../service/api';
import Header from '../../components/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHospital,
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faPhone,
  faEnvelope,
  faBuilding,
  faIdCard,
  faCheckCircle,
  faTimesCircle,
  faMagnifyingGlass,
  faKey
} from '@fortawesome/free-solid-svg-icons';
import './adminHospitais.css';

const AdminHospitais = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [hospitais, setHospitais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [hospitalSelecionado, setHospitalSelecionado] = useState(null);

  useEffect(() => {
    // Verifica se o usuário é admin
    console.log('🔍 Verificação Admin (Lista):', { user, tipo: user?.tipo });
    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }
    if (user.tipo !== 'ADMIN') {
      console.log('❌ Tipo não é ADMIN:', user.tipo);
      alert('Acesso negado! Apenas administradores podem acessar esta área.');
      navigate('/');
      return;
    }
    console.log('✅ Acesso permitido');

    fetchHospitais();
  }, [user, navigate]);

  const fetchHospitais = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/hospitais');
      setHospitais(response.data);
    } catch (error) {
      console.error('Erro ao buscar hospitais:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este hospital? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await axios.delete(`/api/v1/hospitais/${id}`);
      alert('Hospital excluído com sucesso!');
      fetchHospitais();
    } catch (error) {
      console.error('Erro ao excluir hospital:', error);
      alert('Erro ao excluir hospital. Tente novamente.');
    }
  };

  const abrirDetalhes = (hospital) => {
    setHospitalSelecionado(hospital);
    setShowModal(true);
  };

  const handleRedefinirSenha = async (hospitalId, hospitalNome) => {
    if (!window.confirm(`Deseja redefinir a senha do hospital "${hospitalNome}"?\n\nA senha será redefinida para o CNPJ sem pontuação.`)) {
      return;
    }

    try {
      const response = await axios.post(`/api/v1/hospitais/${hospitalId}/redefinir-senha`);
      alert(
        `✅ Senha redefinida com sucesso!\n\n` +
        `📧 E-mail: ${response.data.mensagem}\n` +
        `🔑 Senha temporária: ${response.data.senhaTemporaria}\n\n` +
        `${response.data.observacao}`
      );
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      alert('❌ Erro ao redefinir senha. Tente novamente.');
    }
  };

  const hospitaisFiltrados = hospitais.filter(h => 
    h.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    h.cnpj?.includes(filtro) ||
    h.tipoEstabelecimento?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="admin-hospitais-page">
      
      <div className="admin-hospitais-container">
        <div className="admin-header">
          <div className="header-left">
            <h2><FontAwesomeIcon icon={faHospital} /> Gerenciar Hospitais</h2>
            <p className="subtitle">Área administrativa - Cadastro e gestão de estabelecimentos</p>
          </div>
          <button 
            className="btn-novo-hospital"
            onClick={() => navigate('/admin/cadastrar-hospital')}
          >
            <FontAwesomeIcon icon={faPlus} /> Novo Hospital
          </button>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faHospital} />
            </div>
            <div className="stat-info">
              <span className="stat-number">{hospitais.length}</span>
              <span className="stat-label">Total de Hospitais</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon emergencia">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <div className="stat-info">
              <span className="stat-number">
                {hospitais.filter(h => h.atendimentoEmergencia).length}
              </span>
              <span className="stat-label">Com Emergência</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon leitos">
              <FontAwesomeIcon icon={faBuilding} />
            </div>
            <div className="stat-info">
              <span className="stat-number">
                {hospitais.reduce((acc, h) => acc + (h.numeroLeitos || 0), 0)}
              </span>
              <span className="stat-label">Total de Leitos</span>
            </div>
          </div>
        </div>

        <div className="filtro-section">
          <input
            type="text"
            placeholder="Buscar por nome, CNPJ ou tipo..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="filtro-input"
          />
        </div>

        {loading ? (
          <div className="loading-section">
            <div className="spinner"></div>
            <p>Carregando hospitais...</p>
          </div>
        ) : hospitaisFiltrados.length === 0 ? (
          <div className="empty-section">
            <FontAwesomeIcon icon={faHospital} size="4x" />
            <h3>Nenhum hospital encontrado</h3>
            <p>Comece cadastrando o primeiro hospital do sistema.</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/admin/cadastrar-hospital')}
            >
              <FontAwesomeIcon icon={faPlus} /> Cadastrar Primeiro Hospital
            </button>
          </div>
        ) : (
          <div className="hospitais-table-container">
            <table className="hospitais-table">
              <thead>
                <tr>
                  <th>Hospital</th>
                  <th>CNPJ</th>
                  <th>Tipo</th>
                  <th>Contato</th>
                  <th>Leitos</th>
                  <th>Emergência</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {hospitaisFiltrados.map(hospital => (
                  <tr key={hospital.id} className="hospital-row">
                    <td className="hospital-info-cell">
                      <div className="hospital-main-info">
                        <div className="hospital-icon">
                          <FontAwesomeIcon icon={faHospital} />
                        </div>
                        <div className="hospital-details">
                          <strong className="hospital-name">{hospital.nome}</strong>
                          {hospital.especialidades && (
                            <span className="hospital-especialidades">
                              {hospital.especialidades.length > 50 
                                ? hospital.especialidades.substring(0, 50) + '...'
                                : hospital.especialidades}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="cnpj-cell">{hospital.cnpj}</td>
                    <td className="tipo-cell">
                      {hospital.tipoEstabelecimento && (
                        <span className="badge tipo">
                          {hospital.tipoEstabelecimento}
                        </span>
                      )}
                    </td>
                    <td className="contato-cell">
                      {hospital.telefone && (
                        <div className="contato-info">
                          <FontAwesomeIcon icon={faPhone} />
                          <span>{hospital.telefone}</span>
                        </div>
                      )}
                      {hospital.email && (
                        <div className="contato-info">
                          <FontAwesomeIcon icon={faEnvelope} />
                          <span>{hospital.email.length > 25 
                            ? hospital.email.substring(0, 25) + '...'
                            : hospital.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="leitos-cell">
                      {hospital.numeroLeitos && (
                        <span className="leitos-badge">
                          <FontAwesomeIcon icon={faBuilding} />
                          {hospital.numeroLeitos}
                        </span>
                      )}
                    </td>
                    <td className="emergencia-cell">
                      {hospital.atendimentoEmergencia ? (
                        <span className="badge emergencia" title="Atendimento 24h">
                          🚨 24h
                        </span>
                      ) : (
                        <span className="badge sem-emergencia">
                          Não
                        </span>
                      )}
                    </td>
                    <td className="acoes-cell">
                      <div className="acoes-grupo">
                        <button 
                          className="btn-action visualizar"
                          onClick={() => abrirDetalhes(hospital)}
                          title="Ver detalhes"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button 
                          className="btn-action editar"
                          onClick={() => navigate(`/admin/editar-hospital/${hospital.id}`)}
                          title="Editar"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button 
                          className="btn-action reset-password"
                          onClick={() => handleRedefinirSenha(hospital.id, hospital.nome)}
                          title="Redefinir senha"
                        >
                          <FontAwesomeIcon icon={faKey} />
                        </button>
                        <button 
                          className="btn-action deletar"
                          onClick={() => handleDelete(hospital.id)}
                          title="Excluir"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {showModal && hospitalSelecionado && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <FontAwesomeIcon icon={faHospital} /> {hospitalSelecionado.nome}
              </h3>
              <button 
                className="btn-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detalhe-section">
                <h4>📋 Informações Básicas</h4>
                <div className="detalhe-grid">
                  <div className="detalhe-item">
                    <strong>Nome:</strong>
                    <span>{hospitalSelecionado.nome}</span>
                  </div>
                  <div className="detalhe-item">
                    <strong>CNPJ:</strong>
                    <span>{hospitalSelecionado.cnpj}</span>
                  </div>
                  <div className="detalhe-item">
                    <strong>Razão Social:</strong>
                    <span>{hospitalSelecionado.razaoSocial || 'Não informado'}</span>
                  </div>
                  <div className="detalhe-item">
                    <strong>CNES:</strong>
                    <span>{hospitalSelecionado.cnes || 'Não informado'}</span>
                  </div>
                </div>
              </div>

              <div className="detalhe-section">
                <h4>📞 Contato</h4>
                <div className="detalhe-grid">
                  <div className="detalhe-item">
                    <strong>Telefone:</strong>
                    <span>{hospitalSelecionado.telefone || 'Não informado'}</span>
                  </div>
                  <div className="detalhe-item">
                    <strong>E-mail:</strong>
                    <span>{hospitalSelecionado.email || 'Não informado'}</span>
                  </div>
                </div>
              </div>

              <div className="detalhe-section">
                <h4>🏥 Caracterização</h4>
                <div className="detalhe-grid">
                  <div className="detalhe-item">
                    <strong>Tipo:</strong>
                    <span>{hospitalSelecionado.tipoEstabelecimento || 'Não informado'}</span>
                  </div>
                  <div className="detalhe-item">
                    <strong>Leitos:</strong>
                    <span>{hospitalSelecionado.numeroLeitos || 'Não informado'}</span>
                  </div>
                  <div className="detalhe-item">
                    <strong>Horário:</strong>
                    <span>{hospitalSelecionado.horarioFuncionamento || 'Não informado'}</span>
                  </div>
                  <div className="detalhe-item">
                    <strong>Emergência 24h:</strong>
                    <span>
                      {hospitalSelecionado.atendimentoEmergencia ? (
                        <><FontAwesomeIcon icon={faCheckCircle} className="icon-green" /> Sim</>
                      ) : (
                        <><FontAwesomeIcon icon={faTimesCircle} className="icon-red" /> Não</>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {hospitalSelecionado.especialidades && (
                <div className="detalhe-section">
                  <h4>🩺 Especialidades</h4>
                  <p>{hospitalSelecionado.especialidades}</p>
                </div>
              )}

              {hospitalSelecionado.diretorResponsavel && (
                <div className="detalhe-section">
                  <h4>👨‍⚕️ Responsável</h4>
                  <p>{hospitalSelecionado.diretorResponsavel}</p>
                </div>
              )}

              {hospitalSelecionado.observacoes && (
                <div className="detalhe-section">
                  <h4>📝 Observações</h4>
                  <p>{hospitalSelecionado.observacoes}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Fechar
              </button>
              <button 
                className="btn-primary"
                onClick={() => {
                  setShowModal(false);
                  navigate(`/admin/editar-hospital/${hospitalSelecionado.id}`);
                }}
              >
                <FontAwesomeIcon icon={faEdit} /> Editar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHospitais;
