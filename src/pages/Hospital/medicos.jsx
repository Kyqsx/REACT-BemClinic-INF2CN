import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faPhone, 
  faIdCard, 
  faFileAlt, 
  faTrash, 
  faPencil, 
  faUserMd,
  faHospital,
  faStethoscope,
  faPlus,
  faEye,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/header';
import axios from '../../service/api';
import '../../styles/medicos-hospital.css';

const MedicosHospital = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [medicos, setMedicos] = useState([]);
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se o usuário é hospital
    console.log('🔍 Verificação Hospital (Médicos):', { user, tipo: user?.tipo });
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

    fetchHospitalAndMedicos();
  }, [user, navigate]);

  const fetchHospitalAndMedicos = async () => {
    try {
      setLoading(true);
      
      // Busca dados do hospital pelo e-mail do usuário
      const hospitalResponse = await axios.get(`/api/v1/hospitais/email/${user.email}`);
      const hospital = hospitalResponse.data;
      setHospitalData(hospital);

      // Busca médicos do hospital
      const medicosResponse = await axios.get(`/api/v1/medicos/hospital/${hospital.id}`);
      setMedicos(medicosResponse.data || []);
      
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      if (error.response?.status === 404) {
        alert('Hospital não encontrado. Entre em contato com o administrador.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este médico? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await axios.delete(`/api/v1/medicos/${id}`);
      alert('✅ Médico excluído com sucesso!');
      fetchHospitalAndMedicos(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao deletar médico:', error);
      alert('❌ Erro ao excluir médico. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="medicos-hospital-page">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando médicos...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="medicos-hospital-page">
        <div className="medicos-header">
          <div className="header-info">
            <h1>
              <FontAwesomeIcon icon={faUserMd} />
              Equipe Médica
            </h1>
            <p className="subtitle">Gerencie os médicos do seu hospital</p>
          </div>
          
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{medicos.length}</span>
              <span className="stat-label">Médicos Cadastrados</span>
            </div>
          </div>
        </div>

        <div className="medicos-actions">
          <button 
            className="btn-novo-medico"
            onClick={() => navigate('/hospital/medicos/cadastrar')}
          >
            <FontAwesomeIcon icon={faPlus} />
            Cadastrar Novo Médico
          </button>
        </div>

        {medicos.length === 0 ? (
          <div className="empty-state">
            <FontAwesomeIcon icon={faUserMd} size="4x" />
            <h3>Nenhum médico cadastrado</h3>
            <p>Comece cadastrando o primeiro médico do seu hospital.</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/hospital/medicos/cadastrar')}
            >
              <FontAwesomeIcon icon={faPlus} />
              Cadastrar Primeiro Médico
            </button>
          </div>
        ) : (
          <div className="medicos-table-container">
            <table className="medicos-table">
              <thead>
                <tr>
                  <th>Médico</th>
                  <th>CRM</th>
                  <th>Especialidade</th>
                  <th>Contato</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {medicos.map((medico) => (
                  <tr key={medico.id} className="medico-row">
                    <td className="medico-info-cell">
                      <div className="medico-main-info">
                        <div className="medico-icon">
                          <FontAwesomeIcon icon={faUserMd} />
                        </div>
                        <div className="medico-details">
                          <strong className="medico-name">{medico.nome}</strong>
                          <span className="medico-id">ID: {medico.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="crm-cell">{medico.crm}</td>
                    <td className="especialidade-cell">
                      <span className="badge especialidade">
                        {medico.especialidade || 'Clínico Geral'}
                      </span>
                    </td>
                    <td className="contato-cell">
                      {medico.telefone && (
                        <div className="contato-info">
                          <FontAwesomeIcon icon={faPhone} />
                          <span>{medico.telefone}</span>
                        </div>
                      )}
                      {medico.email && (
                        <div className="contato-info">
                          <FontAwesomeIcon icon={faEnvelope} />
                          <span>{medico.email.length > 25 
                            ? medico.email.substring(0, 25) + '...'
                            : medico.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="acoes-cell">
                      <div className="acoes-grupo">
                        <button 
                          className="btn-action visualizar"
                          title="Ver detalhes"
                          onClick={() => navigate(`/hospital/medicos/${medico.id}`)}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button 
                          className="btn-action editar"
                          title="Editar"
                          onClick={() => navigate(`/hospital/medicos/editar/${medico.id}`)}
                        >
                          <FontAwesomeIcon icon={faPencil} />
                        </button>
                        <button 
                          className="btn-action deletar"
                          title="Excluir"
                          onClick={() => handleDelete(medico.id)}
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
    </>
  );
};

export default MedicosHospital;