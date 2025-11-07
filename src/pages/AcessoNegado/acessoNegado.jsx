import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faHome, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './acessoNegado.css';

const AcessoNegado = () => {
  const navigate = useNavigate();

  return (
    <div className="acesso-negado-page">
      <div className="acesso-negado-container">
        <div className="acesso-negado-icon">
          <FontAwesomeIcon icon={faLock} />
        </div>
        
        <h1>Acesso Negado</h1>
        <p className="acesso-negado-subtitle">
          Você não tem permissão para acessar esta página
        </p>
        
        <div className="acesso-negado-info">
          <p>Esta área é restrita e requer privilégios específicos.</p>
          <p>Se você acredita que deveria ter acesso, entre em contato com o administrador do sistema.</p>
        </div>

        <div className="acesso-negado-actions">
          <button 
            className="btn-home"
            onClick={() => navigate('/')}
          >
            <FontAwesomeIcon icon={faHome} />
            Ir para Home
          </button>
        </div>

        <div className="acesso-negado-code">
          <span>Erro 403</span>
        </div>
      </div>
    </div>
  );
};

export default AcessoNegado;
