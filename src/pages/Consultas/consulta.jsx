// No terminal, dentro do seu projeto React, execute:
//npm install -g json server
//npm install axios
//npx json-server --watch server.json --port 3001

import api from "axios"
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faIdCard, faFileAlt, faClock, faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/header';

const Consultas = () => {

    const [vconsulta, setConsulta] = useState([]);
    const [consultasCount, setConsultasCount] = useState(0);
    const [consultasAgendadas, setConsultasAgendadas] = useState(0);
    const [consultasRealizadas, setConsultasRealizadas] = useState(0);
    useEffect(() => {
        const fetchConsultas = () => {
            api.get('http://localhost:3001/consultas')
                .then(response => {
                    setConsultasCount(response.data.length);

                    let agendadas = 0;
                    let realizadas = 0;
                    response.data.forEach(consulta => {
                        if (consulta.Status === 'Agendada') {
                            agendadas++;
                        } else if (consulta.Status === 'Realizada') {
                            realizadas++;
                        }
                    });
                    setConsultasAgendadas(agendadas);
                    setConsultasRealizadas(realizadas);
                })
                .catch(err => console.error('Erro ao buscar consultas', err));
        };

        fetchConsultas();
    }, []);

    useEffect(() => {
        api.get("http://localhost:3001/consultas")
            .then(response => {
                setConsulta(response.data);
                console.log(response.data);
            })
            .catch(err => console.error("Erro ao buscar a consulta", err));
    }, []);
    const handleDelete = async (id) => {
        try {
            await api.delete(`http://localhost:3001/consultas/${id}`);
            //Atualiza a lista após deletar
            const res = await api.get("http://localhost:3001/consultas");
            setConsulta(res.data);
        } catch (error) {
            console.log("Erro ao deletar consulta", error);
        }
    };
    return (
        <div className="container">
            <Header />
            <div className="form3">
                <h2>Visão Geral</h2>
                <div className="stats-row center">
                    <div className="cardInsight">
                        <h3>Total de Consultas</h3>
                        <p>Existem {consultasCount} consultas cadastradas.</p>
                    </div>
                    <div className="cardInsight">
                        <h3>Consultas Agendadas</h3>
                        <p>Existem {consultasAgendadas} consultas agendadas.</p>
                    </div>
                    <div className="cardInsight">
                        <h3>Consultas Realizadas</h3>
                        <p>Existem {consultasRealizadas} consultas realizadas.</p>
                    </div>
                </div>
            </div>
            <div className="form3">
                <h2 className="centerText textMargins">Consultas</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black' }}><FontAwesomeIcon icon={faUser} /> Nome do Paciente</th>
                            <th style={{ border: '1px solid black' }}><FontAwesomeIcon icon={faClock} /> Hora da Consulta</th>
                            <th style={{ border: '1px solid black' }}><FontAwesomeIcon icon={faIdCard} /> RG</th>
                            <th style={{ border: '1px solid black' }}>Especialidade</th>
                            <th style={{ border: '1px solid black' }}><FontAwesomeIcon icon={faPencil} /> Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vconsulta.map(consulta => (
                            <tr key={consulta.id}>
                                <td style={{ border: '1px solid black' }}>
                                     {consulta.nomePaciente}
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                     {consulta.horaConsulta}
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                     {consulta.rg}
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                     {consulta.especialidade}
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <div className="botoes">
                                        <button className="button blue">
                                            <FontAwesomeIcon icon={faPencil} />
                                        </button>
                                        <button className="button btnError" onClick={() => handleDelete(consulta.id)}>
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
export default Consultas