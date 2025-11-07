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

import com.bemclinicinf2cn.api.domain.Lembrete;
import com.bemclinicinf2cn.api.service.LembretesService;

@RestController
@RequestMapping("/api/v1/lembretes")
public class LembretesController {

    @Autowired
    private LembretesService service;

    // Listar todos os lembretes
    @GetMapping
    public ResponseEntity<List<Lembrete>> listarLembretes() {
        List<Lembrete> lembretes = service.listarLembretes();
        return new ResponseEntity<>(lembretes, HttpStatus.OK);
    }

    // Incluir novo lembrete
    @PostMapping("/create")
    public ResponseEntity<Lembrete> incluir(@RequestBody Lembrete lembrete) {
        try {
            Lembrete novoLembrete = service.incluir(lembrete);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoLembrete);
        } catch (Exception e) {
            // Você pode adicionar um log aqui para depuração
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Excluir lembrete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        try {
            service.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lembrete> atualizar(@PathVariable Long id, @RequestBody Lembrete lembrete) {
        Lembrete lembreteAtualizado = service.atualizar(id, lembrete);
        return lembreteAtualizado != null
                ? ResponseEntity.ok(lembreteAtualizado)
                : ResponseEntity.notFound().build();
    }
    
}
