// No terminal, dentro do seu projeto React, execute:
//npm install -g json server
//npm install axios
//npx json-server --watch db.json --port 3001

import api from "axios"
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faIdCard, faFileAlt, faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/header';

const CadastrarPaciente = () => {

    const [vpaciente, setPaciente] = useState([]);
    const [vnome, setNome] = useState('')
    const [vdatanasc, setNasc] = useState('')
    const [vcpf, setCPF] = useState('')
    const [vtel, setTel] = useState('')
    const [vconvenio, setConvenio] = useState('')
    const [vrg, setRG] = useState('')
    const [vemail, setEmail] = useState('')
    const [vcep, setCEP] = useState('')
    const [vendereco, setEndereco] = useState('')
    const [vnumcasa, setNumCasa] = useState('')

    useEffect(() => {
        api.get("http://localhost:3001/paciente")
            .then(response => {
                setPaciente(response.data);
                console.log(response.data);
            })
            .catch(err => console.error("Erro ao buscar o paciente", err));
    }, []);

    const handleSubmit = async () => {
        try {
            const response = await api.post("http://localhost:3001/paciente", {
                nome: vnome,
                dataNasc: vdatanasc,
                cpf: formatCPF(vcpf),
                telefone: formatTelefone(vtel),
                convenio: vconvenio,
                rg: formatRG(vrg),
                email: vemail,
                cep: vcep,
                endereco: vendereco,
                numCasa: vnumcasa,
            });
            console.log(response.data);
        } catch (error) {
            console.log(response.error);
        }
    };

    function formatTelefone(telefone) {
        // Remove tudo o que não for número
        const onlyNumbers = telefone.replace(/\D/g, '');

        // Formata o número de telefone
        return onlyNumbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    function formatCPF(cpf) {

        const onlyNumbers = cpf.replace(/\D/g, '');

        // Formatar CPF
        return onlyNumbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    function formatRG(rg) {

        const onlyNumbers = rg.replace(/\D/g, '');

        // Formatar RG
        return onlyNumbers.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    }


    return (
        <div className="container">
            <div className="form2">
                <h2 className="centerText textMargins">Cadastrar Paciente</h2>
                    <form>
                        <div className="inputGroup">
                                <label>Nome Completo</label>
                                <input type="text" placeholder="Digite seu Nome Completo" required onChange={(e) => setNome(e.target.value)} className="input"/>
   
                            <div className="inputGroup double">
                                <div>
                                    <label>Data de Nasc.</label>
                                    <input type="date" id="date" name="date" onChange={(e) => setNasc(e.target.value)} className="input"/>
                                </div>
                                <div>
                                    <label>CPF</label>
                                    <input type="number" id="number" name="number" placeholder="123.456.789-10" required onChange={(e) => setCPF(e.target.value)} className="input"/>
                                </div>
                                <div>
                                    <label>RG:</label>
                                    <input type="number" id="number" name="number" placeholder="Digite seu RG" onChange={(e) => setRG(e.target.value)} className="input"/>
                                </div>
                            </div>
                            <div className="inputGroup double">
                                <div>
                                    <label>Convênio Médico</label>
                                    <input type="number" id="number" name="number" placeholder="Nº do Convênio" onChange={(e) => setConvenio(e.target.value)} className="input"/>
                                </div>
                                <div>
                                    <label>Telefone:</label>
                                    <input type="tel" id="tel" name="tel" placeholder="Digite seu Telefone" onChange={(e) => setTel(e.target.value)} className="input"/>
                                </div>
                            </div>
                            <div className="inputGroup">
                                    <label>Email:</label>
                                    <input type="email" id="email" name="email" placeholder="seu@email.com" onChange={(e) => setEmail(e.target.value)} className="input"/>
                            </div>
                            <div className="inputGroup double">
                                <div>
                                    <label>CEP:</label>
                                    <input type="number" id="number" name="number" placeholder="seu@email.com" onChange={(e) => setCEP(e.target.value)} className="input"/>
                                </div>
                                <div>
                                    <label>Nº da Casa:</label>
                                    <input type="number" id="number" name="number" placeholder="seu@email.com" onChange={(e) => setNumCasa(e.target.value)} className="input"/>
                                </div>
                            </div>
                            <div className="inputGroup">
                                    <label>Endereço:</label>
                                    <input type="text" id="text" name="text" placeholder="seu@email.com" onChange={(e) => setEndereco(e.target.value)} className="input"/>
                            </div>

                            <div className="inputGroup row center">
                                <button className="center button btnSuccess" onClick={handleSubmit}>Cadastrar</button>
                                <button type="button" className="center button btnError" onClick={() => window.location.href = '/paciente'}>Cancelar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
    )
}
export default CadastrarPaciente