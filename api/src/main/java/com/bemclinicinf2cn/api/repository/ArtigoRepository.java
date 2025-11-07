package com.bemclinicinf2cn.api.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bemclinicinf2cn.api.domain.Artigo;

@Repository
public interface ArtigoRepository extends CrudRepository<Artigo, Long> {
    
}
