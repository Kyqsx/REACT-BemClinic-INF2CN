package com.bemclinicinf2cn.api.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "Consulta")
public class Consulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_consulta")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "Id_paciente", nullable = false)
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "Id_medico")
    private Medico medico;

    @Column(name = "Data_preferencia", nullable = false)
    private LocalDate dataPreferencia;

    @Column(name = "Horario_preferencia", nullable = false)
    private LocalTime horarioPreferencia;

    @Column(name = "Local_preferencia", length = 200)
    private String localPreferencia;

    @Column(name = "Especialidade", length = 100)
    private String especialidade;

    @Column(name = "Observacoes", length = 500)
    private String observacoes;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false, length = 20)
    private StatusConsulta status;

    @Column(name = "Id_hospital_aceito")
    private Long idHospitalAceito;

    @Column(name = "Data_criacao", nullable = false)
    private LocalDate dataCriacao;

    @Column(name = "Data_atualizacao")
    private LocalDate dataAtualizacao;

    // Enum para status da consulta
    public enum StatusConsulta {
        PENDENTE,
        ACEITA,
        RECUSADA,
        CANCELADA
    }

    // Construtores
    public Consulta() {
        this.status = StatusConsulta.PENDENTE;
        this.dataCriacao = LocalDate.now();
    }

    public Consulta(Paciente paciente, LocalDate dataPreferencia, LocalTime horarioPreferencia, 
                    String localPreferencia, String especialidade, String observacoes) {
        this();
        this.paciente = paciente;
        this.dataPreferencia = dataPreferencia;
        this.horarioPreferencia = horarioPreferencia;
        this.localPreferencia = localPreferencia;
        this.especialidade = especialidade;
        this.observacoes = observacoes;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public Medico getMedico() {
        return medico;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }

    public LocalDate getDataPreferencia() {
        return dataPreferencia;
    }

    public void setDataPreferencia(LocalDate dataPreferencia) {
        this.dataPreferencia = dataPreferencia;
    }

    public LocalTime getHorarioPreferencia() {
        return horarioPreferencia;
    }

    public void setHorarioPreferencia(LocalTime horarioPreferencia) {
        this.horarioPreferencia = horarioPreferencia;
    }

    public String getLocalPreferencia() {
        return localPreferencia;
    }

    public void setLocalPreferencia(String localPreferencia) {
        this.localPreferencia = localPreferencia;
    }

    public String getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public StatusConsulta getStatus() {
        return status;
    }

    public void setStatus(StatusConsulta status) {
        this.status = status;
        this.dataAtualizacao = LocalDate.now();
    }

    public Long getIdHospitalAceito() {
        return idHospitalAceito;
    }

    public void setIdHospitalAceito(Long idHospitalAceito) {
        this.idHospitalAceito = idHospitalAceito;
    }

    public LocalDate getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDate dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public LocalDate getDataAtualizacao() {
        return dataAtualizacao;
    }

    public void setDataAtualizacao(LocalDate dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }
}
