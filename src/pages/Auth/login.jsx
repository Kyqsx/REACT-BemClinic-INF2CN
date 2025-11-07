import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import api from '../../service/api';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      setErrorMessage('Por favor, preencha todos os campos.');
      setShowError(true);
      return;
    }

    try {
      const response = await api.post('/api/v1/auth/login', { 
        email, 
        senha 
      });

      const { token, tipo, id, nome } = response.data;

      console.log('🔐 Resposta do login:', response.data);
      console.log('📊 ID retornado:', id);
      console.log('👤 Tipo:', tipo);

      if (!token || !tipo) {
        throw new Error('Resposta inválida do servidor');
      }

      // ✅ Usa o novo formato: login(email, token, dadosExtras)
      login(email, token, { id, nome, tipo });

      if (tipo === 'MEDICO') {
        navigate('/');
      } else if (tipo === 'PACIENTE') {
        navigate('/');
      } else if (tipo === 'ADMIN') {
        navigate('/admin');
      } else if (tipo === 'HOSPITAL') {
        navigate('/hospital');
      }

    } catch (error) {
      console.error('Erro no login:', error);
      
      if (error.response?.status === 401) {
        setErrorMessage('Email ou senha inválidos.');
      } else if (error.response?.status === 400) {
        setErrorMessage('Dados de login inválidos.');
      } else if (error.response?.status === 500) {
        setErrorMessage('Erro no servidor. Tente novamente mais tarde.');
      } else if (error.request) {
        setErrorMessage('Erro de conexão. Verifique se o servidor está rodando.');
      } else {
        setErrorMessage('Erro inesperado. Tente novamente.');
      }
      
      setShowError(true);
    }
  };

  return (
    <div className="loginPage">
      <div className="loginContainer">
        <div className="login-card">
          <h2>Bem-vindo de volta! 👋</h2>
          <p>Entre com sua conta para continuar</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="loginInputGroup horizontal">
              <label className="loginInputLabel" title="Email">
                <FontAwesomeIcon icon={faEnvelope} />
              </label>
              <input
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="loginInputField"
              />
            </div>

            <div className="loginInputGroup horizontal">
              <label className="loginInputLabel" title="Senha">
                <FontAwesomeIcon icon={faLock} />
              </label>
              <div className="loginPasswordWrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="loginInputField"
                />
                <button
                  type="button"
                  className="loginEye-button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-button">
              Entrar
            </button>
          </form>

          <div className="login-footer">
            <p>Não possui conta? <a href="/signup" className='link-a'>Clique Aqui</a></p>
            <p><a href="/recuperar-senha" className='link-p'>Esqueci minha senha</a></p>
          </div>
        </div>
      </div>

      {showError && (
        <div className="loginPopup">
          <div className="loginPopup-content">
            <p>{errorMessage}</p>
            <button onClick={() => setShowError(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;