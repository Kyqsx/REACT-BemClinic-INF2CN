package com.bemclinicinf2cn.api.domain;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity
@Table(name = "categoria_artigo")
public class CategoriaArtigo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // mesmo nome da coluna no banco
    private Long id;

    @JsonProperty("nome_categoria")
    @Column(name = "nome_categoria", nullable = false, length = 20)
    private String nome_categoria;

    @JsonProperty("descricao_categoria")
    @Column(name = "descricao_categoria", nullable = false, length = 100)
    private String descricao_categoria;

    @JsonProperty("ativo")
    @Column(name = "ativo", nullable = false)
    private Boolean ativo; 

    @CreationTimestamp
    @JsonProperty("data_criacao")
    @Column(name = "data_criacao", updatable = false)
    private LocalDateTime data_criacao;

    @UpdateTimestamp
    @JsonProperty("data_atualizacao")
    @Column(name = "data_atualizacao") 
    private LocalDateTime data_atualizacao;

    // Getters e Setters

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getNome_categoria() {
        return nome_categoria;
    }
    public void setNome_categoria(String nome_categoria) {
        this.nome_categoria = nome_categoria;
    }

    public String getDescricao_categoria() {
        return descricao_categoria;
    }
    public void setDescricao_categoria(String descricao_categoria) {
        this.descricao_categoria = descricao_categoria;
    }

    public Boolean getAtivo() {
        return ativo;
    }
    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public java.time.LocalDateTime getData_criacao() {
        return data_criacao;
    }
    public void setData_criacao(java.time.LocalDateTime data_criacao) {
        this.data_criacao = data_criacao;
    }
    public java.time.LocalDateTime getData_atualizacao() {
        return data_atualizacao;
    }
    public void setData_atualizacao(java.time.LocalDateTime data_atualizacao) {
        this.data_atualizacao = data_atualizacao;
    }
}
