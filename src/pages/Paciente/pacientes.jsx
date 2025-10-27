// No terminal, dentro do seu projeto React, execute:
//npm install -g json server
//npm install axios
//npx json-server --watch server.json --port 3001

import api from "axios"
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faIdCard, faFileAlt, faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/header';

const Pacientes = () => {

    const [vpaciente, setPaciente] = useState([]);

    useEffect(() => {
        api.get("http://localhost:3001/paciente")
            .then(response => {
                setPaciente(response.data);
                console.log(response.data);
            })
            .catch(err => console.error("Erro ao buscar o paciente", err));
    }, []);
    const handleDelete = async (id) => {
        try {
            await api.delete(`http://localhost:3001/paciente/${id}`);
            //Atualiza a lista após deletar
            const res = await api.get("http://localhost:3001/paciente");
            setPaciente(res.data);
        } catch (error) {
            console.log("Erro ao deletar paciente", error);
        }
    };

    return (
        <div className="container">
            
            <div className="form3">
                <h2 className="centerText textMargins">Pacientes</h2>
                <div className="inputGroup row center">

                    <button type="button" className="right button btnSuccess" onClick={() => window.location.href = '/cadastrarpaciente'}>Cadastrar</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black' }}><FontAwesomeIcon icon={faUser} /> Nome do Paciente</th>
                            <th style={{ border: '1px solid black' }}><FontAwesomeIcon icon={faIdCard} /> RG</th>
                            <th style={{ border: '1px solid black' }}><FontAwesomeIcon icon={faFileAlt} /> CPF</th>
                            <th style={{ border: '1px solid black' }}><FontAwesomeIcon icon={faPhone} /> Telefone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vpaciente.map(paciente => (
                            <tr key={paciente.id}>
                                <td style={{ border: '1px solid black' }}>
                                    {paciente.nome}
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    {paciente.rg}
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    {paciente.cpf}
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    {paciente.telefone}
                                </td>
                                <td style={{ border: '1px solid white' }}>
                                    <div className="botoes">
                                        <button className="button blue squareBtn rightMargin">
                                            <FontAwesomeIcon icon={faPencil} />
                                        </button>
                                        <button className="button btnError squareBtn" onClick={() => handleDelete(paciente.id)}>
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
export default Pacientes