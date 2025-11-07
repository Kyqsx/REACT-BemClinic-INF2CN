package com.bemclinicinf2cn.api.repository;

import com.bemclinicinf2cn.api.domain.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    
    Optional<Hospital> findByCnpj(String cnpj);
    
    Optional<Hospital> findByEmail(String email);
    
    boolean existsByCnpj(String cnpj);
}
