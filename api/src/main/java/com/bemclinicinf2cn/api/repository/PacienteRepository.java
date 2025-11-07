package com.bemclinicinf2cn.api.repository;

import com.bemclinicinf2cn.api.dto.PacienteDTO;
import com.bemclinicinf2cn.api.domain.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    Optional<Paciente> findByEmail(String email);
    Optional<Paciente> findByCpf(String cpf);

    @Query("SELECT c FROM Paciente c WHERE c.email = :email OR c.cpf = :cpf")
    Optional<Paciente> findByEmailOrCpf(@Param("email") String email, @Param("cpf") String cpf);

    // ✅ Corrigido: passando null para ids_pedidos
    @Query("SELECT new com.bemclinicinf2cn.api.dto.PacienteDTO(c.id, c.email, c.senha, c.foto, c.nome, c.cpf, c.rg, c.id_endereco) FROM Paciente c")
    List<PacienteDTO> findAllBasic();

    // ✅ Corrigido: ordem dos parâmetros conforme construtor do DTO
    @Query("SELECT new com.bemclinicinf2cn.api.dto.PacienteDTO(c.id, c.email, c.senha, c.foto, c.nome, c.cpf, c.rg, c.id_endereco) FROM Paciente c WHERE c.id = :id")
    Optional<PacienteDTO> findBasicById(@Param("id") Long id);
}