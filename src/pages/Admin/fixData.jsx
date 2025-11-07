import React, { useState } from 'react';
import axios from '../../service/api';
import Header from '../../components/header';

const FixData = () => {
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const vincularUsuarios = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/v1/fix/vincular-usuarios');
      setResultado(response.data);
      alert('✅ Usuários vinculados com sucesso!');
    } catch (error) {
      console.error('Erro ao vincular:', error);
      alert('❌ Erro ao vincular usuários');
    } finally {
      setLoading(false);
    }
  };

  const verificarUsuarios = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/fix/verificar-usuarios');
      console.log('Usuários:', response.data);
      setResultado(response.data);
    } catch (error) {
      console.error('Erro ao verificar:', error);
      alert('❌ Erro ao verificar usuários');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fix-data-page">
      
      <div className="fix-data-container">
        <h1>🔧 Corrigir Dados</h1>
        <p>Este é um utilitário para corrigir vínculos entre usuários e pacientes/médicos.</p>

        <div className="fix-data-actions">
          <button
            onClick={vincularUsuarios}
            disabled={loading}
            className="fix-data-btn btn-vincular"
          >
            {loading ? 'Processando...' : '🔗 Vincular Usuários'}
          </button>

          <button
            onClick={verificarUsuarios}
            disabled={loading}
            className="fix-data-btn btn-verificar"
          >
            {loading ? 'Processando...' : '🔍 Verificar Usuários'}
          </button>
        </div>

        {resultado && (
          <div className="fix-data-resultado">
            <h3>Resultado:</h3>
            <pre>
              {JSON.stringify(resultado, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default FixData;
