package com.bemclinicinf2cn.api.dto;

import java.time.LocalDate;

public class VacinaDTO {
    private Long id;
    private Long id_usuario;
    private String nome_vacina;
    private LocalDate data_vacina;
    private String dose;
    private String local_vacina;
    private String observacao;

    public VacinaDTO(Long id, Long id_usuario, String nome_vacina, LocalDate data_vacina, String dose, String local_vacina, String observacao){
        this.id = id;
        this.id_usuario = id_usuario;
        this.nome_vacina = nome_vacina;
        this.data_vacina = data_vacina;
        this.dose = dose;
        this.local_vacina = local_vacina;
        this.observacao = observacao;
    }
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
