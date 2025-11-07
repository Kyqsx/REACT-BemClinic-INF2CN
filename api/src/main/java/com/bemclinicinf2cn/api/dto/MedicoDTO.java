package com.bemclinicinf2cn.api.dto;


public class MedicoDTO {
    private Long id_medico;
    private String nome;
    private String cargo;
    private String email;
    private String cpf;
    private float salario;
    private Long id_endereco;
    private String foto;

    // ✅ Construtor para queries SEM CPF (findAllBasic e findBasicById)
    public MedicoDTO(Long id_medico, String nome, String cargo,
                          String email, float salario,
                          Long id_endereco, String foto) {
        this.id_medico = id_medico;
        this.nome = nome;
        this.cargo = cargo;
        this.email = email;
        this.salario = salario;
        this.id_endereco = id_endereco;
        this.foto = foto;
        this.cpf = ""; // valor padrão
    }

    // ✅ Construtor para queries COM CPF (findCompleteById)
    public MedicoDTO(Long id_medico, String nome, String cargo,
                          String email, String cpf, float salario,
                          Long id_endereco, String foto) {
        this.id_medico = id_medico;
        this.nome = nome;
        this.cargo = cargo;
        this.email = email;
        this.cpf = cpf;
        this.salario = salario;
        this.id_endereco = id_endereco;
        this.foto = foto;
    }

    // Getters e Setters
    public Long getId_Medico() { return id_medico; }
    public void setId_Medico(Long id_medico) { this.id_medico = id_medico; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCargo() { return cargo; }
    public void setCargo(String cargo) { this.cargo = cargo; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public float getSalario() { return salario; }
    public void setSalario(float salario) { this.salario = salario; }

    public Long getId_endereco() { return id_endereco; }
    public void setId_endereco(Long id_endereco) { this.id_endereco = id_endereco; }

    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
}