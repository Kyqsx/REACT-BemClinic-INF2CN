package com.bemclinicinf2cn.api.request;

import java.time.LocalDate;
import java.time.LocalTime;

public class ConsultaRequest {
    private Long pacienteId;
    private Long medicoId;
    private LocalDate dataPreferencia;
    private LocalTime horarioPreferencia;
    private String localPreferencia;
    private String especialidade;
    private String observacoes;

    // Getters e Setters
    public Long getPacienteId() {
        return pacienteId;
    }

    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
    }

    public Long getMedicoId() {
        return medicoId;
    }

    public void setMedicoId(Long medicoId) {
        this.medicoId = medicoId;
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
}
