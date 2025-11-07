package com.bemclinicinf2cn.api.controller;

import com.bemclinicinf2cn.api.domain.Medico;
import com.bemclinicinf2cn.api.domain.Hospital;
import com.bemclinicinf2cn.api.service.MedicoService;
import com.bemclinicinf2cn.api.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/medicos")
@CrossOrigin(origins = "*")
public class MedicoController {

    @Autowired
    private MedicoService medicoService;

    @Autowired
    private HospitalService hospitalService;

    // GET /api/v1/medicos - Listar todos os médicos
    @GetMapping
    public ResponseEntity<List<Medico>> listarTodos() {
        try {
            List<Medico> medicos = medicoService.listarTodos();
            return ResponseEntity.ok(medicos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /api/v1/medicos/{id} - Buscar médico por ID
    @GetMapping("/{id}")
    public ResponseEntity<Medico> buscarPorId(@PathVariable Long id) {
        try {
            Optional<Medico> medico = medicoService.buscarPorId(id);
            return medico.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /api/v1/medicos/hospital/{hospitalId} - Buscar médicos por hospital
    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<?> listarPorHospital(@PathVariable Long hospitalId) {
        try {
            // Verificar se o hospital existe
            Optional<Hospital> hospital = hospitalService.buscarPorId(hospitalId);
            if (hospital.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body("Hospital não encontrado com ID: " + hospitalId);
            }

            List<Medico> medicos = medicoService.buscarPorHospital(hospitalId);
            return ResponseEntity.ok(medicos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro interno do servidor: " + e.getMessage());
        }
    }

    // GET /api/v1/medicos/hospital/{hospitalId}/ativos - Buscar médicos ativos por hospital
    @GetMapping("/hospital/{hospitalId}/ativos")
    public ResponseEntity<?> listarAtivosPorHospital(@PathVariable Long hospitalId) {
        try {
            Optional<Hospital> hospital = hospitalService.buscarPorId(hospitalId);
            if (hospital.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body("Hospital não encontrado com ID: " + hospitalId);
            }

            List<Medico> medicos = medicoService.buscarAtivosPorHospital(hospitalId);
            return ResponseEntity.ok(medicos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro interno do servidor: " + e.getMessage());
        }
    }

    // GET /api/v1/medicos/especialidade/{especialidade} - Buscar médicos por especialidade
    @GetMapping("/especialidade/{especialidade}")
    public ResponseEntity<List<Medico>> buscarPorEspecialidade(@PathVariable String especialidade) {
        try {
            List<Medico> medicos = medicoService.buscarPorEspecialidade(especialidade);
            return ResponseEntity.ok(medicos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // POST /api/v1/medicos - Cadastrar novo médico
    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody Medico medico) {
        try {
            // Validações básicas
            if (medico.getNome() == null || medico.getNome().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Nome é obrigatório");
            }
            if (medico.getEmail() == null || medico.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email é obrigatório");
            }
            if (medico.getCpf() == null || medico.getCpf().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("CPF é obrigatório");
            }
            if (medico.getCrm() == null || medico.getCrm().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("CRM é obrigatório");
            }

            Medico medicoSalvo = medicoService.criar(medico);
            return ResponseEntity.status(HttpStatus.CREATED).body(medicoSalvo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro interno do servidor: " + e.getMessage());
        }
    }

    // PUT /api/v1/medicos/{id} - Atualizar médico
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Medico medicoAtualizado) {
        try {
            Medico medicoSalvo = medicoService.atualizarMedico(id, medicoAtualizado);
            return ResponseEntity.ok(medicoSalvo);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("não encontrado")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro interno do servidor: " + e.getMessage());
        }
    }

    // DELETE /api/v1/medicos/{id} - Deletar médico
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            medicoService.deletarMedico(id);
            return ResponseEntity.ok().body("Médico deletado com sucesso");
        } catch (RuntimeException e) {
            if (e.getMessage().contains("não encontrado")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro interno do servidor: " + e.getMessage());
        }
    }

    // PATCH /api/v1/medicos/{id}/desativar - Desativar médico
    @PatchMapping("/{id}/desativar")
    public ResponseEntity<?> desativar(@PathVariable Long id) {
        try {
            Medico medicoAtualizado = medicoService.desativar(id);
            return ResponseEntity.ok(medicoAtualizado);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("não encontrado")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro interno do servidor: " + e.getMessage());
        }
    }

    // PATCH /api/v1/medicos/{id}/ativar - Ativar médico
    @PatchMapping("/{id}/ativar")
    public ResponseEntity<?> ativar(@PathVariable Long id) {
        try {
            Medico medicoAtualizado = medicoService.ativar(id);
            return ResponseEntity.ok(medicoAtualizado);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("não encontrado")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro interno do servidor: " + e.getMessage());
        }
    }

    // GET /api/v1/medicos/hospital/{hospitalId}/count - Contar médicos por hospital
    @GetMapping("/hospital/{hospitalId}/count")
    public ResponseEntity<?> contarPorHospital(@PathVariable Long hospitalId) {
        try {
            Long count = medicoService.contarPorHospital(hospitalId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro interno do servidor: " + e.getMessage());
        }
    }

    // GET /api/v1/medicos/crm/{crm} - Buscar médico por CRM
    @GetMapping("/crm/{crm}")
    public ResponseEntity<Medico> buscarPorCrm(@PathVariable String crm) {
        try {
            Optional<Medico> medico = medicoService.buscarPorCrm(crm);
            return medico.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}