package com.bemclinicinf2cn.api.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "Hospital")
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_hospital")
    private Long id;

    @Column(name = "Nome", nullable = false, length = 200)
    private String nome;

    @Column(name = "CNPJ", unique = true, nullable = false, length = 18)
    private String cnpj;

    @Column(name = "Razao_social", length = 200)
    private String razaoSocial;

    @Column(name = "Telefone", length = 20)
    private String telefone;

    @Column(name = "Email", length = 200)
    private String email;

    @Column(name = "Tipo_estabelecimento", length = 100)
    private String tipoEstabelecimento; // Hospital, Clínica, UPA, Posto de Saúde, etc.

    @Column(name = "Especialidades", length = 500)
    private String especialidades; // Lista de especialidades atendidas

    @Column(name = "Horario_funcionamento", length = 100)
    private String horarioFuncionamento; // Ex: "24 horas", "8h às 18h", etc.

    @Column(name = "Atendimento_emergencia")
    private Boolean atendimentoEmergencia;

    @Column(name = "Numero_leitos")
    private Integer numeroLeitos;

    @Column(name = "Diretor_responsavel", length = 200)
    private String diretorResponsavel;

    @Column(name = "Cnes", length = 20) // Cadastro Nacional de Estabelecimentos de Saúde
    private String cnes;

    @ManyToOne
    @JoinColumn(name = "Id_endereco")
    private Endereco endereco;

    @Column(name = "Observacoes", length = 1000)
    private String observacoes;

    // Construtores
    public Hospital() {}

    public Hospital(String nome, String cnpj, String razaoSocial, String telefone, String email) {
        this.nome = nome;
        this.cnpj = cnpj;
        this.razaoSocial = razaoSocial;
        this.telefone = telefone;
        this.email = email;
    }

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

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getRazaoSocial() {
        return razaoSocial;
    }

    public void setRazaoSocial(String razaoSocial) {
        this.razaoSocial = razaoSocial;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTipoEstabelecimento() {
        return tipoEstabelecimento;
    }

    public void setTipoEstabelecimento(String tipoEstabelecimento) {
        this.tipoEstabelecimento = tipoEstabelecimento;
    }

    public String getEspecialidades() {
        return especialidades;
    }

    public void setEspecialidades(String especialidades) {
        this.especialidades = especialidades;
    }

    public String getHorarioFuncionamento() {
        return horarioFuncionamento;
    }

    public void setHorarioFuncionamento(String horarioFuncionamento) {
        this.horarioFuncionamento = horarioFuncionamento;
    }

    public Boolean getAtendimentoEmergencia() {
        return atendimentoEmergencia;
    }

    public void setAtendimentoEmergencia(Boolean atendimentoEmergencia) {
        this.atendimentoEmergencia = atendimentoEmergencia;
    }

    public Integer getNumeroLeitos() {
        return numeroLeitos;
    }

    public void setNumeroLeitos(Integer numeroLeitos) {
        this.numeroLeitos = numeroLeitos;
    }

    public String getDiretorResponsavel() {
        return diretorResponsavel;
    }

    public void setDiretorResponsavel(String diretorResponsavel) {
        this.diretorResponsavel = diretorResponsavel;
    }

    public String getCnes() {
        return cnes;
    }

    public void setCnes(String cnes) {
        this.cnes = cnes;
    }

    public Endereco getEndereco() {
        return endereco;
    }

    public void setEndereco(Endereco endereco) {
        this.endereco = endereco;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
}
