package com.bemclinicinf2cn.api.service;

import java.util.Optional;

import com.bemclinicinf2cn.api.request.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bemclinicinf2cn.api.domain.Paciente;
import com.bemclinicinf2cn.api.domain.Medico;
import com.bemclinicinf2cn.api.domain.Usuario;
import com.bemclinicinf2cn.api.dto.UsuarioDTO;
import com.bemclinicinf2cn.api.repository.UsuarioRepository;
import com.bemclinicinf2cn.api.repository.PacienteRepository;
import com.bemclinicinf2cn.api.repository.MedicoRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<UsuarioDTO> autenticar(LoginRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(request.getEmail());

        if (usuarioOpt.isEmpty()) {
            return Optional.empty();
        }

        Usuario usuario = usuarioOpt.get();

        // Verifica senha com BCrypt
        if (!passwordEncoder.matches(request.getSenha(), usuario.getSenha())) {
            return Optional.empty();
        }

        // Monta o DTO com dados do usuário e vinculado
        Long idVinculado = null;
        String nome = null;

        if (usuario.isPaciente() && usuario.getIdPaciente() != null) {
            Optional<Paciente> pacienteOpt = pacienteRepository.findById(usuario.getIdPaciente());
            if (pacienteOpt.isPresent()) {
                Paciente paciente = pacienteOpt.get();
                idVinculado = paciente.getId();
                nome = paciente.getNome();
            }
        } else if (usuario.isMedico() && usuario.getIdMedico() != null) {
            Optional<Medico> medicoOpt = medicoRepository.findById(usuario.getIdMedico());
            if (medicoOpt.isPresent()) {
                Medico medico = medicoOpt.get();
                idVinculado = medico.getId();
                nome = medico.getNome();
            }
        }

        UsuarioDTO dto = new UsuarioDTO(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getTipo(),
                idVinculado,
                nome
        );

        return Optional.of(dto);
    }

    public Optional<Usuario> findById(Long id) {
        return usuarioRepository.findById(id);
    }
}