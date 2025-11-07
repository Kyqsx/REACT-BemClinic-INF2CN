import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHospital, 
  faIdCard, 
  faPhone, 
  faEnvelope, 
  faBuilding,
  faClock,
  faStethoscope,
  faBed,
  faUserMd,
  faFileAlt,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../../styles/perfil.css';

const CompletarPerfilHospital = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    razaoSocial: '',
    telefone: '',
    email: '',
    tipoEstabelecimento: '',
    especialidades: '',
    horarioFuncionamento: '',
    atendimentoEmergencia: false,
    numeroLeitos: '',
    diretorResponsavel: '',
    cnes: '',
    observacoes: '',
    idEndereco: null
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Buscar dados do hospital se já existir
    const fetchHospitalData = async () => {
      if (user?.id) {
        try {
          const response = await axios.get(`/api/v1/hospitais/${user.id}`);
          const hospital = response.data;
          
          setFormData({
            nome: hospital.nome || '',
            cnpj: formatarCNPJ(hospital.cnpj || ''),
            razaoSocial: hospital.razaoSocial || '',
            telefone: formatarTelefone(hospital.telefone || ''),
            email: hospital.email || '',
            tipoEstabelecimento: hospital.tipoEstabelecimento || '',
            especialidades: hospital.especialidades || '',
            horarioFuncionamento: hospital.horarioFuncionamento || '',
            atendimentoEmergencia: hospital.atendimentoEmergencia || false,
            numeroLeitos: hospital.numeroLeitos || '',
            diretorResponsavel: hospital.diretorResponsavel || '',
            cnes: hospital.cnes || '',
            observacoes: hospital.observacoes || '',
            idEndereco: hospital.endereco?.id_endereco || null
          });
        } catch (error) {
          console.log('Hospital ainda não cadastrado, criando novo perfil');
        }
      }
    };

    fetchHospitalData();
  }, [user]);

  const formatarCNPJ = (value) => {
    const numeros = value.replace(/\D/g, '');
    if (numeros.length <= 14) {
      if (numeros.length <= 2) return numeros;
      if (numeros.length <= 5) return `${numeros.slice(0, 2)}.${numeros.slice(2)}`;
      if (numeros.length <= 8) return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5)}`;
      if (numeros.length <= 12) return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8)}`;
      return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8, 12)}-${numeros.slice(12)}`;
    }
    return value.slice(0, -1);
  };

  const formatarTelefone = (value) => {
    const numeros = value.replace(/\D/g, '');
    if (numeros.length <= 11) {
      if (numeros.length <= 2) return numeros;
      if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    }
    return value.slice(0, -1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'cnpj') {
      setFormData(prev => ({ ...prev, [name]: formatarCNPJ(value) }));
    } else if (name === 'telefone') {
      setFormData(prev => ({ ...prev, [name]: formatarTelefone(value) }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validações
    if (!formData.nome || !formData.cnpj || !formData.razaoSocial || !formData.telefone) {
      setErrorMessage('Por favor, preencha os campos obrigatórios.');
      setShowError(true);
      setLoading(false);
      return;
    }

    try {
      const hospitalData = {
        nome: formData.nome,
        cnpj: formData.cnpj.replace(/\D/g, ''),
        razaoSocial: formData.razaoSocial,
        telefone: formData.telefone.replace(/\D/g, ''),
        email: formData.email || user?.email,
        tipoEstabelecimento: formData.tipoEstabelecimento,
        especialidades: formData.especialidades,
        horarioFuncionamento: formData.horarioFuncionamento,
        atendimentoEmergencia: formData.atendimentoEmergencia,
        numeroLeitos: formData.numeroLeitos ? parseInt(formData.numeroLeitos) : null,
        diretorResponsavel: formData.diretorResponsavel,
        cnes: formData.cnes,
        observacoes: formData.observacoes,
        endereco: formData.idEndereco ? { id_endereco: formData.idEndereco } : null
      };

      if (user?.id) {
        // Atualizar hospital existente
        await axios.put(`/api/v1/hospitais/${user.id}`, hospitalData);
      } else {
        // Criar novo hospital
        await axios.post('/api/v1/hospitais', hospitalData);
      }

      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Erro ao salvar perfil do hospital:', error);
      setErrorMessage(error.response?.data?.message || 'Erro ao salvar perfil. Tente novamente.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="completar-perfil-hospital-page">
      <div className="completar-perfil-hospital-container">
        <div className="completar-perfil-hospital-card">
          <div className="header-icon">
            <FontAwesomeIcon icon={faHospital} size="3x" />
          </div>
          <h2>Completar Perfil do Hospital</h2>
          <p className="subtitle">Preencha as informações do estabelecimento de saúde</p>

          <form onSubmit={handleSubmit} className="hospital-form">
            {/* Informações Básicas */}
            <div className="form-section">
              <h3>📋 Informações Básicas</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nome">
                    <FontAwesomeIcon icon={faHospital} /> Nome do Estabelecimento *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    placeholder="Ex: Hospital Central"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cnpj">
                    <FontAwesomeIcon icon={faIdCard} /> CNPJ *
                  </label>
                  <input
                    type="text"
                    id="cnpj"
                    name="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={formData.cnpj}
                    onChange={handleChange}
                    maxLength="18"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="razaoSocial">
                    <FontAwesomeIcon icon={faBuilding} /> Razão Social *
                  </label>
                  <input
                    type="text"
                    id="razaoSocial"
                    name="razaoSocial"
                    placeholder="Razão Social da Empresa"
                    value={formData.razaoSocial}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cnes">
                    <FontAwesomeIcon icon={faFileAlt} /> CNES
                  </label>
                  <input
                    type="text"
                    id="cnes"
                    name="cnes"
                    placeholder="Cadastro Nacional"
                    value={formData.cnes}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Contato */}
            <div className="form-section">
              <h3>📞 Contato</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="telefone">
                    <FontAwesomeIcon icon={faPhone} /> Telefone *
                  </label>
                  <input
                    type="text"
                    id="telefone"
                    name="telefone"
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <FontAwesomeIcon icon={faEnvelope} /> E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="contato@hospital.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Caracterização */}
            <div className="form-section">
              <h3>🏥 Caracterização</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tipoEstabelecimento">
                    <FontAwesomeIcon icon={faBuilding} /> Tipo de Estabelecimento
                  </label>
                  <select
                    id="tipoEstabelecimento"
                    name="tipoEstabelecimento"
                    value={formData.tipoEstabelecimento}
                    onChange={handleChange}
                  >
                    <option value="">Selecione</option>
                    <option value="Hospital">Hospital</option>
                    <option value="Clínica">Clínica</option>
                    <option value="UPA">UPA - Unidade de Pronto Atendimento</option>
                    <option value="Posto de Saúde">Posto de Saúde</option>
                    <option value="Maternidade">Maternidade</option>
                    <option value="Laboratório">Laboratório</option>
                    <option value="Centro Especializado">Centro Especializado</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="numeroLeitos">
                    <FontAwesomeIcon icon={faBed} /> Número de Leitos
                  </label>
                  <input
                    type="number"
                    id="numeroLeitos"
                    name="numeroLeitos"
                    placeholder="Ex: 100"
                    value={formData.numeroLeitos}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="especialidades">
                  <FontAwesomeIcon icon={faStethoscope} /> Especialidades Atendidas
                </label>
                <input
                  type="text"
                  id="especialidades"
                  name="especialidades"
                  placeholder="Ex: Cardiologia, Pediatria, Ortopedia..."
                  value={formData.especialidades}
                  onChange={handleChange}
                />
                <small>Separe por vírgula</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="horarioFuncionamento">
                    <FontAwesomeIcon icon={faClock} /> Horário de Funcionamento
                  </label>
                  <input
                    type="text"
                    id="horarioFuncionamento"
                    name="horarioFuncionamento"
                    placeholder="Ex: 24 horas, 8h às 18h"
                    value={formData.horarioFuncionamento}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="atendimentoEmergencia"
                      checked={formData.atendimentoEmergencia}
                      onChange={handleChange}
                    />
                    🚨 Atendimento de Emergência 24h
                  </label>
                </div>
              </div>
            </div>

            {/* Responsável */}
            <div className="form-section">
              <h3>👨‍⚕️ Responsável</h3>
              
              <div className="form-group">
                <label htmlFor="diretorResponsavel">
                  <FontAwesomeIcon icon={faUserMd} /> Diretor Responsável
                </label>
                <input
                  type="text"
                  id="diretorResponsavel"
                  name="diretorResponsavel"
                  placeholder="Nome do diretor ou responsável técnico"
                  value={formData.diretorResponsavel}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Observações */}
            <div className="form-section">
              <h3>📝 Observações Adicionais</h3>
              
              <div className="form-group">
                <label htmlFor="observacoes">
                  <FontAwesomeIcon icon={faFileAlt} /> Observações
                </label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  placeholder="Informações adicionais sobre o estabelecimento..."
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => navigate('/')}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Perfil'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccess && (
        <div className="popup success">
          <div className="popup-content">
            <h3>✓ Sucesso!</h3>
            <p>Perfil do hospital salvo com sucesso!</p>
            <button onClick={() => setShowSuccess(false)}>Fechar</button>
          </div>
        </div>
      )}

      {showError && (
        <div className="popup error">
          <div className="popup-content">
            <h3>✗ Erro</h3>
            <p>{errorMessage}</p>
            <button onClick={() => setShowError(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletarPerfilHospital;
