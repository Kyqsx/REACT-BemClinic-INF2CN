import api from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
    const [vpaciente, setPaciente] = useState([]);
    const [etapa, setEtapa] = useState(1);
    const [vnome, setNome] = useState('');
    const [vdatanasc, setNasc] = useState('');
    const [vcpf, setCPF] = useState('');
    const [vtel, setTel] = useState('');
    const [vconvenio, setConvenio] = useState('');
    const [vrg, setRG] = useState('');
    const [vgender, setGender] = useState('');
    const [vnacionalidade, setNacionalidade] = useState('');
    const [vemail, setEmail] = useState('');
    const [vsenha, setSenha] = useState('');
    const [vcep, setCEP] = useState('');
    const [vendereco, setEndereco] = useState('');
    const [vnumcasa, setNumCasa] = useState('');
    const [vtype, setTypeAcc] = useState("user")

    useEffect(() => {
        api.get("http://localhost:3001/paciente")
            .then(response => {
                setPaciente(response.data);
                console.log(response.data);
            })
            .catch(err => console.error("Erro ao buscar o paciente", err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("http://localhost:3001/paciente", {
                nome: vnome,
                dataNasc: vdatanasc,
                cpf: formatCPF(vcpf),
                telefone: formatTelefone(vtel),
                convenio: vconvenio,
                rg: formatRG(vrg),
                genero: vgender,
                nacionalidade: vnacionalidade,
                email: vemail,
                senha: vsenha,
                cep: vcep,
                endereco: vendereco,
                numCasa: vnumcasa,
                accType: vtype,
            });
            console.log(response.data);
            alert('Paciente cadastrado com sucesso!');
        } catch (error) {
            console.log(error);
            alert('Erro ao cadastrar o paciente.');
        }
    };

    const proxEtapa = () => {
        setEtapa(etapa + 1);
    };

    const anteriorEtapa = () => {
        setEtapa(etapa - 1);
    };

    const etapaValida = () => {
        switch (etapa) {
            case 1:
                return vnome && vdatanasc && vcpf;
            case 2:
                return vconvenio && vtel && vemail;
            case 3:
                return vcep && vnumcasa && vendereco;
            default:
                return false;
        }
    };

    function formatTelefone(telefone) {
        const onlyNumbers = telefone.replace(/\D/g, '');
        return onlyNumbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    function formatCPF(cpf) {
        const onlyNumbers = cpf.replace(/\D/g, '');
        return onlyNumbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    function formatRG(rg) {
        const onlyNumbers = rg.replace(/\D/g, '');
        return onlyNumbers.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    }

    return (
        <div className="container">
            <div className="form2">
                <h2 className="centerText textMargins">Cadastro</h2>
                
                <div className="linhaEtapa">
                    <div className={`linhaEtapa-etapa ${etapa === 1 ? 'active' : ''}`}>
                        <div className="circulo">1</div>
                        <div className="etapa-label">Informações Pessoais</div>
                    </div>
                    <div className={`linhaEtapa-etapa ${etapa === 2 ? 'active' : ''}`}>
                        <div className="circulo">2</div>
                        <div className="etapa-label">Informações de Contato</div>
                    </div>
                    <div className={`linhaEtapa-etapa ${etapa === 3 ? 'active' : ''}`}>
                        <div className="circulo">3</div>
                        <div className="etapa-label">Endereço</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {etapa === 1 && (
                        <div>
                            <div className="inputGroup">
                                <label>Nome Completo</label>
                                <input 
                                    type="text" 
                                    placeholder="Digite seu Nome Completo" 
                                    required 
                                    value={vnome}
                                    onChange={(e) => setNome(e.target.value)} 
                                    className="input" 
                                />
                            </div>
                            <div className="inputGroup double">
                                <div>
                                    <label>Data de Nasc.</label>
                                    <input 
                                        type="date" 
                                        required 
                                        value={vdatanasc}
                                        onChange={(e) => setNasc(e.target.value)} 
                                        className="input" 
                                    />
                                </div>
                                <div>
                                    <label>CPF</label>
                                    <input 
                                        type="text" 
                                        placeholder="123.456.789-10" 
                                        required 
                                        value={vcpf}
                                        onChange={(e) => setCPF(e.target.value)} 
                                        className="input" 
                                    />
                                </div>
                                <div>
                                    <label>RG</label>
                                    <input 
                                        type="text" 
                                        placeholder="Digite seu RG" 
                                        value={vrg}
                                        onChange={(e) => setRG(e.target.value)} 
                                        className="input" 
                                    />
                                </div>
                            </div>
                            <div className="inputGroup double">
                                <div>
                                    <label htmlFor="gender">Gênero</label>
                                    <select 
                                        id="gender" 
                                        name="select" 
                                        value={vgender}
                                        onChange={(e) => setGender(e.target.value)} 
                                        className="input"
                                    >
                                        <option>Selecione um gênero</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Feminino">Feminino</option>
                                        <option value="Prefiro não dizer">Prefiro não dizer</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="nacionalidade">Nacionalidade</label>
                                    <select 
                                        id="nacionalidade" 
                                        name="select" 
                                        value={vnacionalidade}
                                        onChange={(e) => setNacionalidade(e.target.value)} 
                                        className="input"
                                    >
                                        <option>Selecione sua nacionalidade</option>
                                        <option value="Brasil">BRASIL</option>
                                        <option value="China">CHINA</option>
                                        <option value="Espanha">ESPANHA</option>
                                    </select>
                                </div>
                            </div>
                            <div className="inputGroup">
                                <label>Convênio Médico</label>
                                <input 
                                    type="text" 
                                    placeholder="Nº do Convênio" 
                                    value={vconvenio}
                                    onChange={(e) => setConvenio(e.target.value)} 
                                    className="input" 
                                />
                            </div>
                            <div className="inputGroup center row">
                                <button type="button" onClick={proxEtapa} className="center button btnSuccess" disabled={!etapaValida()}>Próximo</button>
                            </div>
                        </div>
                    )}

                    {etapa === 2 && (
                        <div>
                            <div className="inputGroup">
                                <label>Telefone</label>
                                <input 
                                    type="tel" 
                                    placeholder="Digite seu Telefone" 
                                    value={vtel}
                                    onChange={(e) => setTel(e.target.value)} 
                                    className="input" 
                                />
                            </div>
                            <div className="inputGroup">
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    placeholder="seu@email.com" 
                                    value={vemail}
                                    onChange={(e) => setEmail(e.target.value)} 
                                    className="input" 
                                />
                            </div>
                            <div className="inputGroup">
                                <label>Senha</label>
                                <input
                                type="password"
                                placeholder="********"
                                value={vsenha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="input"

                                />
                            </div>
                            <div className="inputGroup center row">
                                <button type="button" onClick={anteriorEtapa} className="center button btnError">Anterior</button>
                                <button type="button" onClick={proxEtapa} className="center button btnSuccess" disabled={!etapaValida()}>Próximo</button>
                            </div>
                        </div>
                    )}

                    {etapa === 3 && (
                        <div>
                            <div className="inputGroup">
                                <label>CEP</label>
                                <input 
                                    type="text" 
                                    placeholder="Digite seu CEP" 
                                    value={vcep}
                                    onChange={(e) => setCEP(e.target.value)} 
                                    className="input" 
                                />
                            </div>
                            <div className="inputGroup">
                                <label>Nº da Casa</label>
                                <input 
                                    type="text" 
                                    value={vnumcasa}
                                    onChange={(e) => setNumCasa(e.target.value)} 
                                    className="input" 
                                />
                            </div>
                            <div className="inputGroup">
                                <label>Endereço</label>
                                <input 
                                    type="text" 
                                    placeholder="Digite seu Endereço" 
                                    value={vendereco}
                                    onChange={(e) => setEndereco(e.target.value)} 
                                    className="input" 
                                />
                            </div>
                            <div className="inputGroup row center">
                                <button type="button" onClick={anteriorEtapa} className="center button btnError">Anterior</button>
                                <button type="submit" className="center button btnSuccess" disabled={!etapaValida()}>Cadastrar</button>
                            </div>
                        </div>
                    )}
                </form>
                
                <div className="inputGroup centerText">
                    <p>Já possui conta? <Link to="/" className="link textDecorNone">Clique aqui</Link></p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
