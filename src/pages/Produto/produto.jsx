//No terminal, dentro do seu projeto react, executa
//npm install -g json-server
//npm install axios

//comandos de inicializacao
//npx json-server --watch db.json --port 3001
//npm run dev

import api from "axios";
import cors from "cors";
import { useState, useEffect } from "react";

const Produto = () => {

    //inicio get
    //declarar o setProduto       
    const [vproduto, setProduto] = useState([]);
    //Ao carregar a tela ja traz os dados
    useEffect(() =>{
        api.get("http://localhost:8080/api/v1/usuarios/getusers")
        .then(response =>{
            setProduto(response.data);
            console.log(response.data); 
        })
        .catch(err => console.error("Erro ao Buscar o Produto", err));
    },[]);
    //fim get
    
    //inicio post
    const [vnome, setNome] = useState('')
    const [vdesc, setDesc] = useState('')
    const [vpreco, setPreco] = useState('')
    const [vativo, setAtivo] = useState('Ativo');
    const [vimagem, setImg] = useState('') //inserir imagem no db.json
  
    //Guarda os dados em no db.json  
   const handleSubmit = async () => {
    try {
        const response = await api.post("http://localhost:3001/produto",
        {nome: vnome, 
        descricao: vdesc, 
        precovenda: vpreco, 
        status: vativo,
        imagem: vimagem
    })

        console.log(response.data)  

    } catch (error) {
        console.log(error)
    }
   }
   //fim do post
   
   // FUNÇÃO ADICIONADA: para deletar os dados de produto
        const handleDelete = async (id) => {
            try {
                await api.delete(`http://localhost:3001/produto/${id}`);
                // Atualiza a lista após deletar
                const res = await api.get("http://localhost:3001/produto");
                setProduto(res.data);
            } catch (error) {
                console.log("Erro ao deletar produto", error);
            }
        };


    return(
        
            <div className="app-container">
                <div className="main-content">
                    Cadastro de Produto
                </div>
              
              <form>
                <div className="form-group">
                    <label>Nome do Produto</label>
                    <input type="text" placeholder="Nome do Produto"  required onChange={(e)=>setNome(e.target.value)}/>
                </div>
 
                <div className="form-group">
                    <label>Descrição do Produto</label>
                    <input type="text" placeholder="Descrição do Produto" onChange={(e)=>setDesc(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label>Preço de Venda</label>
                    <input type="text" placeholder="Preço de Venda" onChange={(e)=>setPreco(e.target.value)}/>
                </div>
         
                 {/*Inicio Campo de imagem do Produto  */}
                    <div className="form-group">
                        <label>Imagem do Produto</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    setImg(reader.result); // Salva a imagem em base64 no estado vimg
                                };
                                if (file) {
                                    reader.readAsDataURL(file); // Lê o arquivo selecionado
                                    setFileName(file.name); // Armazena o nome do arquivo
                                }
                            }}
                        />                        
                    </div>
                    {/*Fim Campo de imagem do Produto  */}


                <div className="form-group">
                    <button onClick={handleSubmit}>Cadastrar Produto</button>
                </div>
              </form>

                {/*inicio da busca de dados*/} 
               <div className="main-content">
                    Produtos Cadastrados
                </div>
                <ul>
                    {vproduto.map(item=>(
                       <li key={item.id}> {item.nome} - {item.email} - {item.senha}
                    
                       
                       
                       </li>     
                    ))}
                </ul>
                {/*fim da busca de dados*/} 

            </div> 
            
    );

}
export default Produto