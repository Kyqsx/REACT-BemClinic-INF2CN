package com.bemclinicinf2cn.api.controller;

import com.bemclinicinf2cn.api.domain.Hospital;
import com.bemclinicinf2cn.api.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/hospitais")
@CrossOrigin(origins = "*")
public class HospitalController {

    @Autowired
    private HospitalService hospitalService;

    @GetMapping
    public ResponseEntity<List<Hospital>> listarTodos() {
        List<Hospital> hospitais = hospitalService.listarTodos();
        return ResponseEntity.ok(hospitais);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hospital> buscarPorId(@PathVariable Long id) {
        Optional<Hospital> hospital = hospitalService.buscarPorId(id);
        return hospital.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Hospital> criar(@RequestBody Hospital hospital) {
        try {
            Hospital novoHospital = hospitalService.criar(hospital);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoHospital);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hospital> atualizar(@PathVariable Long id, @RequestBody Hospital hospital) {
        try {
            Hospital hospitalAtualizado = hospitalService.atualizar(id, hospital);
            return ResponseEntity.ok(hospitalAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            hospitalService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/cnpj/{cnpj}")
    public ResponseEntity<Hospital> buscarPorCnpj(@PathVariable String cnpj) {
        Optional<Hospital> hospital = hospitalService.buscarPorCnpj(cnpj);
        return hospital.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Hospital> buscarPorEmail(@PathVariable String email) {
        Optional<Hospital> hospital = hospitalService.buscarPorEmail(email);
        return hospital.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/redefinir-senha")
    public ResponseEntity<?> redefinirSenha(@PathVariable Long id) {
        try {
            String novaSenha = hospitalService.redefinirSenha(id);
            return ResponseEntity.ok(new RedefinirSenhaResponse(
                    "Senha redefinida com sucesso",
                    novaSenha,
                    "A senha foi redefinida para o CNPJ sem pontuação. O hospital deve alterar a senha no primeiro acesso."
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // Classes auxiliares para resposta
    static class RedefinirSenhaResponse {
        public String mensagem;
        public String senhaTemporaria;
        public String observacao;

        public RedefinirSenhaResponse(String mensagem, String senhaTemporaria, String observacao) {
            this.mensagem = mensagem;
            this.senhaTemporaria = senhaTemporaria;
            this.observacao = observacao;
        }
    }

    static class ErrorResponse {
        public String erro;

        public ErrorResponse(String erro) {
            this.erro = erro;
        }
    }
}
