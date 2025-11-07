package com.bemclinicinf2cn.api.domain;

import java.time.LocalDate;

import jakarta.persistence.*;


@Entity
@Table(name = "Paciente")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_paciente")
    private Long id;

    @Column(name = "Email", nullable = false, unique = true, length = 200)
    private String email;

    @Column(name = "Senha", nullable = false, length = 255)
    private String senha;

    @Column(name = "foto")
    private byte[] foto;

    @Column(name = "Nome", nullable = false, length = 200)
    private String nome;
    
    @Column(name = "Cpf", nullable = true, unique = true, length = 14)
    private String cpf;

    @Column(name = "Telefone", nullable = true, length = 15)
    private String telefone;

    @Column(name = "Rg", nullable = true, unique = true, length = 20)
    private String rg;

    @Column(name = "Data_nascimento", nullable = true)
    private LocalDate dataNascimento;

    @Column(name = "Sexo", nullable = true, length = 40)
    private String sexo;

    @Column(name = "Nome_mae", nullable = true, length = 200)
    private String nomeMae;

    @Column(name = "Nome_pai", nullable = true, length = 200)
    private String nomePai;

    @Column(name = "Tipo_sanguineo", nullable = true, length = 4)
    private String tipoSanguineo;

    @Column(name = "id_endereco")
    private Long id_endereco;

    // Getters e Setters
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
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

    public String getTelefone() {
        return telefone;
    }
    public void setTelefone(String telefone) {
        this.telefone = telefone;
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
    public String getCpf() {
        return cpf;
    }
    public void setCpf(String cpf) {
        this.cpf = cpf;
    }
    public String getRg() {
        return rg;
    }
    public void setRg(String rg) {
        this.rg = rg;
    }
    public LocalDate getDataNascimento() {
        return dataNascimento;
    }
    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }
    public String getSexo() {
        return sexo;
    }
    public void setSexo(String sexo) {
        this.sexo = sexo;
    }
    public String getNomeMae() {
        return nomeMae;
    }
    public void setNomeMae(String nomeMae) {
        this.nomeMae = nomeMae;
    }
    public String getNomePai() {
        return nomePai;
    }
    public void setNomePai(String nomePai) {
        this.nomePai = nomePai;
    }
    public String getTipoSanguineo() {
        return tipoSanguineo;
    }
    public void setTipoSanguineo(String tipoSanguineo) {
        this.tipoSanguineo = tipoSanguineo;
    }
    public Long getIdEndereco(){
        return id_endereco;
    }
    public void setIdEndereco(Long id_endereco){
        this.id_endereco = id_endereco;
    }
}