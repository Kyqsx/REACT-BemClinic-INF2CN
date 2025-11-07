package com.bemclinicinf2cn.api.repository;

import com.bemclinicinf2cn.api.domain.Consulta;
import com.bemclinicinf2cn.api.domain.Consulta.StatusConsulta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    
    // Buscar consultas por status
    List<Consulta> findByStatus(StatusConsulta status);
    
    // Buscar consultas por paciente
    List<Consulta> findByPacienteId(Long pacienteId);
    
    // Buscar consultas por médico
    List<Consulta> findByMedicoId(Long medicoId);
    
    // Buscar consultas pendentes ordenadas por data de criação
    List<Consulta> findByStatusOrderByDataCriacaoDesc(StatusConsulta status);
    
    // Buscar consultas por hospital
    List<Consulta> findByIdHospitalAceito(Long idHospital);
}
