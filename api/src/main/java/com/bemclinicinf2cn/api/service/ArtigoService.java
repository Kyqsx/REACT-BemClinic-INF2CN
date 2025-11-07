package com.bemclinicinf2cn.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bemclinicinf2cn.api.domain.Artigo;
import com.bemclinicinf2cn.api.repository.ArtigoRepository;

@Service
public class ArtigoService {
    @Autowired
    private ArtigoRepository repository;

    public List<Artigo> listarArtigos(){
        return (List<Artigo>)repository.findAll();
    }

    public Artigo incluir(Artigo artigo){
        return repository.save(artigo);
    }

    public void excluir(Long id){
        if(repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            throw new RuntimeException("Artigo com ID " + id + " não encontrado!");
        }
    }

    public Artigo atualizar(Long id, Artigo artigo) {
        if (repository.existsById(id)) {
            artigo.setId(id);
            return repository.save(artigo);
        } else {
            throw new RuntimeException("Artigo com ID " + id + " não encontrado!");
        }
    }
}
