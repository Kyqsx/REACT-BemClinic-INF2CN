package com.bemclinicinf2cn.api.domain;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity
@Table(name = "artigo")
public class Artigo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @JsonProperty("titulo")
    @Column(name = "titulo", nullable = false, length = 255)
    private String titulo;

    @JsonProperty("descricao")
    @Column(name = "descricao", nullable = false, length = 255)
    private String descricao;

    @JsonProperty("conteudo")
    @Lob
    @Column(name = "conteudo", nullable = false)
    private String conteudo;

    @JsonProperty("imagem")
    @Lob
    @Column(name = "imagem", nullable = true)
    private String imagem;

    @JsonProperty("data_criacao")
    @CreationTimestamp
    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime data_criacao;

    @JsonProperty("data_atualizacao")
    @UpdateTimestamp
    @Column(name = "data_atualizacao", nullable = false)
    private LocalDateTime data_atualizacao;

    @JsonProperty("ativo")
    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

    @JsonProperty("id_categoria")
    @Column(name = "id_categoria", nullable = false)
    private Long id_categoria;

    // Getters and Setters

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getConteudo() {
        return conteudo;
    }
    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }

    public String getImagem() {
        return imagem;
    }
    public void setImagem(String imagem) {
        this.imagem = imagem;
    }

    public LocalDateTime getDataCriacao() {
        return data_criacao;
    }
    public void setDataCriacao(LocalDateTime data_criacao) {
        this.data_criacao = data_criacao;
    }

    public LocalDateTime getDataAtualizacao() {
        return data_atualizacao;
    }
    public void setDataAtualizacao(LocalDateTime data_atualizacao) {
        this.data_atualizacao = data_atualizacao;
    }

    public Boolean getAtivo() {
        return ativo;
    }
    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public Long getIdCategoria() {
        return id_categoria;
    }
    public void setIdCategoria(Long id_categoria) {
        this.id_categoria = id_categoria;
    }
}