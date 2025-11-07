import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHospital, 
  faUserMd, 
  faUsers, 
  faCalendarCheck,
  faChartLine,
  faClipboardList,
  faCog,
  faShieldAlt,
  faBell,
  faExclamationTriangle,
  faCheckCircle,
  faHourglassHalf
} from '@fortawesome/free-solid-svg-icons';
import axios from '../../service/api';
import Header from '../../components/header';
import './adminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalHospitais: 0,
    totalMedicos: 0,
    totalPacientes: 0,
    totalConsultas: 0,
    consultasPendentes: 0,
    consultasAceitas: 0,
    consultasRecusadas: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se o usuário é admin
    console.log('🔍 Verificação Admin (Dashboard):', { user, tipo: user?.tipo });
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

    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Busca hospitais
      const hospitaisResponse = await axios.get('/api/v1/hospitais');
      const hospitais = hospitaisResponse.data;

      // Busca consultas
      const consultasResponse = await axios.get('/api/v1/consultas');
      const consultas = consultasResponse.data;

      // Calcula estatísticas
      setStats({
        totalHospitais: hospitais.length,
        totalMedicos: 0, // TODO: implementar endpoint
        totalPacientes: 0, // TODO: implementar endpoint
        totalConsultas: consultas.length,
        consultasPendentes: consultas.filter(c => c.status === 'PENDENTE').length,
        consultasAceitas: consultas.filter(c => c.status === 'ACEITA').length,
        consultasRecusadas: consultas.filter(c => c.status === 'RECUSADA').length
      });

      // Atividades recentes (últimas 5 consultas)
      const recent = consultas
        .sort((a, b) => new Date(b.dataSolicitacao) - new Date(a.dataSolicitacao))
        .slice(0, 5);
      setRecentActivity(recent);

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Gerenciar Hospitais',
      icon: faHospital,
      description: 'Cadastrar, editar e visualizar hospitais',
      color: '#667eea',
      path: '/admin/hospitais'
    },
    {
      title: 'Gerenciar Médicos',
      icon: faUserMd,
      description: 'Administrar cadastro de médicos',
      color: '#f093fb',
      path: '/admin/medicos'
    },
    {
      title: 'Gerenciar Pacientes',
      icon: faUsers,
      description: 'Visualizar e administrar pacientes',
      color: '#4facfe',
      path: '/admin/pacientes'
    },
    {
      title: 'Consultas',
      icon: faCalendarCheck,
      description: 'Visualizar todas as consultas do sistema',
      color: '#43e97b',
      path: '/admin/consultas'
    },
    {
      title: 'Relatórios',
      icon: faChartLine,
      description: 'Gerar relatórios e estatísticas',
      color: '#fa709a',
      path: '/admin/relatorios'
    },
    {
      title: 'Configurações',
      icon: faCog,
      description: 'Configurações do sistema',
      color: '#30cfd0',
      path: '/admin/configuracoes'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDENTE':
        return <FontAwesomeIcon icon={faHourglassHalf} className="status-icon pending" />;
      case 'ACEITA':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon accepted" />;
      case 'RECUSADA':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="status-icon rejected" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDENTE':
        return 'Pendente';
      case 'ACEITA':
        return 'Aceita';
      case 'RECUSADA':
        return 'Recusada';
      case 'CANCELADA':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <>
        <div className="admin-dashboard-page">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="admin-dashboard-page">
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-icon">
              <FontAwesomeIcon icon={faShieldAlt} />
            </div>
            <div className="header-text">
              <h1>Painel Administrativo</h1>
              <p>Bem-vindo, {user?.nome || 'Administrador'}</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-notifications">
              <FontAwesomeIcon icon={faBell} />
              <span className="notification-badge">3</span>
            </button>
          </div>
        </div>

        {/* Estatísticas Principais */}
        <div className="stats-grid">
          <div className="stat-card hospitals">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faHospital} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalHospitais}</h3>
              <p>Hospitais Cadastrados</p>
            </div>
          </div>

          <div className="stat-card doctors">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faUserMd} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalMedicos}</h3>
              <p>Médicos Ativos</p>
            </div>
          </div>

          <div className="stat-card patients">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalPacientes}</h3>
              <p>Pacientes Registrados</p>
            </div>
          </div>

          <div className="stat-card appointments">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faCalendarCheck} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalConsultas}</h3>
              <p>Total de Consultas</p>
            </div>
          </div>
        </div>

        {/* Estatísticas de Consultas */}
        <div className="consultation-stats">
          <h2>
            <FontAwesomeIcon icon={faClipboardList} />
            Status das Consultas
          </h2>
          <div className="consultation-cards">
            <div className="consultation-card pending">
              <FontAwesomeIcon icon={faHourglassHalf} />
              <h3>{stats.consultasPendentes}</h3>
              <p>Pendentes</p>
            </div>
            <div className="consultation-card accepted">
              <FontAwesomeIcon icon={faCheckCircle} />
              <h3>{stats.consultasAceitas}</h3>
              <p>Aceitas</p>
            </div>
            <div className="consultation-card rejected">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <h3>{stats.consultasRecusadas}</h3>
              <p>Recusadas</p>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="quick-actions-section">
          <h2>Ações Rápidas</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <div 
                key={index} 
                className="action-card"
                onClick={() => navigate(action.path)}
                style={{ '--card-color': action.color }}
              >
                <div className="action-icon" style={{ background: action.color }}>
                  <FontAwesomeIcon icon={action.icon} />
                </div>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="recent-activity-section">
          <h2>Atividades Recentes</h2>
          <div className="activity-list">
            {recentActivity.length === 0 ? (
              <div className="no-activity">
                <p>Nenhuma atividade recente</p>
              </div>
            ) : (
              recentActivity.map((consulta) => (
                <div key={consulta.id_consulta} className="activity-item">
                  <div className="activity-icon">
                    {getStatusIcon(consulta.status)}
                  </div>
                  <div className="activity-info">
                    <h4>Consulta #{consulta.id_consulta}</h4>
                    <p>
                      Especialidade: {consulta.especialidade || 'Não especificada'} • 
                      Status: <span className={`status-badge ${consulta.status.toLowerCase()}`}>
                        {getStatusLabel(consulta.status)}
                      </span>
                    </p>
                    <span className="activity-date">
                      {new Date(consulta.dataSolicitacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
