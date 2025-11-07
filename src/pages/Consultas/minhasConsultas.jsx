import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import axios from '../../service/api';
import Header from '../../components/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendar, 
  faClock, 
  faMapMarkerAlt, 
  faStethoscope, 
  faHospital,
  faCheckCircle,
  faTimesCircle,
  faClock as faClockPending,
  faPlus,
  faArrowsRotate
} from '@fortawesome/free-solid-svg-icons';
import './minhasConsultas.css';

const MinhasConsultas = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('TODAS'); // TODAS, PENDENTE, ACEITA, RECUSADA

  useEffect(() => {
    console.log('👤 Usuário atual:', user);
    fetchConsultas();
  }, [user]);

  const fetchConsultas = async () => {
    if (!user?.id) {
      console.error('❌ User ID não encontrado:', user);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Buscando consultas para paciente ID:', user.id);
      const response = await axios.get(`/api/v1/consultas/paciente/${user.id}`);
      console.log('✅ Consultas recebidas:', response.data);
      setConsultas(response.data);
    } catch (error) {
      console.error('❌ Erro ao buscar consultas:', error);
      console.error('Detalhes:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACEITA':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon aceita" />;
      case 'RECUSADA':
        return <FontAwesomeIcon icon={faTimesCircle} className="status-icon recusada" />;
      case 'PENDENTE':
        return <FontAwesomeIcon icon={faClockPending} className="status-icon pendente" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    return status.toLowerCase();
  };

  const consultasFiltradas = filtro === 'TODAS' 
    ? consultas 
    : consultas.filter(c => c.status === filtro);

  const contadores = {
    total: consultas.length,
    pendentes: consultas.filter(c => c.status === 'PENDENTE').length,
    aceitas: consultas.filter(c => c.status === 'ACEITA').length,
    recusadas: consultas.filter(c => c.status === 'RECUSADA').length
  };

  return (
    <div className="minhas-consultas-page">
      <div className="minhas-consultas-container">
        <div className="header-section">
          <h2>Minhas Consultas</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn-atualizar"
              onClick={fetchConsultas}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faArrowsRotate} spin={loading} /> Atualizar
            </button>
            <button 
              className="btn-nova-consulta"
              onClick={() => navigate('/solicitar-consulta')}
            >
              <FontAwesomeIcon icon={faPlus} /> Nova Consulta
            </button>
          </div>
        </div>

        <div className="stats-cards">
          <div className="stat-card total">
            <div className="stat-number">{contadores.total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card pendente">
            <div className="stat-number">{contadores.pendentes}</div>
            <div className="stat-label">Pendentes</div>
          </div>
          <div className="stat-card aceita">
            <div className="stat-number">{contadores.aceitas}</div>
            <div className="stat-label">Aceitas</div>
          </div>
          <div className="stat-card recusada">
            <div className="stat-number">{contadores.recusadas}</div>
            <div className="stat-label">Recusadas</div>
          </div>
        </div>

        <div className="filtros">
          <button 
            className={`filtro-btn ${filtro === 'TODAS' ? 'active' : ''}`}
            onClick={() => setFiltro('TODAS')}
          >
            Todas
          </button>
          <button 
            className={`filtro-btn ${filtro === 'PENDENTE' ? 'active' : ''}`}
            onClick={() => setFiltro('PENDENTE')}
          >
            Pendentes
          </button>
          <button 
            className={`filtro-btn ${filtro === 'ACEITA' ? 'active' : ''}`}
            onClick={() => setFiltro('ACEITA')}
          >
            Aceitas
          </button>
          <button 
            className={`filtro-btn ${filtro === 'RECUSADA' ? 'active' : ''}`}
            onClick={() => setFiltro('RECUSADA')}
          >
            Recusadas
          </button>
        </div>

        {loading ? (
          <div className="loading">Carregando consultas...</div>
        ) : consultasFiltradas.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma consulta encontrada.</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/solicitar-consulta')}
            >
              Solicitar primeira consulta
            </button>
          </div>
        ) : (
          <div className="consultas-grid">
            {consultasFiltradas.map(consulta => (
              <div key={consulta.id} className={`consulta-card ${getStatusClass(consulta.status)}`}>
                <div className="consulta-header">
                  <div className="consulta-status">
                    {getStatusIcon(consulta.status)}
                    <span>{consulta.status}</span>
                  </div>
                  <div className="consulta-id">#{consulta.id}</div>
                </div>

                <div className="consulta-info">
                  <div className="info-row">
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>{new Date(consulta.dataPreferencia).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="info-row">
                    <FontAwesomeIcon icon={faClock} />
                    <span>{consulta.horarioPreferencia}</span>
                  </div>
                  <div className="info-row">
                    <FontAwesomeIcon icon={faStethoscope} />
                    <span>{consulta.especialidade}</span>
                  </div>
                  {consulta.localPreferencia && (
                    <div className="info-row">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      <span>{consulta.localPreferencia}</span>
                    </div>
                  )}
                  {consulta.medicoNome && (
                    <div className="info-row">
                      <FontAwesomeIcon icon={faStethoscope} />
                      <span>Dr(a). {consulta.medicoNome}</span>
                    </div>
                  )}
                </div>

                {consulta.observacoes && (
                  <div className="consulta-observacoes">
                    <strong>Observações:</strong>
                    <p>{consulta.observacoes}</p>
                  </div>
                )}

                <div className="consulta-footer">
                  <small>Solicitado em: {new Date(consulta.dataCriacao).toLocaleDateString('pt-BR')}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MinhasConsultas;
