package com.bemclinicinf2cn.api.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "Usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_usuario")
    private Long id;

    @Column(name = "Email", unique = true, nullable = false, length = 200)
    private String email;

    @Column(name = "Senha", nullable = false, length = 255)
    private String senha;

    @Column(name = "Tipo", nullable = false, length = 20)
    private String tipo;

    @Column(name = "Id_paciente")
    private Long idPaciente;

    @Column(name = "Id_medico")
    private Long idMedico;

    @Column(name = "Id_hospital")
    private Long idHospital;

    // Construtores
    public Usuario() {}

    public Usuario(String email, String senha, String tipo) {
        this.email = email;
        this.senha = senha;
        this.tipo = tipo;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Long getIdPaciente() {
        return idPaciente;
    }

    public void setIdPaciente(Long idPaciente) {
        this.idPaciente = idPaciente;
    }

    public Long getIdMedico() {
        return idMedico;
    }

    public void setIdMedico(Long idMedico) {
        this.idMedico = idMedico;
    }

    public Long getIdHospital() {
        return idHospital;
    }

    public void setIdHospital(Long idHospital) {
        this.idHospital = idHospital;
    }

    public boolean isPaciente() {
        return "PACIENTE".equalsIgnoreCase(tipo);
    }

    public boolean isMedico() {
        return "MEDICO".equalsIgnoreCase(tipo);
    }

    public boolean isHospital() {
        return "HOSPITAL".equalsIgnoreCase(tipo);
    }

    public boolean isAdmin() {
        return "ADMIN".equalsIgnoreCase(tipo);
    }
}