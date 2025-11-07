package com.bemclinicinf2cn.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bemclinicinf2cn.api.domain.Artigo;
import com.bemclinicinf2cn.api.service.ArtigoService;

@RestController
@RequestMapping("/api/v1/artigos")
public class ArtigoController {
    @Autowired
    private ArtigoService service;

    // Listar todas as consultas
    @GetMapping
    public ResponseEntity<List<Artigo>> listarArtigos() {
        List<Artigo> artigos = service.listarArtigos();
        return new ResponseEntity<>(artigos, HttpStatus.OK);
    }

    // Incluir nova consulta
    @PostMapping("/create")
    public ResponseEntity<Artigo> incluir(@RequestBody Artigo artigo) {
        try {
            Artigo novoArtigo = service.incluir(artigo);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoArtigo);
        } catch (Exception e) {
            // Você pode adicionar um log aqui para depuração
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public Artigo atualizar(@PathVariable Long id, @RequestBody Artigo artigo) {
        artigo.setId(id); // garante que vai atualizar a artigo correta
        return service.incluir(artigo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        try {
            service.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
