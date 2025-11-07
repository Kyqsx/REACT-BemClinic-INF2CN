package com.bemclinicinf2cn.api.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "Medico")
@Data
public class Medico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_medico")
    private Long id;

    @Column(name = "Nome", nullable = false, length = 100)
    private String nome;

    @Column(name = "Cpf", nullable = false, unique = true, length = 14)
    private String cpf;

    @Column(name = "Rg", nullable = false, length = 20)
    private String rg;

    @Column(name = "Email", nullable = false, unique = true, length = 200)
    private String email;

    @Column(name = "Telefone", nullable = false, length = 15)
    private String telefone;

    @Column(name = "Crm", nullable = false, unique = true, length = 20)
    private String crm;

    @Column(name = "Especialidade", nullable = false, length = 50)
    private String especialidade;

    @Column(name = "Senha", nullable = false)
    private String senha;

    @Column(name = "Id_endereco")
    private Long idEndereco;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Id_endereco", insertable = false, updatable = false)
    @JsonIgnore
    private Endereco enderecoObj;

    @Column(name = "Data_formatura")
    private LocalDate dataFormatura;

    @Column(name = "Ativo", nullable = false)
    private Boolean ativo = true;

    @Column(name = "Hospital_id")
    private Long hospitalId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Hospital_id", insertable = false, updatable = false)
    @JsonIgnore
    private Hospital hospital;

    @Column(name = "foto", columnDefinition = "TEXT")
    private String foto;

    // Métodos auxiliares
    public void setHospital(Hospital hospital) {
        this.hospital = hospital;
        if (hospital != null) {
            this.hospitalId = hospital.getId();
        }
    }

    public void setEnderecoObj(Endereco endereco) {
        this.enderecoObj = endereco;
        if (endereco != null) {
            this.idEndereco = endereco.getId_endereco();
        }
    }
}