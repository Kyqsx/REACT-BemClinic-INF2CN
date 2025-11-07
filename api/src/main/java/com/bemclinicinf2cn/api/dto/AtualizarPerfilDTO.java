package com.bemclinicinf2cn.api.dto;

public class AtualizarPerfilDTO {
    private String nome;
    private String senha;
    private String cep;
    private String rua;
    private String foto;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String estado;
    private Long id_endereco; // Adicionado para armazenar o ID do endereço

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }

    public String getRua() { return rua; }
    public void setRua(String rua) { this.rua = rua; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }

    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Long getIdEndereco() { return id_endereco; } // Getter para id_endereco
    public void setIdEndereco(Long id_endereco) { this.id_endereco = id_endereco; } // Setter para id_endereco
}
