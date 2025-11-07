import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/header';
import '../../styles/consultas.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendar,
  faClock, 
  faMapMarkerAlt, 
  faStethoscope, 
  faUser,
  faCheck,
  faTimes,
  faEye,
  faNotesMedical
} from '@fortawesome/free-solid-svg-icons';
import './gerenciarConsultas.css';

const GerenciarConsultas = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    // Verifica se o usuário é hospital/admin
    console.log('🔍 Verificação Admin (Dashboard):', { user, tipo: user?.tipo });
    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }
    if (user.tipo !== 'ADMIN' && user.tipo !== 'HOSPITAL') {
      console.log('❌ Tipo não é ADMIN ou HOSPITAL:', user.tipo);
      alert('Acesso negado! Apenas administradores e hospitais podem acessar esta área.');
      navigate('/');
      return;
    }
    console.log('✅ Acesso permitido');

    fetchConsultasPendentes();
  }, [user, navigate]);

  const fetchConsultasPendentes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/consultas/pendentes');
      setConsultas(response.data);
    } catch (error) {
      console.error('Erro ao buscar consultas pendentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAceitarConsulta = async (consultaId) => {
    if (!window.confirm('Deseja realmente aceitar esta consulta?')) return;

    try {
      setProcessando(true);
      await axios.put(`/api/v1/consultas/${consultaId}/aceitar`, {
        hospitalId: user?.id // ID do hospital/usuário logado
      });
      
      alert('Consulta aceita com sucesso!');
      fetchConsultasPendentes(); // Recarrega a lista
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao aceitar consulta:', error);
      alert('Erro ao aceitar consulta. Tente novamente.');
    } finally {
      setProcessando(false);
    }
  };

  const handleRecusarConsulta = async (consultaId) => {
    if (!window.confirm('Deseja realmente recusar esta consulta?')) return;

    try {
      setProcessando(true);
      await axios.put(`/api/v1/consultas/${consultaId}/recusar`);
      
      alert('Consulta recusada.');
      fetchConsultasPendentes(); // Recarrega a lista
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao recusar consulta:', error);
      alert('Erro ao recusar consulta. Tente novamente.');
    } finally {
      setProcessando(false);
    }
  };

  const abrirDetalhes = (consulta) => {
    setConsultaSelecionada(consulta);
    setShowModal(true);
  };

  return (
    <div className="gerenciar-consultas-page">
      
      <div className="gerenciar-consultas-container">
        {/* Verificação de autorização */}
        {!user || user.tipo !== 'HOSPITAL' ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Verificando permissões...</p>
          </div>
        ) : (
          <>
            <div className="header-section">
              <h2>Gerenciar Consultas Pendentes</h2>
              <div className="contador">
                <span className="badge">{consultas.length}</span>
                <span>Consultas Aguardando</span>
              </div>
            </div>

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Carregando consultas...</p>
              </div>
            ) : consultas.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>Nenhuma consulta pendente</h3>
                <p>Não há solicitações de consulta aguardando aprovação no momento.</p>
              </div>
            ) : (
              <div className="consultas-table-container">
                <table className="consultas-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Paciente</th>
                      <th>Data</th>
                      <th>Horário</th>
                      <th>Especialidade</th>
                      <th>Local Preferido</th>
                      <th>Solicitado em</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consultas.map(consulta => (
                      <tr key={consulta.id}>
                        <td>#{consulta.id}</td>
                        <td>
                          <div className="paciente-info">
                            <FontAwesomeIcon icon={faUser} />
                            <span>{consulta.pacienteNome}</span>
                          </div>
                        </td>
                        <td>
                          <FontAwesomeIcon icon={faCalendar} />
                          {new Date(consulta.dataPreferencia).toLocaleDateString('pt-BR')}
                        </td>
                        <td>
                          <FontAwesomeIcon icon={faClock} />
                          {consulta.horarioPreferencia}
                        </td>
                        <td>
                          <span className="badge-especialidade">
                            {consulta.especialidade}
                          </span>
                        </td>
                        <td>
                          {consulta.localPreferencia ? (
                            <>
                              <FontAwesomeIcon icon={faMapMarkerAlt} />
                              {consulta.localPreferencia}
                            </>
                          ) : (
                            <span className="text-muted">Sem preferência</span>
                          )}
                        </td>
                        <td>
                          {new Date(consulta.dataCriacao).toLocaleDateString('pt-BR')}
                        </td>
                        <td>
                          <div className="acoes">
                            <button 
                              className="btn-acao visualizar"
                              onClick={() => abrirDetalhes(consulta)}
                              title="Ver detalhes"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button 
                              className="btn-acao aceitar"
                              onClick={() => handleAceitarConsulta(consulta.id)}
                              disabled={processando}
                              title="Aceitar consulta"
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                            <button 
                              className="btn-acao recusar"
                              onClick={() => handleRecusarConsulta(consulta.id)}
                              disabled={processando}
                              title="Recusar consulta"
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de Detalhes */}
      {showModal && consultaSelecionada && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalhes da Consulta #{consultaSelecionada.id}</h3>
              <button 
                className="btn-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detalhe-grupo">
                <label>
                  <FontAwesomeIcon icon={faUser} /> Paciente
                </label>
                <p>{consultaSelecionada.pacienteNome}</p>
              </div>

              <div className="detalhe-row">
                <div className="detalhe-grupo">
                  <label>
                    <FontAwesomeIcon icon={faCalendar} /> Data
                  </label>
                  <p>{new Date(consultaSelecionada.dataPreferencia).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="detalhe-grupo">
                  <label>
                    <FontAwesomeIcon icon={faClock} /> Horário
                  </label>
                  <p>{consultaSelecionada.horarioPreferencia}</p>
                </div>
              </div>

              <div className="detalhe-grupo">
                <label>
                  <FontAwesomeIcon icon={faStethoscope} /> Especialidade
                </label>
                <p>{consultaSelecionada.especialidade}</p>
              </div>

              {consultaSelecionada.medicoNome && (
                <div className="detalhe-grupo">
                  <label>
                    <FontAwesomeIcon icon={faStethoscope} /> Médico Solicitado
                  </label>
                  <p>Dr(a). {consultaSelecionada.medicoNome}</p>
                </div>
              )}

              {consultaSelecionada.localPreferencia && (
                <div className="detalhe-grupo">
                  <label>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> Local Preferido
                  </label>
                  <p>{consultaSelecionada.localPreferencia}</p>
                </div>
              )}

              {consultaSelecionada.observacoes && (
                <div className="detalhe-grupo">
                  <label>
                    <FontAwesomeIcon icon={faNotesMedical} /> Observações
                  </label>
                  <p className="observacoes">{consultaSelecionada.observacoes}</p>
                </div>
              )}

              <div className="detalhe-grupo">
                <label>Solicitado em</label>
                <p>{new Date(consultaSelecionada.dataCriacao).toLocaleString('pt-BR')}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-modal recusar"
                onClick={() => handleRecusarConsulta(consultaSelecionada.id)}
                disabled={processando}
              >
                <FontAwesomeIcon icon={faTimes} /> Recusar
              </button>
              <button 
                className="btn-modal aceitar"
                onClick={() => handleAceitarConsulta(consultaSelecionada.id)}
                disabled={processando}
              >
                <FontAwesomeIcon icon={faCheck} /> 
                {processando ? 'Processando...' : 'Aceitar Consulta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GerenciarConsultas;
