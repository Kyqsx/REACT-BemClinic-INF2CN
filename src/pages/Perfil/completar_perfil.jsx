import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import api from 'axios';
import './completeProfile.css';

const CompletarPerfil = () => {
  const { isAuthenticated, userId } = useAuth();
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [tipoSanguineo, setTipoSanguineo] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [sexo, setSexo] = useState('');
  const [nomeMae, setNomeMae] = useState('');
  const [nomePai, setNomePai] = useState('');
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [id_endereco, setIdEndereco] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      alert('Sessão inválida. Por favor, faça login.');
      navigate('/login', { replace: true });
    } else {
      const fetchPacienteData = async () => {
        try {
          const response = await api.get(`/api/v1/pacientes/${userId}`);
          const paciente = response.data;
          setCpf(paciente.cpf);
          setRg(paciente.rg);
          setTipoSanguineo(paciente.tipoSanguineo);
          setDataNascimento(paciente.dataNascimento);
          setTelefone(paciente.telefone);
          setSexo(paciente.sexo);
          setNomeMae(paciente.nomeMae);
          setNomePai(paciente.nomePai);
          setEmail(paciente.email);
          setNome(paciente.nome);
          setSenha(paciente.senha);
          setIdEndereco(paciente.id_endereco);
        } catch (error) {
          console.error('Erro ao buscar dados do paciente:', error);
          setShowError(true);
          setErrorMessage('Erro ao carregar dados do paciente.');
        }
      };

      fetchPacienteData();
    }
  }, [isAuthenticated, userId, navigate]);

  const formatarCPF = (value) => {
    const numeros = value.replace(/\D/g, '');
    if (numeros.length <= 11) {
      if (numeros.length <= 3) return numeros;
      if (numeros.length <= 6) return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
      if (numeros.length <= 9) return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
      return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`;
    }
    return value.slice(0, -1);
  };

  const handleCpfChange = (e) => {
    const value = e.target.value;
    setCpf(formatarCPF(value));
  };

  const formatarRG = (value) => {
    const numeros = value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    if (numeros.length <= 9) {
        if (numeros.length <= 2) return numeros; // Retorna apenas os dois primeiros dígitos
        if (numeros.length <= 5) return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}`; // Formato XX.XXX
        return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}-${numeros.slice(8)}`; // Formato XX.XXX.XXX-X
    }
    return value.slice(0, -1); // Retorna o valor original se exceder 9 dígitos
};

  const handleRgChange = (e) => {
    const value = e.target.value;
    setRg(formatarRG(value));
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

  const handleTelefoneChange = (e) => {
    const value = e.target.value;
    setTelefone(formatarTelefone(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cpf || !rg || !tipoSanguineo || !dataNascimento || !telefone || !sexo || !nomeMae || !nomePai) {
        setShowError(true);
        setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    try {
        await api.put(`/api/v1/pacientes/${userId}`, {
            email,
            nome,
            senha,
            cpf: cpf.replace(/\D/g, ''),
            rg: rg.replace(/\D/g, ''),
            tipoSanguineo,
            dataNascimento,
            telefone: telefone.replace(/\D/g, ''),
            sexo,
            nomeMae,
            nomePai,
            id_endereco
        });

        alert('Perfil atualizado com sucesso!');
        navigate('/');
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        const msg =
            error.response?.data?.message ||
            error.response?.data?.mensagem ||
            error.message ||
            'Erro ao atualizar perfil.';
        setShowError(true);
        setErrorMessage(msg);
    }
  };

  return (
    <div className="complete">
      <div className="complete-container">
        <div className='complete-card'>
          <h2>Completar Perfil</h2>
          <p>Por favor, preencha suas informações pessoais. 📝</p>
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="completeInputGroup">
              <label className="completeInputLabel">Nome Completo:</label>
              <input
                type='text'
                className="completeInputField"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div className="completeInputGroup">
              <label className="completeInputLabel">CPF:</label>
              <input
                type="text"
                className="completeInputField"
                value={cpf}
                onChange={handleCpfChange}
                maxLength="14"
                required
              />
            </div>
            <div className="completeInputGroup">
              <label className="completeInputLabel">RG:</label>
              <input
                type="text"
                className="completeInputField"
                value={rg}
                onChange={handleRgChange}
                required
              />
            </div>
            <div className="completeInputGroup">
              <label className="completeInputLabel">Tipo Sanguíneo:</label>
              <select
                className="completeInputField"
                value={tipoSanguineo}
                onChange={(e) => setTipoSanguineo(e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div className="completeInputGroup">
              <label className="completeInputLabel">Data de Nascimento:</label>
              <input
                type="date"
                className="completeInputField"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
              />
            </div>
            <div className="completeInputGroup">
              <label className="completeInputLabel">Telefone:</label>
              <input
                type="text"
                className="completeInputField"
                value={telefone}
                onChange={handleTelefoneChange}
                required
              />
            </div>
            <div className="completeInputGroup">
              <label className="completeInputLabel">Sexo:</label>
              <select
                className="completeInputField"
                value={sexo}
                onChange={(e) => setSexo(e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="PrefiroNaoDizer">Prefiro Não Dizer</option>
              </select>
            </div>
            <div className="completeInputGroup">
              <label className="completeInputLabel">Nome da Mãe:</label>
              <input
                type="text"
                className="completeInputField"
                value={nomeMae}
                onChange={(e) => setNomeMae(e.target.value)}
                required
              />
            </div>
            <div className="completeInputGroup">
              <label className="completeInputLabel">Nome do Pai:</label>
              <input
                type="text"
                className="completeInputField"
                value={nomePai}
                onChange={(e) => setNomePai(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="complete-button">
              Salvar
            </button>
          </form>
        </div>
      </div>

      {showError && (
        <div className="popup">
          <div className="popup-content">
            <p>{errorMessage}</p>
            <button onClick={() => setShowError(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletarPerfil;
