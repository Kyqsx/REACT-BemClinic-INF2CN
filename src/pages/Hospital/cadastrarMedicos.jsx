import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faIdCard, 
  faGraduationCap, 
  faStethoscope,
  faHospital,
  faUserMd,
  faSave,
  faArrowLeft,
  faMapMarkerAlt,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/header';
import axios from '../../service/api';
import '../../styles/cadastrarmedicos-hospital.css';

const CadastrarMedicosHospital = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    rg: '',
    email: '',
    telefone: '',
    crm: '',
    especialidade: '',
    dataFormatura: '',
    hospital: null
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Verifica se o usuário é hospital
    console.log('🔍 Verificação Hospital (Cadastrar Médicos):', { user, tipo: user?.tipo });
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

    fetchHospitalData();
  }, [user, navigate]);

  const fetchHospitalData = async () => {
    try {
      setLoading(true);
      
      // Busca dados do hospital pelo e-mail do usuário
      const hospitalResponse = await axios.get(`/api/v1/hospitais/email/${user.email}`);
      const hospital = hospitalResponse.data;
      setHospitalData(hospital);
      
      // Define o hospital no form
      setFormData(prev => ({
        ...prev,
        hospital: hospital
      }));
      
    } catch (error) {
      console.error('Erro ao buscar dados do hospital:', error);
      if (error.response?.status === 404) {
        alert('Hospital não encontrado. Entre em contato com o administrador.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpa o erro quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validações obrigatórias
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
    if (!formData.rg.trim()) newErrors.rg = 'RG é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    if (!formData.crm.trim()) newErrors.crm = 'CRM é obrigatório';
    if (!formData.especialidade.trim()) newErrors.especialidade = 'Especialidade é obrigatória';

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validação de CPF (formato básico)
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (formData.cpf && !cpfRegex.test(formData.cpf)) {
      newErrors.cpf = 'CPF deve estar no formato XXX.XXX.XXX-XX';
    }

    // Validação de telefone
    const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (formData.telefone && !telefoneRegex.test(formData.telefone)) {
      newErrors.telefone = 'Telefone deve estar no formato (XX) XXXXX-XXXX';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('❌ Por favor, corrija os erros no formulário.');
      return;
    }

    try {
      setSaving(true);
      
      // Prepara os dados para envio (com ID do hospital e RG como senha)
      // Remove pontos e caracteres especiais do RG, CPF e telefone para envio ao banco
      const rgSemPontos = formData.rg.replace(/\D/g, '');
      const cpfSemPontos = formData.cpf.replace(/\D/g, '');
      const telefoneSemPontos = formData.telefone.replace(/\D/g, '');
      
      const medicoData = {
        nome: formData.nome,
        cpf: cpfSemPontos, // CPF apenas com números
        rg: rgSemPontos, // RG apenas com números
        email: formData.email,
        telefone: telefoneSemPontos, // Telefone apenas com números
        senha: rgSemPontos, // RG sem pontos como senha temporária
        crm: formData.crm,
        especialidade: formData.especialidade,
        dataFormatura: formData.dataFormatura || null,
        hospitalId: hospitalData.id
      };
      
      console.log('Enviando dados do médico:', medicoData);
      
      await axios.post('/api/v1/medicos', medicoData);
      
      alert(`✅ Médico cadastrado com sucesso! A senha temporária é: ${rgSemPontos} (RG apenas com números)`);
      navigate('/hospital/medicos');
      
    } catch (error) {
      console.error('Erro ao cadastrar médico:', error);
      
      if (error.response?.status === 400) {
        alert('❌ Dados inválidos. Verifique as informações e tente novamente.');
      } else if (error.response?.status === 409) {
        alert('❌ Já existe um médico cadastrado com este CRM ou email.');
      } else {
        alert('❌ Erro ao cadastrar médico. Tente novamente.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Máscaras para os campos
  const formatCPF = (value) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatTelefone = (value) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formatted }));
  };

  const handleTelefoneChange = (e) => {
    const formatted = formatTelefone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formatted }));
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="cadastrar-medicos-hospital-page">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando dados do hospital...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="cadastrar-medicos-hospital-page">
        <div className="form-container">
          <div className="form-header">
            <div className="hospital-info">
              <div className="hospital-badge">
                <FontAwesomeIcon icon={faHospital} />
                {hospitalData?.nome || 'Hospital'}
              </div>
              <button 
                className="btn-voltar"
                onClick={() => navigate('/hospital/medicos')}
                type="button"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Voltar à Lista
              </button>
            </div>
            
            <h1 className="form-title">
              <FontAwesomeIcon icon={faUserMd} />
              Cadastrar Novo Médico
            </h1>
            <p className="form-subtitle">
              Adicione um novo médico à equipe do seu hospital
            </p>
            <div className="info-box">
              <p>
                <strong>📋 Informação importante:</strong> A senha de acesso será gerada automaticamente usando o RG do médico (apenas números, sem pontos) como senha temporária. 
                Os dados CPF, RG e telefone serão armazenados apenas com números, sem formatação.
                O médico poderá alterar a senha após o primeiro acesso.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="medico-form">
            <div className="form-section">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faUser} />
                Informações Pessoais
              </h3>
              
              <div className="form-grid">
                <div className="input-group">
                  <label className="input-label required">Nome Completo</label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon icon={faUser} className="input-icon" />
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className={`form-input ${errors.nome ? 'error' : ''}`}
                      placeholder="Digite o nome completo do médico"
                    />
                  </div>
                  {errors.nome && <span className="error-message">{errors.nome}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label required">CPF</label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon icon={faIdCard} className="input-icon" />
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleCPFChange}
                      className={`form-input ${errors.cpf ? 'error' : ''}`}
                      placeholder="000.000.000-00"
                      maxLength="14"
                    />
                  </div>
                  {errors.cpf && <span className="error-message">{errors.cpf}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label required">RG</label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon icon={faIdCard} className="input-icon" />
                    <input
                      type="text"
                      name="rg"
                      value={formData.rg}
                      onChange={handleChange}
                      className={`form-input ${errors.rg ? 'error' : ''}`}
                      placeholder="Digite o RG"
                    />
                  </div>
                  {errors.rg && <span className="error-message">{errors.rg}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label required">Email</label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="medico@email.com"
                    />
                  </div>
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label required">Telefone</label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon icon={faPhone} className="input-icon" />
                    <input
                      type="text"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleTelefoneChange}
                      className={`form-input ${errors.telefone ? 'error' : ''}`}
                      placeholder="(00) 00000-0000"
                      maxLength="15"
                    />
                  </div>
                  {errors.telefone && <span className="error-message">{errors.telefone}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faStethoscope} />
                Informações Profissionais
              </h3>
              
              <div className="form-grid">
                <div className="input-group">
                  <label className="input-label required">CRM</label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon icon={faIdCard} className="input-icon" />
                    <input
                      type="text"
                      name="crm"
                      value={formData.crm}
                      onChange={handleChange}
                      className={`form-input ${errors.crm ? 'error' : ''}`}
                      placeholder="Ex: CRM/SP 123456"
                    />
                  </div>
                  {errors.crm && <span className="error-message">{errors.crm}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label required">Especialidade</label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon icon={faStethoscope} className="input-icon" />
                    <select
                      name="especialidade"
                      value={formData.especialidade}
                      onChange={handleChange}
                      className={`form-input ${errors.especialidade ? 'error' : ''}`}
                    >
                      <option value="">Selecione uma especialidade</option>
                      <option value="Cardiologia">Cardiologia</option>
                      <option value="Dermatologia">Dermatologia</option>
                      <option value="Endocrinologia">Endocrinologia</option>
                      <option value="Gastroenterologia">Gastroenterologia</option>
                      <option value="Ginecologia">Ginecologia</option>
                      <option value="Neurologia">Neurologia</option>
                      <option value="Oftalmologia">Oftalmologia</option>
                      <option value="Ortopedia">Ortopedia</option>
                      <option value="Otorrinolaringologia">Otorrinolaringologia</option>
                      <option value="Pediatria">Pediatria</option>
                      <option value="Psiquiatria">Psiquiatria</option>
                      <option value="Urologia">Urologia</option>
                      <option value="Clínico Geral">Clínico Geral</option>
                      <option value="Cirurgia Geral">Cirurgia Geral</option>
                      <option value="Anestesiologia">Anestesiologia</option>
                      <option value="Radiologia">Radiologia</option>
                    </select>
                  </div>
                  {errors.especialidade && <span className="error-message">{errors.especialidade}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label">Data de Formatura</label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon icon={faCalendarAlt} className="input-icon" />
                    <input
                      type="date"
                      name="dataFormatura"
                      value={formData.dataFormatura}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {hospitalData && (
              <div className="hospital-section">
                <h3 className="section-title">
                  <FontAwesomeIcon icon={faHospital} />
                  Hospital Vinculado
                </h3>
                <div className="hospital-card">
                  <div className="hospital-info-display">
                    <div className="hospital-icon">
                      <FontAwesomeIcon icon={faHospital} />
                    </div>
                    <div className="hospital-details">
                      <h4>{hospitalData.nome}</h4>
                      <p>{hospitalData.endereco}</p>
                      <span className="hospital-id">ID: {hospitalData.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-cancelar"
                onClick={() => navigate('/hospital/medicos')}
                disabled={saving}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Cancelar
              </button>
              
              <button 
                type="submit" 
                className="btn-salvar"
                disabled={saving}
              >
                <FontAwesomeIcon icon={faSave} />
                {saving ? 'Salvando...' : 'Cadastrar Médico'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CadastrarMedicosHospital;