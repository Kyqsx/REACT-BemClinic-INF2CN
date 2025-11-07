package com.bemclinicinf2cn.api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bemclinicinf2cn.api.domain.CategoriaArtigo;
import com.bemclinicinf2cn.api.repository.CategoriaArtigoRepository;

@Service
public class CategoriaArtigoService {
    @Autowired
    private CategoriaArtigoRepository repository;

    // Listar todas as categorias
    public List<CategoriaArtigo> listarTodos() {
        return (List<CategoriaArtigo>) repository.findAll();
    }

    // Salvar nova categoria
    public CategoriaArtigo salvar(CategoriaArtigo categoria) {
        return repository.save(categoria);
    }

    // Buscar categoria por ID
    public Optional<CategoriaArtigo> buscarPorId(Long id) {
        return repository.findById(id);
    }

    // Deletar categoria por ID
    public void deletar(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            throw new RuntimeException("CategoriaArtigo com ID " + id + " não encontrada!");
        }
    }
}
