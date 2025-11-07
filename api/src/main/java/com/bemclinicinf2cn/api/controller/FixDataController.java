package com.bemclinicinf2cn.api.controller;

import com.bemclinicinf2cn.api.domain.Usuario;
import com.bemclinicinf2cn.api.domain.Paciente;
import com.bemclinicinf2cn.api.domain.Medico;
import com.bemclinicinf2cn.api.repository.UsuarioRepository;
import com.bemclinicinf2cn.api.repository.PacienteRepository;
import com.bemclinicinf2cn.api.repository.MedicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/fix")
@CrossOrigin(origins = "*")
public class FixDataController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @PostMapping("/vincular-usuarios")
    public ResponseEntity<Map<String, Object>> vincularUsuarios() {
        Map<String, Object> resultado = new HashMap<>();
        int pacientesVinculados = 0;
        int medicosVinculados = 0;

        try {
            // Vincular pacientes
            List<Usuario> usuariosPacientes = usuarioRepository.findByTipo("PACIENTE");
            for (Usuario usuario : usuariosPacientes) {
                if (usuario.getIdPaciente() == null) {
                    Optional<Paciente> pacienteOpt = pacienteRepository.findByEmail(usuario.getEmail());
                    if (pacienteOpt.isPresent()) {
                        usuario.setIdPaciente(pacienteOpt.get().getId());
                        usuarioRepository.save(usuario);
                        pacientesVinculados++;
                        System.out.println("✅ Vinculado: " + usuario.getEmail() + " -> Paciente ID: " + pacienteOpt.get().getId());
                    } else {
                        System.out.println("⚠️ Paciente não encontrado para email: " + usuario.getEmail());
                    }
                }
            }

            // Vincular médicos
            List<Usuario> usuariosMedicos = usuarioRepository.findByTipo("MEDICO");
            for (Usuario usuario : usuariosMedicos) {
                if (usuario.getIdMedico() == null) {
                    Optional<Medico> medicoOpt = medicoRepository.findByEmail(usuario.getEmail());
                    if (medicoOpt.isPresent()) {
                        usuario.setIdMedico(medicoOpt.get().getId());
                        usuarioRepository.save(usuario);
                        medicosVinculados++;
                        System.out.println("✅ Vinculado: " + usuario.getEmail() + " -> Médico ID: " + medicoOpt.get().getId());
                    } else {
                        System.out.println("⚠️ Médico não encontrado para email: " + usuario.getEmail());
                    }
                }
            }

            resultado.put("sucesso", true);
            resultado.put("pacientesVinculados", pacientesVinculados);
            resultado.put("medicosVinculados", medicosVinculados);
            resultado.put("mensagem", "Vínculo concluído com sucesso!");

            return ResponseEntity.ok(resultado);

        } catch (Exception e) {
            resultado.put("sucesso", false);
            resultado.put("erro", e.getMessage());
            return ResponseEntity.status(500).body(resultado);
        }
    }

    @GetMapping("/verificar-usuarios")
    public ResponseEntity<Map<String, Object>> verificarUsuarios() {
        Map<String, Object> resultado = new HashMap<>();

        try {
            List<Usuario> todosUsuarios = usuarioRepository.findAll();
            
            for (Usuario usuario : todosUsuarios) {
                Map<String, Object> info = new HashMap<>();
                info.put("email", usuario.getEmail());
                info.put("tipo", usuario.getTipo());
                info.put("idPaciente", usuario.getIdPaciente());
                info.put("idMedico", usuario.getIdMedico());
                info.put("idHospital", usuario.getIdHospital());
                
                resultado.put("usuario_" + usuario.getId(), info);
            }

            return ResponseEntity.ok(resultado);

        } catch (Exception e) {
            resultado.put("erro", e.getMessage());
            return ResponseEntity.status(500).body(resultado);
        }
    }
}
