package com.bemclinicinf2cn.api.domain;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity
@Table(name = "lembretes")
public class Lembrete {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @JsonProperty("id_usuario")
    @Column(name = "id_usuario", nullable = false)
    private Long id_usuario;

    @JsonProperty("titulo_lembrete")
    @Column(name = "titulo_lembrete", nullable = false, length = 200)
    private String titulo_lembrete;

    @JsonProperty("data_lembrete")
    @Column(name = "data_lembrete", nullable = false)
    private LocalDate data_lembrete;

    @JsonProperty("hora_lembrete")
    @Column(name = "hora_lembrete", nullable = false)
    private LocalTime hora_lembrete;

    @JsonProperty("nome_paciente")
    @Column(name = "nome_paciente", nullable = false, length = 200)
    private String nome_paciente;

    @JsonProperty("local_lembrete")
    @Column(name = "local_lembrete", nullable = false)
    private String local_lembrete;

    @JsonProperty("status_lembrete")
    @Column(name = "status_lembrete", nullable = false)
    private String status_lembrete;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdUsuario(){
        return id_usuario;
    }

    public void setIdUsuario(Long id_usuario){
        this.id_usuario = id_usuario;
    }

    public String getTituloLembrete(){ return titulo_lembrete;
    }
    public void setTituloLembrete(String titulo_lembrete){
        this.titulo_lembrete = titulo_lembrete;
    }

    public LocalDate getDataLembrete() {
        return data_lembrete;
    }
    public void setDataLembrete(LocalDate data_lembrete) {
        this.data_lembrete = data_lembrete;
    }

    public LocalTime getHoraLembrete() {
        return hora_lembrete;
    }
    public void setHoraLembrete(LocalTime hora_lembrete) {
        this.hora_lembrete = hora_lembrete;
    }

    public String getNomePaciente() {return nome_paciente;}
    public void setNomePaciente(String nome_paciente) {this.nome_paciente = nome_paciente;}

    public String getLocalLembrete() {
        return local_lembrete;
    }
    public void setLocalLembrete(String local_lembrete) {
        this.local_lembrete = local_lembrete;
    }

    public String getStatusLembrete() {
        return status_lembrete;
    }
    public void setStatusLembrete(String status_lembrete) {
        this.status_lembrete = status_lembrete;
    }
}