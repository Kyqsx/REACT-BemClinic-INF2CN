package com.bemclinicinf2cn.api.service;

import com.bemclinicinf2cn.api.domain.Paciente;
import com.bemclinicinf2cn.api.domain.Medico;
import com.bemclinicinf2cn.api.domain.Usuario;
import com.bemclinicinf2cn.api.dto.AuthRequest;
import com.bemclinicinf2cn.api.dto.AuthResponse;
import com.bemclinicinf2cn.api.dto.RegisterRequest;
import com.bemclinicinf2cn.api.infra.security.JwtUtil;
import com.bemclinicinf2cn.api.repository.PacienteRepository;
import com.bemclinicinf2cn.api.repository.MedicoRepository;
import com.bemclinicinf2cn.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service // ✅ Certifique-se de ter apenas esta annotation
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ Removido AuthenticationManager

    public AuthResponse login(AuthRequest authRequest) {
        System.out.println("=== TENTANDO LOGIN ===");
        System.out.println("Email: " + authRequest.getEmail());

        // Buscar usuário pelo email
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(authRequest.getEmail());

        if (usuarioOpt.isEmpty()) {
            System.out.println("USUÁRIO NÃO ENCONTRADO!");
            throw new RuntimeException("Credenciais inválidas");
        }

        Usuario usuario = usuarioOpt.get();
        System.out.println("Usuário encontrado: " + usuario.getEmail() + ", Tipo: " + usuario.getTipo());

        // Verificar senha manualmente
        if (!passwordEncoder.matches(authRequest.getSenha(), usuario.getSenha())) {
            System.out.println("SENHA INCORRETA!");
            throw new RuntimeException("Credenciais inválidas");
        }

        System.out.println("LOGIN BEM SUCEDIDO!");

        // Gerar token JWT
        Long idVinculado = null;
        if ("PACIENTE".equals(usuario.getTipo()) && usuario.getIdPaciente() != null) {
            idVinculado = usuario.getIdPaciente();
            System.out.println("✅ ID do Paciente encontrado: " + idVinculado);
        } else if ("MEDICO".equals(usuario.getTipo()) && usuario.getIdMedico() != null) {
            idVinculado = usuario.getIdMedico();
            System.out.println("✅ ID do Médico encontrado: " + idVinculado);
        } else if ("HOSPITAL".equals(usuario.getTipo()) && usuario.getIdHospital() != null) {
            idVinculado = usuario.getIdHospital();
            System.out.println("✅ ID do Hospital encontrado: " + idVinculado);
        } else {
            System.out.println("⚠️ Nenhum ID vinculado encontrado para tipo: " + usuario.getTipo());
            System.out.println("idPaciente: " + usuario.getIdPaciente());
            System.out.println("idMedico: " + usuario.getIdMedico());
            System.out.println("idHospital: " + usuario.getIdHospital());
        }

        String token = jwtUtil.generateToken(
                usuario.getEmail(),
                usuario.getTipo(),
                idVinculado
        );

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setTipo(usuario.getTipo());
        response.setId(idVinculado);

        System.out.println("📤 Retornando ID: " + idVinculado);
        return response;
    }

    public String register(RegisterRequest registerRequest) {
        // Verificar se email já existe
        if (usuarioRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        /*  Verificar se CPF já existe (para pacientes)
        if ("PACIENTE".equalsIgnoreCase(registerRequest.getTipo())) {
            if (pacienteRepository.findByCpf(registerRequest.getCpf()).isPresent()) {
                throw new RuntimeException("CPF já cadastrado");
            }
        }

        // Verificar se CPF já existe (para funcionários)
        if ("MEDICO".equalsIgnoreCase(registerRequest.getTipo())) {
            if (medicoRepository.findByCpf(registerRequest.getCpf()).isPresent()) {
                throw new RuntimeException("CPF já cadastrado");
            }
        }*/

        if ("PACIENTE".equalsIgnoreCase(registerRequest.getTipo())) {
            return registerPaciente(registerRequest);
        } else if ("MEDICO".equalsIgnoreCase(registerRequest.getTipo())) {
            return registerMedico(registerRequest);
        } else if ("ADMIN".equalsIgnoreCase(registerRequest.getTipo())) {
            throw new RuntimeException("Registro de ADMIN não implementado");
        } else if ("HOSPITAL".equalsIgnoreCase(registerRequest.getTipo())) {
            throw new RuntimeException("Registro de HOSPITAL não implementado");
        } else {
            throw new RuntimeException("Tipo de usuário inválido");
        }
    }

    private String registerPaciente(RegisterRequest request) {
        // Criar paciente
        Paciente paciente = new Paciente();
        paciente.setNome(request.getNome());
        paciente.setEmail(request.getEmail());
        paciente.setSenha(passwordEncoder.encode(request.getSenha()));
        //paciente.setCpf(request.getCpf());

        paciente = pacienteRepository.save(paciente);

        // Criar usuário
        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setTipo("PACIENTE");
        usuario.setIdPaciente(paciente.getId());

        usuarioRepository.save(usuario);

        return "Paciente registrado com sucesso|" + paciente.getId();
    }

    private String registerMedico(RegisterRequest request) {
        // Criar funcionário
        Medico medico = new Medico();
        medico.setNome(request.getNome());
        medico.setEmail(request.getEmail());
        medico.setSenha(passwordEncoder.encode(request.getSenha()));
        //medico.setCpf(request.getCpf());

        medico = medicoRepository.save(medico);

        // Criar usuário
        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setTipo("MEDICO");
        usuario.setIdMedico(medico.getId());

        usuarioRepository.save(usuario);

        return "medico registrado com sucesso|" + medico.getId();
    }
}