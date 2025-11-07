import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  faClipboard,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import axios from '../../service/api';
import Header from '../../components/header';
import './adminCadastrarHospital.css';

const AdminCadastrarHospital = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // Se existir ID, é edição
  const isEdicao = !!id;

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
    observacoes: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', senha: '' });

  useEffect(() => {
    // Verifica se o usuário é admin
    console.log('🔍 Verificação Admin:', { user, tipo: user?.tipo });
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

    // Se for edição, buscar dados do hospital
    if (isEdicao) {
      fetchHospitalData();
    }
  }, [user, navigate, isEdicao, id]);

  const fetchHospitalData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/hospitais/${id}`);
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
        observacoes: hospital.observacoes || ''
      });
    } catch (error) {
      console.error('Erro ao buscar hospital:', error);
      setErrorMessage('Erro ao carregar dados do hospital.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

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
      setErrorMessage('Por favor, preencha os campos obrigatórios (Nome, CNPJ, Razão Social e Telefone).');
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
        email: formData.email || null,
        tipoEstabelecimento: formData.tipoEstabelecimento || null,
        especialidades: formData.especialidades || null,
        horarioFuncionamento: formData.horarioFuncionamento || null,
        atendimentoEmergencia: formData.atendimentoEmergencia,
        numeroLeitos: formData.numeroLeitos ? parseInt(formData.numeroLeitos) : null,
        diretorResponsavel: formData.diretorResponsavel || null,
        cnes: formData.cnes || null,
        observacoes: formData.observacoes || null
      };

      if (isEdicao) {
        await axios.put(`/api/v1/hospitais/${id}`, hospitalData);
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/admin/hospitais');
        }, 2000);
      } else {
        const response = await axios.post('/api/v1/hospitais', hospitalData);
        
        // Mostra as credenciais de acesso
        const senhaTemporaria = formData.cnpj.replace(/\D/g, '');
        setCredentials({
          email: formData.email,
          senha: senhaTemporaria
        });
        setShowCredentials(true);
        
        // Após 8 segundos, redireciona
        setTimeout(() => {
          navigate('/admin/hospitais');
        }, 8000);
      }

    } catch (error) {
      console.error('Erro ao salvar hospital:', error);
      setErrorMessage(error.response?.data?.message || 'Erro ao salvar hospital. Tente novamente.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdicao) {
    return (
      <div className="admin-cadastrar-hospital-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando dados do hospital...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-cadastrar-hospital-page">
      <div className="cadastrar-hospital-header">
        <div className="header-icon">
          <FontAwesomeIcon icon={faHospital} size="3x" />
        </div>
        <h1>{isEdicao ? 'Editar Hospital' : 'Cadastrar Novo Hospital'}</h1>
        <p className="subtitle">
          {isEdicao 
            ? 'Atualize as informações do estabelecimento de saúde' 
            : 'Preencha as informações do estabelecimento de saúde'}
        </p>

        <form onSubmit={handleSubmit} className="">
            {/* Informações Básicas */}
            <div className="form-section">
              <h3><FontAwesomeIcon icon={faClipboard} /> Informações Básicas</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nome" className="form-label">
                    <FontAwesomeIcon icon={faHospital} /> Nome do Estabelecimento *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    className="form-input"
                    placeholder="Ex: Hospital Central"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cnpj" className="form-label">
                    <FontAwesomeIcon icon={faIdCard} /> CNPJ *
                  </label>
                  <input
                    type="text"
                    id="cnpj"
                    name="cnpj"
                    className="form-input"
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
                  <label htmlFor="razaoSocial" className="form-label">
                    <FontAwesomeIcon icon={faBuilding} /> Razão Social *
                  </label>
                  <input
                    type="text"
                    id="razaoSocial"
                    name="razaoSocial"
                    className="form-input"
                    placeholder="Razão Social da Empresa"
                    value={formData.razaoSocial}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cnes" className="form-label">
                    <FontAwesomeIcon icon={faFileAlt} /> CNES
                  </label>
                  <input
                    type="text"
                    id="cnes"
                    name="cnes"
                    className="form-input"
                    placeholder="Cadastro Nacional"
                    value={formData.cnes}
                    onChange={handleChange}
                  />
                </div>
              </div>
            
            {/* Contato */}
              <h3><FontAwesomeIcon icon={faPhone} /> Contato</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="telefone" className="form-label">
                    <FontAwesomeIcon icon={faPhone} /> Telefone *
                  </label>
                  <input
                    type="text"
                    id="telefone"
                    name="telefone"
                    className="form-input"
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <FontAwesomeIcon icon={faEnvelope} /> E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="contato@hospital.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

            {/* Caracterização */}
              <h3><FontAwesomeIcon icon={faHospital} /> Caracterização</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tipoEstabelecimento" className="form-label">
                    <FontAwesomeIcon icon={faBuilding} /> Tipo de Estabelecimento
                  </label>
                  <select className="form-select"
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
                  <label htmlFor="numeroLeitos" className="form-label">
                    <FontAwesomeIcon icon={faBed} /> Número de Leitos
                  </label>
                  <input
                    type="number"
                    id="numeroLeitos"
                    name="numeroLeitos"
                    className="form-input"
                    placeholder="Ex: 100"
                    value={formData.numeroLeitos}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="especialidades" className="form-label">
                  <FontAwesomeIcon icon={faStethoscope} /> Especialidades Atendidas
                </label>
                <input
                  type="text"
                  id="especialidades"
                  name="especialidades"
                  className="form-input"
                  placeholder="Ex: Cardiologia, Pediatria, Ortopedia..."
                  value={formData.especialidades}
                  onChange={handleChange}
                />
                <small>Separe por vírgula</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="horarioFuncionamento" className="form-label">
                    <FontAwesomeIcon icon={faClock} /> Horário de Funcionamento
                  </label>
                  <input
                    type="text"
                    id="horarioFuncionamento"
                    name="horarioFuncionamento"
                    className="form-input"
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

            {/* Responsável */}
              <h3><FontAwesomeIcon icon={faUser} /> Responsável</h3>
              
              <div className="form-group">
                <label htmlFor="diretorResponsavel" className="form-label">
                  <FontAwesomeIcon icon={faUserMd} /> Diretor Responsável
                </label>
                <input
                  type="text"
                  id="diretorResponsavel"
                  name="diretorResponsavel"
                  className="form-input"
                  placeholder="Nome do diretor ou responsável técnico"
                  value={formData.diretorResponsavel}
                  onChange={handleChange}
                />
              </div>

            {/* Observações */}
              <h3><FontAwesomeIcon icon={faFileAlt} /> Observações Adicionais</h3>
              
              <div className="form-group">
                <label htmlFor="observacoes" className="form-label">
                  <FontAwesomeIcon icon={faFileAlt} /> Observações
                </label>
                <textarea className="form-textarea"
                  id="observacoes"
                  name="observacoes"
                  placeholder="Informações adicionais sobre o estabelecimento..."
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <div className='form-actions'>
                <button
                  type="button"
                  className="form-button-secondary"
                  onClick={() => navigate('/admin/hospitais')}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="form-button"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : (isEdicao ? 'Atualizar Hospital' : 'Cadastrar Hospital')}
                </button>
              </div>
            </div>
          </form>
        </div>

      {showSuccess && (
        <div className="popup success">
          <div className="popup-content">
            <h3>✓ Sucesso!</h3>
            <p>Hospital {isEdicao ? 'atualizado' : 'cadastrado'} com sucesso!</p>
            <button className="form-button" onClick={() => setShowSuccess(false)}>Fechar</button>
          </div>
        </div>
      )}

      {showError && (
        <div className="popup error">
          <div className="popup-content">
            <h3>✗ Erro</h3>
            <p>{errorMessage}</p>
            <button className="form-button" onClick={() => setShowError(false)}>Fechar</button>
          </div>
        </div>
      )}

      {showCredentials && (
        <div className="modal-overlay credentials-modal">
          <div className="modal-content credentials-content">
            <div className="credentials-header">
              <div className="success-icon">✓</div>
              <h2>Hospital Cadastrado com Sucesso!</h2>
              <p className="credentials-subtitle">
                Um usuário foi criado automaticamente para este hospital
              </p>
            </div>
            
            <div className="credentials-body">
              <div className="credentials-section">
                <h3>🔑 Credenciais de Acesso</h3>
                <div className="credential-item">
                  <label>E-mail:</label>
                  <div className="credential-value">
                    <strong>{credentials.email}</strong>
                    <button 
                      className="btn-copy"
                      onClick={() => {
                        navigator.clipboard.writeText(credentials.email);
                        alert('E-mail copiado!');
                      }}
                    >
                      📋 Copiar
                    </button>
                  </div>
                </div>
                
                <div className="credential-item">
                  <label>Senha Temporária:</label>
                  <div className="credential-value">
                    <strong>{credentials.senha}</strong>
                    <button 
                      className="btn-copy"
                      onClick={() => {
                        navigator.clipboard.writeText(credentials.senha);
                        alert('Senha copiada!');
                      }}
                    >
                      📋 Copiar
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="credentials-info">
                <h4>⚠️ Informações Importantes:</h4>
                <ul>
                  <li>A senha temporária é o CNPJ sem pontuação</li>
                  <li>Recomende ao hospital que altere a senha no primeiro acesso</li>
                  <li>Guarde essas credenciais em local seguro</li>
                  <li>Você será redirecionado automaticamente em alguns segundos</li>
                </ul>
              </div>
            </div>
            
            <div className="credentials-actions">
              <button 
                className="form-button"
                onClick={() => navigate('/admin/hospitais')}
              >
                Ir para Lista de Hospitais
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCadastrarHospital;
