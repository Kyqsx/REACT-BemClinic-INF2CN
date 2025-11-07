package com.bemclinicinf2cn.api.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.bemclinicinf2cn.api.domain.CategoriaArtigo;

@Repository
public interface CategoriaArtigoRepository extends CrudRepository<CategoriaArtigo, Long> {
    
}