package com.bemclinicinf2cn.api.dto;

import com.bemclinicinf2cn.api.domain.Consulta;

import java.time.LocalDate;
import java.time.LocalTime;

public class ConsultaResponseDTO {
    private Long id;
    private Long pacienteId;
    private String pacienteNome;
    private Long medicoId;
    private String medicoNome;
    private LocalDate dataPreferencia;
    private LocalTime horarioPreferencia;
    private String localPreferencia;
    private String especialidade;
    private String observacoes;
    private String status;
    private Long idHospitalAceito;
    private LocalDate dataCriacao;

    public ConsultaResponseDTO(Consulta consulta) {
        this.id = consulta.getId();
        this.pacienteId = consulta.getPaciente().getId();
        this.pacienteNome = consulta.getPaciente().getNome();
        this.medicoId = consulta.getMedico() != null ? consulta.getMedico().getId() : null;
        this.medicoNome = consulta.getMedico() != null ? consulta.getMedico().getNome() : null;
        this.dataPreferencia = consulta.getDataPreferencia();
        this.horarioPreferencia = consulta.getHorarioPreferencia();
        this.localPreferencia = consulta.getLocalPreferencia();
        this.especialidade = consulta.getEspecialidade();
        this.observacoes = consulta.getObservacoes();
        this.status = consulta.getStatus().name();
        this.idHospitalAceito = consulta.getIdHospitalAceito();
        this.dataCriacao = consulta.getDataCriacao();
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPacienteId() {
        return pacienteId;
    }

    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
    }

    public String getPacienteNome() {
        return pacienteNome;
    }

    public void setPacienteNome(String pacienteNome) {
        this.pacienteNome = pacienteNome;
    }

    public Long getMedicoId() {
        return medicoId;
    }

    public void setMedicoId(Long medicoId) {
        this.medicoId = medicoId;
    }

    public String getMedicoNome() {
        return medicoNome;
    }

    public void setMedicoNome(String medicoNome) {
        this.medicoNome = medicoNome;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
}
