//npx json-server --watch db.json --port 3001

import api from "axios"
import { useState, useEffect } from "react";
import moment from 'moment';

const MarcarConsulta = () => {
    const [vmedico, setPaciente] = useState([]);
    const [vnome, setNome] = useState('')
    const [vdatanasc, setNasc] = useState('')
    const [vcpf, setCPF] = useState('')
    const [vtel, setTel] = useState('')
    const [vconvenio, setConvenio] = useState('')
    const [vrg, setRG] = useState('')
    const [vespec, setEspc] = useState('')
    const [vhrcons, setHrCnt] = useState('')
    const [vprofdisp, setProfDisp] = useState('')
    const [consultaStatus, setConsultaStatus] = useState('');

    useEffect(() => {
        api.get("http://localhost:3001/medicos")
            .then(response => {
                setPaciente(response.data);
                console.log(response.data);
            })
            .catch(err => console.error("Erro ao buscar o medico", err));
    }, []);

    useEffect(() => {
        if (vhrcons) {
            const consultaData = moment(vhrcons, 'DD/MM/YYYY HH:mm');
            const now = moment();
            if (consultaData.isBefore(now)) {
                setConsultaStatus('Realizada');
            } else if (consultaData.isAfter(now)) {
                setConsultaStatus('Agendada');
            } else {
                setConsultaStatus('Horário não é válido');
            }
        }
    }, [vhrcons]);

    const handleSubmit = async () => {
        try {
            const response = await api.post("http://localhost:3001/consultas",
                { nomePaciente: vnome, dataNascimento: vdatanasc, cpf: vcpf, Telefone: vtel, Convenio: vconvenio, rg: vrg, Especialidade: vespec, HoraConsulta: vhrcons, Profissional: vprofdisp, Status: consultaStatus }
            )
            console.log(response.data)
        } catch (error) {
            console.log(response.error)
        }
    }

    return (

        <div className="container">
            <div className="form2">
                <h2 className="centerText textMargins">Marcar Consulta</h2>

                <form>
                    <div className="inputGroup">
                            <label htmlFor="nome">Nome Completo</label>
                            <input type="text" id="nome" placeholder="Digite seu Nome Completo" required onChange={(e) => setNome(e.target.value)} className="input"/>
                    </div>
                    <div className="inputGroup double">

                            <div>
                                <label htmlFor="date">Data de Nasc.</label>
                                <input type="date" id="date" name="date" onChange={(e) => setNasc(e.target.value)} className="input"/>
                            </div>

                            <div>
                                <label htmlFor="cpf">CPF</label>
                                <input type="number" id="cpf" name="number" placeholder="123.456.789-10" required onChange={(e) => setCPF(e.target.value)} className="input"/>
                            </div>

                            <div>
                                <label htmlFor="tel">Telefone:</label>
                                <input type="tel" id="tel" name="tel" placeholder="Digite seu Telefone" onChange={(e) => setTel(e.target.value)} className="input"/>
                            </div>
                    </div>
                    <div className="inputGroup double">
                            <div>
                                <label htmlFor="convenio">Convênio Médico</label>
                                <input type="number" id="convenio" name="number" placeholder="Nº do Convênio" onChange={(e) => setConvenio(e.target.value)} className="input"/>
                            </div>
                            <div>
                                <label htmlFor="rg">RG</label>
                                <input type="number" id="rg" name="number" placeholder="12.345.678-9" required onChange={(e) => setRG(e.target.value)} className="input"/>
                            </div>
                    </div>
                    <div className="inputGroup">
                            <label htmlFor="especs">Especialidades</label>
                            <select id="especs" name="select" onChange={(e) => setEspc(e.target.value)} className="input">
                                <option>Selecione uma Especialidade</option>
                                <option value="Especialidade 1">Especialidade 1</option>
                                <option value="Especialidade 2">Especialidade 2</option>
                                <option value="Especialidade 3">Especialidade 3</option>
                                <option value="Especialidade 4">Especialidade 4</option>
                            </select>
                    </div>
                    <div className="inputGroup">
                            <label htmlFor="horarios">Horários Disponiveis</label>
                            <select id="horarios" name="select" onChange={(e) => setHrCnt(e.target.value)} className="input">
                                <option>Selecione um Horário</option>
                                <option value="25/05/2025 13:01">25/05/2025 13:01</option>
                                <option value="31/07/2025 13:30">31/07/2025 13:30</option>
                                <option value="21/06/2025 15:45">21/06/2025 15:45</option>
                                <option value="30/05/2025 18:50">30/05/2025 18:50</option>
                            </select>
                    </div>

                    <div className="inputGroup">
                            <label htmlFor="meddisp">Médicos Disponiveis</label>
                            <select id="meddisp" name="select" onChange={(e) => setProfDisp(e.target.value)} className="input">
                                <option>Selecione um Médico</option>
                                {vmedico.map(medico => (
                                    <option key={medico.id} value={medico.id}>{medico.nome}</option>

                                ))}
                            </select>
                    </div>

                    <div className="inputGroup row center">
                        <button className="center button btnSuccess" onClick={handleSubmit}>Marcar</button>
                        <button type="button" className="center button btnError" onClick={() => window.location.href = '/consultas'}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default MarcarConsulta