import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/outras.css';
import { 
  faHospital, 
  faBed,
  faUserMd,
  faCalendarCheck,
  faClipboardList,
  faHourglassHalf,
  faCheckCircle,
  faTimesCircle,
  faStethoscope,
  faClock,
  faExclamationTriangle,
  faChartLine,
  faUsers,
  faNotesMedical
} from '@fortawesome/free-solid-svg-icons';
import axios from '../../service/api';
import Header from '../../components/header';
import './dashboardHospital.css';

const DashboardHospital = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [hospitalData, setHospitalData] = useState(null);
  const [consultasPendentes, setConsultasPendentes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [showMedicoModal, setShowMedicoModal] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const [medicoSelecionado, setMedicoSelecionado] = useState('');
  const [stats, setStats] = useState({
    totalLeitos: 0,
    leitosOcupados: 0,
    leitosDisponiveis: 0,
    totalMedicos: 0,
    consultasPendentes: 0,
    consultasAceitas: 0,
    consultasHoje: 0
  });

  useEffect(() => {
    console.log('🔍 Verificação Hospital:', { user, tipo: user?.tipo });
    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }
    if (user.tipo !== 'HOSPITAL') {
      console.log('❌ Tipo não é HOSPITAL:', user.tipo);
      alert('Acesso negado! Apenas hospitais podem acessar esta área.');
      navigate('/');
      return;
    }
    console.log('✅ Acesso permitido');

    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Busca dados do hospital pelo e-mail do usuário
      const hospitalResponse = await axios.get(`/api/v1/hospitais/email/${user.email}`);
      const hospital = hospitalResponse.data;
      setHospitalData(hospital);

      // Busca consultas pendentes para o hospital
      const consultasResponse = await axios.get('/api/v1/consultas/pendentes');
      const todasPendentes = consultasResponse.data;
      setConsultasPendentes(todasPendentes.slice(0, 5)); // Apenas as 5 primeiras

      // Busca todas as consultas aceitas pelo hospital
      const consultasAceitasResponse = await axios.get(`/api/v1/consultas/hospital/${hospital.id}`);
      const consultasAceitas = consultasAceitasResponse.data || [];

      // Busca médicos do hospital
      try {
        const medicosResponse = await axios.get(`/api/v1/medicos/hospital/${hospital.id}`);
        setMedicos(medicosResponse.data || []);
      } catch (error) {
        console.log('Erro ao buscar médicos:', error);
        setMedicos([]);
      }

      // Calcula estatísticas
      const totalLeitos = hospital.numeroLeitos || 0;
      const leitosOcupados = Math.floor(totalLeitos * 0.7); // Mock - 70% ocupação
      const consultasHoje = consultasAceitas.filter(c => {
        const hoje = new Date().toDateString();
        const dataConsulta = new Date(c.dataPreferencia).toDateString();
        return dataConsulta === hoje;
      }).length;

      setStats({
        totalLeitos,
        leitosOcupados,
        leitosDisponiveis: totalLeitos - leitosOcupados,
        totalMedicos: medicosResponse.data?.length || 0,
        consultasPendentes: todasPendentes.length,
        consultasAceitas: consultasAceitas.length,
        consultasHoje
      });

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      if (error.response?.status === 404) {
        alert('Hospital não encontrado. Entre em contato com o administrador.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAceitarConsulta = async (consultaId) => {
    if (medicos.length === 0) {
      alert('❌ É necessário ter médicos cadastrados para aceitar consultas.');
      return;
    }

    const consulta = consultasPendentes.find(c => c.id === consultaId);
    setConsultaSelecionada(consulta);
    setMedicoSelecionado('');
    setShowMedicoModal(true);
  };

  const confirmarAceitarConsulta = async () => {
    if (!medicoSelecionado) {
      alert('❌ Selecione um médico para a consulta.');
      return;
    }

    if (!window.confirm('Deseja aceitar esta consulta e designar o médico selecionado?')) {
      return;
    }

    try {
      await axios.put(`/api/v1/consultas/${consultaSelecionada.id}/aceitar`, {
        hospitalId: hospitalData.id,
        medicoId: medicoSelecionado
      });
      alert('✅ Consulta aceita e médico designado com sucesso!');
      setShowMedicoModal(false);
      setConsultaSelecionada(null);
      setMedicoSelecionado('');
      fetchDashboardData(); // Recarrega dados
    } catch (error) {
      console.error('Erro ao aceitar consulta:', error);
      alert('❌ Erro ao aceitar consulta. Tente novamente.');
    }
  };

  const handleRecusarConsulta = async (consultaId) => {
    if (!window.confirm('Deseja recusar esta consulta?')) {
      return;
    }

    try {
      await axios.put(`/api/v1/consultas/${consultaId}/recusar`);
      alert('Consulta recusada.');
      fetchDashboardData(); // Recarrega dados
    } catch (error) {
      console.error('Erro ao recusar consulta:', error);
      alert('❌ Erro ao recusar consulta. Tente novamente.');
    }
  };

  const getOcupacaoClass = (percentual) => {
    if (percentual >= 90) return 'critico';
    if (percentual >= 70) return 'alerta';
    return 'normal';
  };

  if (loading) {
    return (
      <>
        
        <div className="dashboard-hospital-page">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  if (!hospitalData) {
    return (
      <>
        
        <div className="dashboard-hospital-page">
          <div className="error-container">
            <FontAwesomeIcon icon={faExclamationTriangle} size="3x" />
            <h2>Hospital não encontrado</h2>
            <p>Não foi possível carregar os dados do hospital.</p>
          </div>
        </div>
      </>
    );
  }

  const ocupacaoPercentual = stats.totalLeitos > 0 
    ? Math.round((stats.leitosOcupados / stats.totalLeitos) * 100) 
    : 0;

  return (
    <>
      
      <div className="dashboard-hospital-page">
        <div className="dashboard-header">
          <div className="hospital-info">
            <div className="hospital-icon">
              <FontAwesomeIcon icon={faHospital} />
            </div>
            <div className="hospital-text">
              <h1>{hospitalData.nome}</h1>
              <p className="hospital-type">{hospitalData.tipoEstabelecimento || 'Hospital'}</p>
              <p className="hospital-specialties">
                {hospitalData.especialidades || 'Especialidades não informadas'}
              </p>
            </div>
          </div>
          {hospitalData.atendimentoEmergencia && (
            <div className="emergency-badge">
              <FontAwesomeIcon icon={faNotesMedical} />
              Pronto Socorro 24h
            </div>
          )}
        </div>

        {/* Estatísticas Principais */}
        <div className="stats-grid">
          <div className="stat-card leitos">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faBed} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalLeitos}</h3>
              <p>Total de Leitos</p>
              <div className="stat-details">
                <span className="occupied">{stats.leitosOcupados} ocupados</span>
                <span className="available">{stats.leitosDisponiveis} disponíveis</span>
              </div>
            </div>
          </div>

          <div className={`stat-card ocupacao ${getOcupacaoClass(ocupacaoPercentual)}`}>
            <div className="stat-icon">
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <div className="stat-info">
              <h3>{ocupacaoPercentual}%</h3>
              <p>Taxa de Ocupação</p>
              <div className="ocupacao-bar">
                <div 
                  className="ocupacao-progress" 
                  style={{ width: `${ocupacaoPercentual}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card medicos">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faUserMd} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalMedicos}</h3>
              <p>Médicos Cadastrados</p>
              <button 
                className="stat-link"
                onClick={() => navigate('/hospital/medicos')}
              >
                Ver médicos →
              </button>
            </div>
          </div>

          <div className="stat-card consultas-hoje">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faCalendarCheck} />
            </div>
            <div className="stat-info">
              <h3>{stats.consultasHoje}</h3>
              <p>Consultas Hoje</p>
              <button 
                className="stat-link"
                onClick={() => navigate('/gerenciar-consultas')}
              >
                Ver todas →
              </button>
            </div>
          </div>
        </div>

        {/* Resumo de Consultas */}
        <div className="consultas-summary">
          <h2>
            <FontAwesomeIcon icon={faClipboardList} />
            Status de Consultas
          </h2>
          <div className="summary-cards">
            <div className="summary-card pendentes">
              <FontAwesomeIcon icon={faHourglassHalf} />
              <div className="summary-info">
                <h3>{stats.consultasPendentes}</h3>
                <p>Aguardando Confirmação</p>
              </div>
            </div>
            <div className="summary-card aceitas">
              <FontAwesomeIcon icon={faCheckCircle} />
              <div className="summary-info">
                <h3>{stats.consultasAceitas}</h3>
                <p>Confirmadas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Consultas Pendentes */}
        <div className="consultas-pendentes-section">
          <div className="section-header">
            <h2>
              <FontAwesomeIcon icon={faHourglassHalf} />
              Consultas Aguardando Confirmação
            </h2>
            <button 
              className="btn-ver-todas"
              onClick={() => navigate('/gerenciar-consultas')}
            >
              Ver todas ({stats.consultasPendentes})
            </button>
          </div>

          {consultasPendentes.length === 0 ? (
            <div className="no-consultas">
              <FontAwesomeIcon icon={faCheckCircle} size="3x" />
              <p>Nenhuma consulta pendente no momento</p>
            </div>
          ) : (
            <div className="consultas-list">
              {consultasPendentes.map((consulta) => (
                <div key={consulta.id} className="consulta-card">
                  <div className="consulta-header">
                    <div className="consulta-id">
                      Consulta #{consulta.id}
                    </div>
                    <div className="consulta-date">
                      <FontAwesomeIcon icon={faClock} />
                      {new Date(consulta.dataCriacao).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  <div className="consulta-body">
                    <div className="consulta-info">
                      <div className="info-item">
                        <FontAwesomeIcon icon={faStethoscope} />
                        <span>
                          <strong>Especialidade:</strong> {consulta.especialidade || 'Não especificada'}
                        </span>
                      </div>
                      <div className="info-item">
                        <FontAwesomeIcon icon={faCalendarCheck} />
                        <span>
                          <strong>Data preferida:</strong>{' '}
                          {consulta.dataPreferencia 
                            ? new Date(consulta.dataPreferencia).toLocaleDateString('pt-BR')
                            : 'Não informada'}
                        </span>
                      </div>
                      {consulta.horarioPreferencia && (
                        <div className="info-item">
                          <FontAwesomeIcon icon={faClock} />
                          <span>
                            <strong>Horário:</strong> {consulta.horarioPreferencia}
                          </span>
                        </div>
                      )}
                      {consulta.observacoes && (
                        <div className="info-item observacoes">
                          <strong>Observações:</strong>
                          <p>{consulta.observacoes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="consulta-actions">
                    <button 
                      className="btn-aceitar"
                      onClick={() => handleAceitarConsulta(consulta.id)}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} />
                      Aceitar
                    </button>
                    <button 
                      className="btn-recusar"
                      onClick={() => handleRecusarConsulta(consulta.id)}
                    >
                      <FontAwesomeIcon icon={faTimesCircle} />
                      Recusar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ações Rápidas */}
        <div className="quick-actions">
          <h2>Ações Rápidas</h2>
          <div className="actions-grid">
            <div 
              className="action-card"
              onClick={() => navigate('/gerenciar-consultas')}
            >
              <FontAwesomeIcon icon={faClipboardList} />
              <h3>Gerenciar Consultas</h3>
              <p>Ver e gerenciar todas as solicitações</p>
            </div>
            <div 
              className="action-card"
              onClick={() => navigate('/hospital/medicos')}
            >
              <FontAwesomeIcon icon={faUserMd} />
              <h3>Equipe Médica</h3>
              <p>Visualizar e gerenciar médicos</p>
            </div>
            <div 
              className="action-card"
              onClick={() => navigate('/hospital/leitos')}
            >
              <FontAwesomeIcon icon={faBed} />
              <h3>Gerenciar Leitos</h3>
              <p>Controlar disponibilidade de leitos</p>
            </div>
            <div 
              className="action-card"
              onClick={() => navigate('/hospital/recursos')}
            >
              <FontAwesomeIcon icon={faHospital} />
              <h3>Recursos</h3>
              <p>Equipamentos e infraestrutura</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Seleção de Médico */}
      {showMedicoModal && consultaSelecionada && (
        <div className="modal-overlay" onClick={() => setShowMedicoModal(false)}>
          <div className="modal-content medico-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <FontAwesomeIcon icon={faUserMd} />
                Designar Médico para Consulta
              </h3>
              <button 
                className="btn-close"
                onClick={() => setShowMedicoModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="consulta-info-modal">
                <h4>📋 Detalhes da Consulta</h4>
                <div className="consulta-details">
                  <p><strong>ID:</strong> #{consultaSelecionada.id}</p>
                  <p><strong>Especialidade:</strong> {consultaSelecionada.especialidade || 'Não especificada'}</p>
                  <p><strong>Data preferida:</strong> {
                    consultaSelecionada.dataPreferencia 
                      ? new Date(consultaSelecionada.dataPreferencia).toLocaleDateString('pt-BR')
                      : 'Não informada'
                  }</p>
                  {consultaSelecionada.horarioPreferencia && (
                    <p><strong>Horário:</strong> {consultaSelecionada.horarioPreferencia}</p>
                  )}
                  {consultaSelecionada.observacoes && (
                    <p><strong>Observações:</strong> {consultaSelecionada.observacoes}</p>
                  )}
                </div>
              </div>

              <div className="medico-selection">
                <h4>👨‍⚕️ Selecionar Médico</h4>
                <div className="medicos-grid">
                  {medicos.map((medico) => (
                    <div 
                      key={medico.id} 
                      className={`medico-card ${medicoSelecionado === medico.id ? 'selected' : ''}`}
                      onClick={() => setMedicoSelecionado(medico.id)}
                    >
                      <div className="medico-info">
                        <h5>{medico.nome}</h5>
                        <p className="medico-especialidade">{medico.especialidade || 'Clínico Geral'}</p>
                        <p className="medico-crm">CRM: {medico.crm}</p>
                      </div>
                      <div className="medico-radio">
                        <input 
                          type="radio" 
                          name="medico" 
                          value={medico.id}
                          checked={medicoSelecionado === medico.id}
                          onChange={() => setMedicoSelecionado(medico.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {medicos.length === 0 && (
                  <div className="no-medicos">
                    <p>❌ Nenhum médico cadastrado. Cadastre médicos antes de aceitar consultas.</p>
                    <button 
                      className="btn-cadastrar-medico"
                      onClick={() => {
                        setShowMedicoModal(false);
                        navigate('/hospital/medicos');
                      }}
                    >
                      Cadastrar Médicos
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowMedicoModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-primary"
                onClick={confirmarAceitarConsulta}
                disabled={!medicoSelecionado}
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                Aceitar Consulta
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardHospital;
