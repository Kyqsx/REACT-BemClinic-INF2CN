import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import axios from '../../service/api';
import Header from '../../components/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock, faMapMarkerAlt, faStethoscope, faNotesMedical } from '@fortawesome/free-solid-svg-icons';
import './solicitarConsulta.css';

const SolicitarConsulta = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dataPreferencia: '',
    horarioPreferencia: '',
    localPreferencia: '',
    especialidade: '',
    medicoId: '',
    observacoes: ''
  });

  const [medicos, setMedicos] = useState([]);
  const [hospitais, setHospitais] = useState([]);
  const [hospitalSelecionado, setHospitalSelecionado] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Buscar lista de hospitais
    const fetchHospitais = async () => {
      try {
        const response = await axios.get('/api/v1/hospitais');
        setHospitais(response.data);
      } catch (error) {
        console.error('Erro ao buscar hospitais:', error);
      }
    };

    fetchHospitais();
  }, []);

  // Buscar médicos quando um hospital for selecionado
  useEffect(() => {
    const fetchMedicosDoHospital = async () => {
      if (hospitalSelecionado?.id) {
        try {
          setLoading(true);
          const response = await axios.get(`/api/v1/medicos/hospital/${hospitalSelecionado.id}/ativos`);
          setMedicos(response.data);
        } catch (error) {
          console.error('Erro ao buscar médicos do hospital:', error);
          setMedicos([]);
        } finally {
          setLoading(false);
        }
      } else {
        setMedicos([]);
      }
    };

    fetchMedicosDoHospital();
  }, [hospitalSelecionado]);

  // Filtrar médicos pela especialidade selecionada
  const medicosFiltrados = medicos.filter(medico => {
    // Se não há especialidade selecionada, não mostrar nenhum médico
    if (!formData.especialidade || formData.especialidade.trim() === '') {
      return false;
    }
    // Mostrar apenas médicos que têm exatamente a especialidade selecionada
    return medico.especialidade.toLowerCase().trim() === formData.especialidade.toLowerCase().trim();
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Se mudou o hospital, atualiza os detalhes e limpa a seleção de médico
    if (name === 'localPreferencia' && value) {
      const hospital = hospitais.find(h => h.nome === value);
      setHospitalSelecionado(hospital || null);
      // Limpar seleção de médico quando mudar hospital
      setFormData(prev => ({
        ...prev,
        medicoId: ''
      }));
    } else if (name === 'localPreferencia' && !value) {
      setHospitalSelecionado(null);
      // Limpar seleção de médico quando não há hospital selecionado
      setFormData(prev => ({
        ...prev,
        medicoId: ''
      }));
    } else if (name === 'especialidade') {
      // Limpar seleção de médico quando mudar especialidade
      setFormData(prev => ({
        ...prev,
        medicoId: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('👤 Usuário logado:', user);

    // Validações
    if (!user?.id) {
      setErrorMessage('Erro: usuário não identificado. Faça login novamente.');
      setShowError(true);
      setLoading(false);
      return;
    }

    if (!formData.dataPreferencia || !formData.horarioPreferencia || !formData.especialidade) {
      setErrorMessage('Por favor, preencha os campos obrigatórios.');
      setShowError(true);
      setLoading(false);
      return;
    }

    try {
      const consultaData = {
        pacienteId: user?.id, // ID do paciente logado
        dataPreferencia: formData.dataPreferencia, // Formato: YYYY-MM-DD
        horarioPreferencia: formData.horarioPreferencia + ':00', // Adiciona segundos: HH:mm:ss
        localPreferencia: formData.localPreferencia || null,
        especialidade: formData.especialidade,
        medicoId: formData.medicoId ? parseInt(formData.medicoId) : null,
        observacoes: formData.observacoes || null
      };

      console.log('📤 Enviando consulta:', consultaData);
      const response = await axios.post('/api/v1/consultas', consultaData);
      console.log('✅ Consulta criada:', response.data);
      
      setShowSuccess(true);
      
      // Limpar formulário
      setFormData({
        dataPreferencia: '',
        horarioPreferencia: '',
        localPreferencia: '',
        especialidade: '',
        medicoId: '',
        observacoes: ''
      });

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/minhas-consultas');
      }, 2000);

    } catch (error) {
      console.error('❌ Erro ao solicitar consulta:', error);
      console.error('Detalhes da resposta:', error.response?.data);
      console.error('Status:', error.response?.status);
      
      let msgErro = 'Erro ao solicitar consulta. Tente novamente.';
      if (error.response?.status === 400) {
        msgErro = 'Dados inválidos. Verifique se preencheu todos os campos obrigatórios.';
      } else if (error.response?.status === 404) {
        msgErro = 'Paciente não encontrado. Faça login novamente.';
      }
      
      setErrorMessage(msgErro);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="solicitar-consulta-page">
      <div className="solicitar-consulta-container">
        <div className="solicitar-consulta-card">
          <h2>Solicitar Consulta</h2>
          <p className="subtitle">Preencha suas preferências e aguarde a confirmação</p>

          <form onSubmit={handleSubmit} className="consulta-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dataPreferencia">
                  <FontAwesomeIcon icon={faCalendar} /> Data de Preferência *
                </label>
                <input
                  type="date"
                  id="dataPreferencia"
                  name="dataPreferencia"
                  value={formData.dataPreferencia}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="horarioPreferencia">
                  <FontAwesomeIcon icon={faClock} /> Horário de Preferência *
                </label>
                <input
                  type="time"
                  id="horarioPreferencia"
                  name="horarioPreferencia"
                  value={formData.horarioPreferencia}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="especialidade">
                  <FontAwesomeIcon icon={faStethoscope} /> Especialidade *
                </label>
                <select
                  id="especialidade"
                  name="especialidade"
                  value={formData.especialidade}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione uma especialidade</option>
                  <option value="Clínico Geral">Clínico Geral</option>
                  <option value="Cardiologia">Cardiologia</option>
                  <option value="Dermatologia">Dermatologia</option>
                  <option value="Pediatria">Pediatria</option>
                  <option value="Ortopedia">Ortopedia</option>
                  <option value="Ginecologia">Ginecologia</option>
                  <option value="Oftalmologia">Oftalmologia</option>
                  <option value="Psiquiatria">Psiquiatria</option>
                  <option value="Neurologia">Neurologia</option>
                  <option value="Outra">Outra</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="medicoId">
                  <FontAwesomeIcon icon={faStethoscope} /> Médico (Opcional)
                </label>
                <select
                  id="medicoId"
                  name="medicoId"
                  value={formData.medicoId}
                  onChange={handleChange}
                  disabled={!hospitalSelecionado || !formData.especialidade}
                >
                  <option value="">
                    {!hospitalSelecionado 
                      ? "Selecione um hospital primeiro" 
                      : !formData.especialidade
                      ? "Selecione uma especialidade primeiro"
                      : "Sem preferência"
                    }
                  </option>
                  {hospitalSelecionado && formData.especialidade && medicosFiltrados.map((medico) => (
                    <option key={medico.id} value={medico.id}>
                      Dr(a). {medico.nome} - {medico.especialidade} (CRM: {medico.crm})
                    </option>
                  ))}
                  {hospitalSelecionado && formData.especialidade && medicos.length > 0 && medicosFiltrados.length === 0 && (
                    <option value="" disabled>
                      Nenhum médico de {formData.especialidade} disponível neste hospital
                    </option>
                  )}
                  {hospitalSelecionado && formData.especialidade && medicos.length === 0 && (
                    <option value="" disabled>
                      Nenhum médico disponível neste hospital
                    </option>
                  )}
                </select>
                {hospitalSelecionado && (
                  <small className="form-hint">
                    {!formData.especialidade 
                      ? "Selecione uma especialidade para ver os médicos disponíveis"
                      : `Mostrando ${medicosFiltrados.length} médico(s) de ${formData.especialidade} no ${hospitalSelecionado.nome}`
                    }
                  </small>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="localPreferencia">
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Hospital de Preferência
              </label>
              <select
                id="localPreferencia"
                name="localPreferencia"
                value={formData.localPreferencia}
                onChange={handleChange}
              >
                <option value="">🏥 Sem preferência (qualquer hospital pode aceitar)</option>
                {hospitais.length === 0 && (
                  <option value="" disabled>Carregando hospitais...</option>
                )}
                {hospitais
                  .sort((a, b) => {
                    // Hospitais com pronto socorro primeiro
                    if (a.atendimentoEmergencia && !b.atendimentoEmergencia) return -1;
                    if (!a.atendimentoEmergencia && b.atendimentoEmergencia) return 1;
                    return a.nome.localeCompare(b.nome);
                  })
                  .map(hospital => (
                    <option key={hospital.id} value={hospital.nome}>
                      {hospital.atendimentoEmergencia ? '🚨 ' : '🏥 '}
                      {hospital.nome}
                      {hospital.tipoEstabelecimento && ` (${hospital.tipoEstabelecimento})`}
                      {hospital.especialidades && ` • ${hospital.especialidades.split(',')[0]}`}
                    </option>
                  ))}
              </select>
              <small className="form-hint">
                {hospitais.length > 0 ? (
                  <>
                    {hospitais.length} hospital(is) disponível(is)
                    {hospitais.filter(h => h.atendimentoEmergencia).length > 0 && 
                      ` • ${hospitais.filter(h => h.atendimentoEmergencia).length} com pronto socorro 🚨`
                    }
                  </>
                ) : (
                  'Carregando hospitais...'
                )}
              </small>
            </div>

            {/* Detalhes do Hospital Selecionado */}
            {hospitalSelecionado && (
              <div className="hospital-details-card">
                <h4>📋 Informações do Hospital Selecionado</h4>
                <div className="hospital-info-grid">
                  <div className="info-item">
                    <span className="info-label">Nome:</span>
                    <span className="info-value">{hospitalSelecionado.nome}</span>
                  </div>
                  {hospitalSelecionado.tipoEstabelecimento && (
                    <div className="info-item">
                      <span className="info-label">Tipo:</span>
                      <span className="info-value">{hospitalSelecionado.tipoEstabelecimento}</span>
                    </div>
                  )}
                  {hospitalSelecionado.especialidades && (
                    <div className="info-item">
                      <span className="info-label">Especialidades:</span>
                      <span className="info-value">{hospitalSelecionado.especialidades}</span>
                    </div>
                  )}
                  {hospitalSelecionado.horarioFuncionamento && (
                    <div className="info-item">
                      <span className="info-label">Horário:</span>
                      <span className="info-value">{hospitalSelecionado.horarioFuncionamento}</span>
                    </div>
                  )}
                  {hospitalSelecionado.telefone && (
                    <div className="info-item">
                      <span className="info-label">Telefone:</span>
                      <span className="info-value">{hospitalSelecionado.telefone}</span>
                    </div>
                  )}
                  {hospitalSelecionado.atendimentoEmergencia && (
                    <div className="info-item emergency-badge">
                      <span>🚨 Pronto Socorro 24h disponível</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="observacoes">
                <FontAwesomeIcon icon={faNotesMedical} /> Observações
              </label>
              <textarea
                id="observacoes"
                name="observacoes"
                placeholder="Descreva seus sintomas ou informações adicionais..."
                value={formData.observacoes}
                onChange={handleChange}
                rows="4"
              />
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
                {loading ? 'Enviando...' : 'Solicitar Consulta'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccess && (
        <div className="popup success">
          <div className="popup-content">
            <h3>✓ Sucesso!</h3>
            <p>Sua solicitação de consulta foi enviada com sucesso!</p>
            <p>Aguarde a confirmação de um hospital.</p>
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

export default SolicitarConsulta;
