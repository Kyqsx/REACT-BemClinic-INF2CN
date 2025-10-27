// No terminal, dentro do seu projeto React, execute:
//npm install -g json server
//npm install axios
//npx json-server --watch server.json --port 3001

import api from "axios"
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faIdCard, faFileAlt, faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/header';

const Medicos = () => {

    const [vmedicos, setMedico] = useState([]);

    useEffect(() => {
        api.get("http://localhost:3001/medicos")
            .then(response => {
                setMedico(response.data);
                console.log(response.data);
            })
            .catch(err => console.error("Erro ao buscar o medico", err));
    }, []);
    const handleDelete = async (id) => {
        try {
            await api.delete(`http://localhost:3001/medicos/${id}`);
            //Atualiza a lista após deletar
            const res = await api.get("http://localhost:3001/medicos");
            setMedico(res.data);
        } catch (error) {
            console.log("Erro ao deletar medico", error);
        }
    };

    return (
        <div className="container">
            
            <div className="form3">
                <h2 className="centerText textMargins">Médicos Cadastrados </h2>

                
                <div className="inputGroup row">

                    <button type="button" className="right button btnSuccess" onClick={() => window.location.href = '/cadastrarmedicos'}>Cadastrar</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black' }}><FontAwesomeIcon icon={faUser} /> Nome do Médico</th>
                            <th style={{ border: '1px solid black' }}><FontAwesomeIcon icon={faIdCard} /> CRM</th>
                            <th style={{ border: '1px solid black' }}><FontAwesomeIcon icon={faFileAlt} /> RG</th>
                            <th style={{ border: '1px solid black' }}><FontAwesomeIcon icon={faPhone} /> Telefone</th>
                            <th style={{ border: '1px solid black' }}><FontAwesomeIcon icon={faPencil} /> Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vmedicos.map(medicos => (
                            <tr key={medicos.id}>
                                <td style={{ border: '1px solid black' }}>
                                    {medicos.nome}
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    {medicos.crm}
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    {medicos.rg}
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    {medicos.telefone}
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <div className="botoes">
                                        <button className="button blue">
                                            <FontAwesomeIcon icon={faPencil} />
                                        </button>
                                        <button className="button btnError" onClick={() => handleDelete(medicos.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default Medicos