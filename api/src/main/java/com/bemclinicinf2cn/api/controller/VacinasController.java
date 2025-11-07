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

import com.bemclinicinf2cn.api.domain.Vacina;
import com.bemclinicinf2cn.api.service.VacinasService;

@RestController
@RequestMapping("/api/v1/vacinas")
public class VacinasController {

    @Autowired
    private VacinasService service;

    // Listar todos as vacinas
    @GetMapping("/listall")
    public ResponseEntity<List<Vacina>> listarVacinas() {
        List<Vacina> vacinas = service.listarVacinas();
        return new ResponseEntity<>(vacinas, HttpStatus.OK);
    }

    // Incluir nova vacina
    @PostMapping("/create")
    public ResponseEntity<Vacina> incluir(@RequestBody Vacina vacina) {
        try {
            Vacina novaVacina = service.incluir(vacina);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaVacina);
        } catch (Exception e) {
            // Você pode adicionar um log aqui para depuração
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Excluir vacina
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
    public ResponseEntity<Vacina> atualizar(@PathVariable Long id, @RequestBody Vacina vacina) {
        Vacina vacinaAtualizada = service.atualizar(id, vacina);
        return vacinaAtualizada != null
                ? ResponseEntity.ok(vacinaAtualizada)
                : ResponseEntity.notFound().build();
    }
    
}
