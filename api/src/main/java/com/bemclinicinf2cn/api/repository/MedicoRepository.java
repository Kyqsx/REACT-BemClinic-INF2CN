package com.bemclinicinf2cn.api.repository;

import com.bemclinicinf2cn.api.domain.Medico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicoRepository extends JpaRepository<Medico, Long> {

    Optional<Medico> findByEmail(String email);
    Optional<Medico> findByCpf(String cpf);
    Optional<Medico> findByCrm(String crm);

    @Query("SELECT m FROM Medico m WHERE m.email = :email OR m.cpf = :cpf")
    Optional<Medico> findByEmailOrCpf(@Param("email") String email, @Param("cpf") String cpf);

    // Buscar médicos por hospital
    @Query("SELECT m FROM Medico m WHERE m.hospitalId = :hospitalId")
    List<Medico> findByHospitalId(@Param("hospitalId") Long hospitalId);

    // Buscar médicos por especialidade
    @Query("SELECT m FROM Medico m WHERE m.especialidade = :especialidade")
    List<Medico> findByEspecialidade(@Param("especialidade") String especialidade);

    // Buscar médicos ativos
    @Query("SELECT m FROM Medico m WHERE m.ativo = true")
    List<Medico> findByAtivoTrue();

    // Buscar médicos ativos por hospital
    @Query("SELECT m FROM Medico m WHERE m.hospitalId = :hospitalId AND m.ativo = true")
    List<Medico> findByHospitalIdAndAtivoTrue(@Param("hospitalId") Long hospitalId);

    // Buscar médicos por hospital e especialidade
    @Query("SELECT m FROM Medico m WHERE m.hospitalId = :hospitalId AND m.especialidade = :especialidade")
    List<Medico> findByHospitalIdAndEspecialidade(@Param("hospitalId") Long hospitalId, @Param("especialidade") String especialidade);

    // Contar médicos por hospital
    @Query("SELECT COUNT(m) FROM Medico m WHERE m.hospitalId = :hospitalId")
    Long countByHospitalId(@Param("hospitalId") Long hospitalId);

    // Buscar médicos por endereço
    @Query("SELECT m FROM Medico m WHERE m.idEndereco = :idEndereco")
    List<Medico> findByIdEndereco(@Param("idEndereco") Long idEndereco);

    // Verificar se CRM já existe
    @Query("SELECT COUNT(m) > 0 FROM Medico m WHERE m.crm = :crm AND m.id != :id")
    Boolean existsByCrmAndIdNot(@Param("crm") String crm, @Param("id") Long id);

    // Verificar se email já existe
    @Query("SELECT COUNT(m) > 0 FROM Medico m WHERE m.email = :email AND m.id != :id")
    Boolean existsByEmailAndIdNot(@Param("email") String email, @Param("id") Long id);
}