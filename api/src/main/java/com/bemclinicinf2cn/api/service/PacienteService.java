package com.bemclinicinf2cn.api.service;

import com.bemclinicinf2cn.api.domain.Paciente;
import com.bemclinicinf2cn.api.domain.Endereco;
import com.bemclinicinf2cn.api.dto.AtualizarPerfilDTO;
import com.bemclinicinf2cn.api.dto.PacienteDTO;
import com.bemclinicinf2cn.api.repository.PacienteRepository;
import com.bemclinicinf2cn.api.repository.EnderecoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EnderecoRepository enderecoRepository;

    public List<PacienteDTO> listarPacientes() {
        return pacienteRepository.findAllBasic();
    }

    public Optional<PacienteDTO> getPacienteById(Long id) {
        return pacienteRepository.findBasicById(id);
    }

    public Paciente incluir(Paciente paciente) {
        return pacienteRepository.save(paciente);
    }

    public Optional<Paciente> buscarPorId(Long id) {
        return pacienteRepository.findById(id);
    }

    public Paciente atualizar(Long id, Paciente dadosNovos) {
        return pacienteRepository.findById(id)
            .map(pacienteExistente -> {
                // Preserva id_endereco se não foi fornecido nos dados novos
                if (dadosNovos.getIdEndereco() == null) {
                    dadosNovos.setIdEndereco(pacienteExistente.getIdEndereco());
                }
                
                // Preserva outros campos que não devem ser nulos se não fornecidos
                if (dadosNovos.getEmail() == null) {
                    dadosNovos.setEmail(pacienteExistente.getEmail());
                }
                if (dadosNovos.getSenha() == null) {
                    dadosNovos.setSenha(pacienteExistente.getSenha());
                }
                if (dadosNovos.getFoto() == null) {
                    dadosNovos.setFoto(pacienteExistente.getFoto());
                }
                
                dadosNovos.setId(id);
                return pacienteRepository.save(dadosNovos);
            })
            .orElse(null);
    }

    public boolean deletar(Long id) {
        if (pacienteRepository.existsById(id)) {
            pacienteRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean atualizarPerfilPorEmail(String email, AtualizarPerfilDTO dados) {

        System.out.println("=== DEBUG FOTO ===");
        System.out.println("Email: " + email);
        System.out.println("Foto recebida: " + (dados.getFoto() != null ? "SIM" : "NÃO"));
        if (dados.getFoto() != null) {
            System.out.println("Tamanho da string foto: " + dados.getFoto().length());
            System.out.println("Primeiros 100 caracteres: "
                    + dados.getFoto().substring(0, Math.min(100, dados.getFoto().length())));
        }
        System.out.println("=== FIM DEBUG ===");
        Optional<Paciente> pacienteOpt = pacienteRepository.findByEmail(email);
        if (pacienteOpt.isEmpty()) {
            return false;
        }

        Paciente paciente = pacienteOpt.get();

        // Atualiza dados do paciente
        if (dados.getNome() != null)
            paciente.setNome(dados.getNome());

        // Atualiza senha (criptografada)
        if (dados.getSenha() != null && !dados.getSenha().isEmpty()) {
            paciente.setSenha(passwordEncoder.encode(dados.getSenha()));
        }

        // Atualizar Foto (só atualiza se for fornecida)
        if (dados.getFoto() != null && !dados.getFoto().isEmpty()) {
            System.out.println("Foto recebida (Base64): "
                    + dados.getFoto().substring(0, Math.min(50, dados.getFoto().length())) + "...");
            // Converte Base64 para byte[]
            try {
                // Remove prefixo data:image/...;base64,
                String base64Data = dados.getFoto().replaceFirst("^data:image/\\w+;base64,", "");
                byte[] fotoBytes = java.util.Base64.getDecoder().decode(base64Data);
                paciente.setFoto(fotoBytes);
                System.out.println("Foto convertida para byte[] com tamanho: " + fotoBytes.length);
            } catch (Exception e) {
                System.out.println("Erro ao converter foto: " + e.getMessage());
            }
        }

        // Atualiza endereço
        Endereco endereco = null;
        Long idEndereco = paciente.getIdEndereco();

        if (idEndereco != null) {
            Optional<Endereco> enderecoOpt = enderecoRepository.findById(idEndereco);
            endereco = enderecoOpt.orElse(null);
        }

        if (endereco == null) {
            endereco = new Endereco();
        }

        // ✅ Atualiza TODOS os campos do endereço (incluindo numero)
        if (dados.getCep() != null)
            endereco.setCep(dados.getCep());
        if (dados.getRua() != null)
            endereco.setRua(dados.getRua());
        if (dados.getNumero() != null)
            endereco.setNumero(dados.getNumero()); // 👈 LINHA ADICIONADA
        if (dados.getComplemento() != null)
            endereco.setComplemento(dados.getComplemento());
        if (dados.getBairro() != null)
            endereco.setBairro(dados.getBairro());
        if (dados.getCidade() != null)
            endereco.setCidade(dados.getCidade());
        if (dados.getEstado() != null)
            endereco.setEstado(dados.getEstado());

        // Salva o endereço primeiro
        Endereco enderecoSalvo = enderecoRepository.save(endereco);

        // Atualiza a referência no paciente
        paciente.setIdEndereco(enderecoSalvo.getId_endereco()); // Corrigido: getId() em vez de getId_endereco()

        // Salva o paciente
        pacienteRepository.save(paciente);
        return true;
    }

    public boolean atualizarFotoPorEmail(String email, MultipartFile foto) throws IOException {
        Optional<Paciente> pacienteOpt = pacienteRepository.findByEmail(email);
        if (pacienteOpt.isEmpty())
            return false;

        Paciente paciente = pacienteOpt.get();
        paciente.setFoto(foto.getBytes());
        pacienteRepository.save(paciente);
        return true;
    }

    public Optional<Map<String, Object>> getPerfilPacienteByEmail(String email) {
        return pacienteRepository.findByEmail(email)
                .map(paciente -> {
                    Map<String, Object> perfil = new HashMap<>();
                    perfil.put("id", paciente.getId());
                    perfil.put("nome", paciente.getNome());
                    perfil.put("email", paciente.getEmail());
                    perfil.put("cpf", paciente.getCpf());

                    // Foto em Base64
                    if (paciente.getFoto() != null) {
                        String base64 = java.util.Base64.getEncoder().encodeToString(paciente.getFoto());
                        perfil.put("foto", base64);
                    }

                    // Endereço
                    if (paciente.getIdEndereco() != null) {
                        enderecoRepository.findById(paciente.getIdEndereco())
                                .ifPresent(endereco -> {
                                    Map<String, Object> endMap = new HashMap<>();
                                    endMap.put("cep", endereco.getCep());
                                    endMap.put("rua", endereco.getRua());
                                    endMap.put("numero", endereco.getNumero());
                                    endMap.put("complemento", endereco.getComplemento());
                                    endMap.put("bairro", endereco.getBairro());
                                    endMap.put("cidade", endereco.getCidade());
                                    endMap.put("estado", endereco.getEstado());
                                    perfil.put("endereco", endMap);
                                });
                    }

                    return perfil;
                });
    }
}