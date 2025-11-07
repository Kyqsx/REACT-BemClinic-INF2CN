package com.bemclinicinf2cn.api.dto;

public class PacienteDTO {
    private Long id_paciente;
    private String nome;
    private String email;
    private String cpf;
    private String rg;
    private String senha;
    private byte[] foto;
    private Long id_endereco;

    public PacienteDTO(Long id_paciente, String email, String senha, byte[] foto, String nome, String cpf, String rg, Long id_endereco) {
        this.id_paciente = id_paciente;
        this.email = email;
        this.senha = senha;
        this.foto = foto;
        this.nome = nome;
        this.cpf = cpf;
        this.rg = rg;
        this.id_endereco = id_endereco;
    }

    public Long getId_paciente() {
        return id_paciente;
    }

    public void setId_paciente(Long id_paciente) {
        this.id_paciente = id_paciente;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getRg(){
        return rg;
    }
    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public byte[] getFoto() {
        return foto;
    }

    public void setFoto(byte[] foto) {
        this.foto = foto;
    }

    public Long getId_endereco() {
        return id_endereco;
    }

    public void setId_endereco(Long id_endereco) {
        this.id_endereco = id_endereco;
    }

}