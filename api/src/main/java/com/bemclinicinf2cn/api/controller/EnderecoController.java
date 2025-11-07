package com.bemclinicinf2cn.api.controller;

import com.bemclinicinf2cn.api.domain.Endereco;
import com.bemclinicinf2cn.api.domain.Usuario;
import com.bemclinicinf2cn.api.dto.EnderecoDTO;
import com.bemclinicinf2cn.api.infra.security.JwtUtil;
import com.bemclinicinf2cn.api.repository.PacienteRepository;
import com.bemclinicinf2cn.api.repository.MedicoRepository;
import com.bemclinicinf2cn.api.repository.UsuarioRepository;
import com.bemclinicinf2cn.api.service.EnderecoService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api/v1") // Raiz da API
public class EnderecoController {

    @Autowired
    private EnderecoService service;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    // --- Endpoints Gerais para Endereços (se ainda forem necessários) ---

    @GetMapping("/enderecos")
    public ResponseEntity<List<EnderecoDTO>> listarEnderecos() {
        return ResponseEntity.ok(service.listarEnderecos());
    }

    @GetMapping("/enderecos/{id}")
    public ResponseEntity<EnderecoDTO> get(@PathVariable("id") Long id) {
        return service.getEnderecoById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Este endpoint agora é mais específico para criação geral, se necessário.
    // O endpoint principal para criação associada ao usuário é /endereco
    @PostMapping("/enderecos")
    public ResponseEntity<Endereco> incluir(@RequestBody Endereco endereco) {
        Endereco novo = service.incluir(endereco);
        return ResponseEntity.status(201).body(novo);
    }

    @PutMapping("/enderecos/{id}")
    public ResponseEntity<Endereco> atualizar(@PathVariable Long id, @RequestBody Endereco endereco) {
        Endereco atualizado = service.atualizar(id, endereco);
        if (atualizado != null) {
            return ResponseEntity.ok(atualizado);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/enderecos/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        boolean deletado = service.deletar(id);
        if (deletado) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // --- Novo Endpoint: Cadastrar Endereço e Associar ao Usuário Logado ---

    /**
     * Endpoint para cadastrar um endereço e associá-lo ao usuário logado (Paciente ou Medico).
     * O usuário é identificado pelo token JWT.
     */
    @PostMapping("/endereco") // Endpoint específico para o usuário logado
    public ResponseEntity<?> cadastrarEnderecoUsuarioLogado(
            @RequestBody Endereco endereco,
            HttpServletRequest request) {

        try {
            // 1. Extrair o token do cabeçalho Authorization
            String token = extractTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(401).body("Token não fornecido.");
            }

            // 2. Validar o token e extrair o email
            String email;
            try {
                if (!jwtUtil.validateToken(token, jwtUtil.extractEmail(token))) {
                    return ResponseEntity.status(401).body("Token inválido ou expirado.");
                }
                email = jwtUtil.extractEmail(token);
            } catch (Exception e) {
                return ResponseEntity.status(401).body("Token inválido: " + e.getMessage());
            }

            // 3. Buscar o usuário pelo email
            Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Usuário não encontrado com o email: " + email);
            }
            Usuario usuario = usuarioOpt.get();

            // 4. Salvar o novo endereço
            Endereco novoEndereco = service.incluir(endereco);
            Long idNovoEndereco = novoEndereco.getId_endereco(); // getId() retorna id_endereco

            // 5. Associar o endereço ao Paciente ou Medico
            if ("PACIENTE".equals(usuario.getTipo()) && usuario.getIdPaciente() != null) {
                // Busca e atualiza o Paciente
                pacienteRepository.findById(usuario.getIdPaciente())
                        .ifPresentOrElse(paciente -> {
                            paciente.setIdEndereco(idNovoEndereco);
                            pacienteRepository.save(paciente);
                        }, () -> {
                            // Se o paciente não for encontrado, faz rollback
                            service.deletar(idNovoEndereco);
                            throw new RuntimeException("Paciente não encontrado com ID: " + usuario.getIdPaciente());
                        });

            } else if ("MEDICO".equals(usuario.getTipo()) && usuario.getIdMedico() != null) {
                //Busca e atualiza o Medico
                medicoRepository.findById(usuario.getIdMedico())
                        .ifPresentOrElse(medico -> {
                            medico.setIdEndereco(idNovoEndereco);
                            medicoRepository.save(medico);
                        }, () -> {
                            // Se o médico não for encontrado, faz rollback
                            service.deletar(idNovoEndereco);
                            throw new RuntimeException("Médico não encontrado com ID: " + usuario.getIdMedico());
                        });
            } else {
                // Tipo inválido ou ID não encontrado, faz rollback
                service.deletar(idNovoEndereco);
                return ResponseEntity.badRequest().body("Tipo de usuário inválido ou ID não encontrado.");
            }
            
            // 6. Retornar sucesso com o DTO do endereço criado
            // Certifique-se de que o construtor do EnderecoDTO corresponde aos campos
            EnderecoDTO enderecoDTO = new EnderecoDTO(
                    novoEndereco.getId_endereco(), // id_endereco
                    novoEndereco.getCep(),
                    novoEndereco.getRua(),
                    novoEndereco.getBairro(),
                    novoEndereco.getCidade(),
                    novoEndereco.getEstado(),
                    novoEndereco.getComplemento(),
                    novoEndereco.getNumero()
            );

            return ResponseEntity.ok(enderecoDTO);

        } catch (Exception e) {
            // Log do erro para depuração (opcional, use logger em produção)
            // e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao cadastrar endereço: " + e.getMessage());
        }
    }

    /**
     * Método auxiliar para extrair o token Bearer do cabeçalho Authorization.
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Remove "Bearer "
        }
        return null;
    }

    /**
     * Compatibilidade: Endpoint que permite criar um endereço associado a um Paciente
     * informando o ID do paciente na URL. Isso cobre chamadas do frontend que usam
     * a rota /api/v1/pacientes/{id}/enderecos.
     */
    @PostMapping("/pacientes/{pacienteId}/enderecos")
    public ResponseEntity<?> cadastrarEnderecoParaPaciente(@PathVariable("pacienteId") Long pacienteId,
                                                           @RequestBody Endereco endereco) {
        try {
            // 1. Salva o endereço
            Endereco novoEndereco = service.incluir(endereco);
            Long idNovo = novoEndereco.getId_endereco();

            // 2. Associa ao paciente informado
            boolean associado = pacienteRepository.findById(pacienteId)
                    .map(paciente -> {
                        paciente.setIdEndereco(idNovo);
                        pacienteRepository.save(paciente);
                        return true;
                    }).orElse(false);

            if (!associado) {
                // Rollback: remove o endereço criado
                service.deletar(idNovo);
                return ResponseEntity.status(404).body("Paciente não encontrado com ID: " + pacienteId);
            }

            EnderecoDTO enderecoDTO = new EnderecoDTO(
                    novoEndereco.getId_endereco(),
                    novoEndereco.getCep(),
                    novoEndereco.getRua(),
                    novoEndereco.getBairro(),
                    novoEndereco.getCidade(),
                    novoEndereco.getEstado(),
                    novoEndereco.getComplemento(),
                    novoEndereco.getNumero()
            );

            return ResponseEntity.status(201).body(enderecoDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao cadastrar endereço para paciente: " + e.getMessage());
        }
    }
}