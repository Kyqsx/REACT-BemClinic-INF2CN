package com.bemclinicinf2cn.api.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bemclinicinf2cn.api.domain.CategoriaArtigo;
import com.bemclinicinf2cn.api.service.CategoriaArtigoService;

@RestController
@RequestMapping("/api/v1/categoria-artigos")
public class CategoriaArtigoController {
    @Autowired
    private CategoriaArtigoService service;

    // Listar todas as categorias
    @GetMapping
    public List<CategoriaArtigo> listar() {
        return service.listarTodos();
    }

    // Buscar categoria por ID
    @GetMapping("/{id}")
    public Optional<CategoriaArtigo> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    // Criar nova categoria
    @PostMapping("/create")
    public CategoriaArtigo criar(@RequestBody CategoriaArtigo categoria) {
        return service.salvar(categoria);
    }

    // Atualizar categoria existente
    @PutMapping("/{id}")
    public CategoriaArtigo atualizar(@PathVariable Long id, @RequestBody CategoriaArtigo categoria) {
        categoria.setId(id); // garante que vai atualizar a categoria correta
        return service.salvar(categoria);
    }

    // Deletar categoria pelo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.ok("CategoriaArtigo deletada com sucesso!");
    }
}

