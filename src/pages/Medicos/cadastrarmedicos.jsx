// No terminal, dentro do seu projeto React, execute:
//npm install -g json server
//npm install axios
//npx json-server --watch server.json --port 3001

import api from "axios"
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faIdCard, faFileAlt } from '@fortawesome/free-solid-svg-icons';

import { use } from "react";

const CadastrarMedico = () => {

    const [vmedico, setMedico] = useState([]);
    const [vnome, setNome] = useState('')
    const [vcrm, setCRM] = useState('')
    const [vdatanasc, setDataNasc] = useState('')
    const [vcpf, setCPF] = useState('')
    const [vtel, setTel] = useState('')
    const [vrg, setRG] = useState('')
    const [vcep, setCEP] = useState('')
    const [vendereco, setEndereco] = useState('')
    const [vnumcasa, setNumCasa] = useState('')
    const [vdiplom, setDiplo] = useState('')

    useEffect(() => {
        api.get("http://localhost:3001/medicos")
            .then(response => {
                setMedico(response.data);
                console.log(response.data);
            })
            .catch(err => console.error("Erro ao buscar o médico", err));
    }, []);

    const handleSubmit = async () => {
        try {
            const response = await api.post("http://localhost:3001/medicos",
                { nome: vnome, crm: vcrm, datanasc: vdatanasc, cpf: vcpf, telefone: vtel, rg: vrg, cep: vcep, endereco: vendereco, numcasa: vnumcasa, diploma: vdiplom }
            )
            console.log(response.data)
        } catch (error) {
            console.log(response.error)
        }
    }
    return (
        <div className="container">
            <div className="form2">
                    <h2 className="centerText textMargins">Cadastrar Médico</h2>
                    <form>
                        <div className="inputGroup">
                            <label>Nome:</label>
                            <input type="text" id="texto" placeholder="Digite seu Nome" required onChange={(e) => setNome(e.target.value)} className="input"/>
                        </div>

                        <div className="inputGroup">
                            <label>CPF:</label>
                            <input type="text" id="texto" placeholder="Digite seu CPF" required onChange={(e) => setCPF(e.target.value)} className="input"/>
                        </div>

                        <div className="inputGroup">
                            <label>RG:</label>
                            <input type="text" id="texto" placeholder="Digite seu RG" required onChange={(e) => setRG(e.target.value)} className="input"/>
                        </div>

                        <div className="inputGroup">
                            <label>CRM:</label>
                            <input type="text" id="texto" placeholder="Digite seu CRM" required onChange={(e) => setCRM(e.target.value)} className="input"/>
                        </div>

                        <div className="inputGroup">
                            <label>Data de Nascimento:</label>
                            <input type="date" id="date" name="date" onChange={(e) => setDataNasc(e.target.value)} className="input"/>
                        </div>

                        <div className="inputGroup">
                            <label>Telefone:</label>
                            <input type="tel" id="tel" name="tel" placeholder="Digite seu Telefone" onChange={(e) => setTel(e.target.value)} className="input"/>
                        </div>

                        <div className="inputGroup double">
                            <div>
                                <label>CEP:</label>
                                <input type="number" id="number" name="number" placeholder="Seu CEP" onChange={(e) => setCEP(e.target.value)} className="input"/>
                            </div>
                            <div>
                                <label>Nº da Casa:</label>
                                <input type="number" id="number" name="number" placeholder="Nº" onChange={(e) => setNumCasa(e.target.value)} className="input"/>
                            </div>
                        </div>
                        <div className="inputGroup">
                                <label>Endereço:</label>
                                <input type="text" id="text" name="text" placeholder="R." onChange={(e) => setEndereco(e.target.value)} className="input"/>
                        </div>

                        <div className="inputGroup">
                            <label>Diploma de graduação em Medicina</label>
                            <input type="file" id="file" name="file" onChange={(e) => setDiplo(e.target.value)} className="input"/>
                        </div>

                        <div className="inputGroup row center">
                            <button className="center button btnSuccess" onClick={handleSubmit}>Cadastrar</button>
                            <button type="button" className="center button btnError" onClick={() => window.location.href = '/medicos'}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
    )
}
export default CadastrarMedico