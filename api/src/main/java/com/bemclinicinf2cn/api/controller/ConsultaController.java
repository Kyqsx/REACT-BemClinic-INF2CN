package com.bemclinicinf2cn.api.controller;

import com.bemclinicinf2cn.api.dto.ConsultaResponseDTO;
import com.bemclinicinf2cn.api.request.ConsultaRequest;
import com.bemclinicinf2cn.api.service.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/consultas")
@CrossOrigin(origins = "*")
public class ConsultaController {

    @Autowired
    private ConsultaService consultaService;

    // Criar nova consulta (paciente solicita)
    @PostMapping
    public ResponseEntity<?> criarConsulta(@RequestBody ConsultaRequest request) {
        try {
            System.out.println("=== CRIANDO CONSULTA ===");
            System.out.println("Paciente ID: " + request.getPacienteId());
            System.out.println("Data: " + request.getDataPreferencia());
            System.out.println("Horário: " + request.getHorarioPreferencia());
            System.out.println("Local: " + request.getLocalPreferencia());
            System.out.println("Especialidade: " + request.getEspecialidade());
            
            ConsultaResponseDTO consulta = consultaService.criarConsulta(request);
            System.out.println("✅ Consulta criada com sucesso!");
            return ResponseEntity.status(HttpStatus.CREATED).body(consulta);
        } catch (Exception e) {
            System.err.println("❌ Erro ao criar consulta: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro", e.getMessage()));
        }
    }

    // Listar todas as consultas pendentes (para hospitais verem)
    @GetMapping("/pendentes")
    public ResponseEntity<List<ConsultaResponseDTO>> listarConsultasPendentes() {
        try {
            List<ConsultaResponseDTO> consultas = consultaService.listarConsultasPendentes();
            return ResponseEntity.ok(consultas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Listar consultas por paciente
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<ConsultaResponseDTO>> listarConsultasPorPaciente(@PathVariable Long pacienteId) {
        try {
            List<ConsultaResponseDTO> consultas = consultaService.listarConsultasPorPaciente(pacienteId);
            return ResponseEntity.ok(consultas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Listar consultas por hospital
    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<ConsultaResponseDTO>> listarConsultasPorHospital(@PathVariable Long hospitalId) {
        try {
            List<ConsultaResponseDTO> consultas = consultaService.listarConsultasPorHospital(hospitalId);
            return ResponseEntity.ok(consultas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Aceitar consulta (hospital aceita)
    @PutMapping("/{id}/aceitar")
    public ResponseEntity<ConsultaResponseDTO> aceitarConsulta(
            @PathVariable Long id, 
            @RequestBody Map<String, Long> body) {
        try {
            Long hospitalId = body.get("hospitalId");
            ConsultaResponseDTO consulta = consultaService.aceitarConsulta(id, hospitalId);
            return ResponseEntity.ok(consulta);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // Recusar consulta (hospital recusa)
    @PutMapping("/{id}/recusar")
    public ResponseEntity<ConsultaResponseDTO> recusarConsulta(@PathVariable Long id) {
        try {
            ConsultaResponseDTO consulta = consultaService.recusarConsulta(id);
            return ResponseEntity.ok(consulta);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // Cancelar consulta
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<ConsultaResponseDTO> cancelarConsulta(@PathVariable Long id) {
        try {
            ConsultaResponseDTO consulta = consultaService.cancelarConsulta(id);
            return ResponseEntity.ok(consulta);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // Buscar consulta por ID
    @GetMapping("/{id}")
    public ResponseEntity<ConsultaResponseDTO> buscarConsultaPorId(@PathVariable Long id) {
        try {
            ConsultaResponseDTO consulta = consultaService.buscarConsultaPorId(id);
            return ResponseEntity.ok(consulta);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Listar todas as consultas
    @GetMapping
    public ResponseEntity<List<ConsultaResponseDTO>> listarTodasConsultas() {
        try {
            List<ConsultaResponseDTO> consultas = consultaService.listarTodasConsultas();
            return ResponseEntity.ok(consultas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
