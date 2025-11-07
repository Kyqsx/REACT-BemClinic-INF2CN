package com.bemclinicinf2cn.api.domain;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity
@Table(name = "Vacina")
public class Vacina {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    @Column(name = "id")
    private Long id;

    @JsonProperty("id_usuario")
    @Column(name = "id_usuario", nullable = false)
    private Long id_usuario;

    @JsonProperty("nome_vacina")
    @Column(name = "nome_vacina", nullable = false, length = 255)
    private String nome_vacina;

    @JsonProperty("data_vacina")
    @Column(name = "data_vacina", nullable = false)
    private LocalDate data_vacina;

    @Column(name = "dose", nullable = false, length = 255)
    private String dose;

    @JsonProperty("local_vacina")
    @Column(name = "local_vacina", nullable = false, length = 255)
    private String local_vacina;

    @Column(name = "observacao", length = 255)
    private String observacao;

    // Getters e Setters

    public Long getId(){
        return id;
    }
    public void setId(Long id){
        this.id = id;
    }

    public Long getIdUsuario(){
        return id_usuario;
    }
    public void setIdUsuario(Long id_usuario){
        this.id_usuario = id_usuario;
    }

    public String getNomeVacina(){
        return nome_vacina;
    }
    public void setNomeVacina(String nome_vacina){
        this.nome_vacina = nome_vacina;
    }

    public LocalDate getDataVacina(){
        return data_vacina;
    }
    public void setDataVacina(LocalDate data_vacina){
        this.data_vacina = data_vacina;
    }

    public String getDose(){
        return dose;
    }
    public void setDose(String dose){
        this.dose = dose;
    }

    public String getLocalVacina(){
        return local_vacina;
    }
    public void setLocalVacina(String local_vacina){
        this.local_vacina = local_vacina;
    }

    public String getObservacao(){
        return observacao;
    }
    public void setObservacao(String observacao){
        this.observacao = observacao;
    }
}
