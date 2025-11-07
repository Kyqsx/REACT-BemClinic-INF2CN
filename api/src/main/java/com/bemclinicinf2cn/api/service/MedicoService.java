package com.bemclinicinf2cn.api.service;

import com.bemclinicinf2cn.api.domain.Medico;
import com.bemclinicinf2cn.api.domain.Hospital;
import com.bemclinicinf2cn.api.domain.Usuario;
import com.bemclinicinf2cn.api.dto.AtualizarPerfilMedicoDTO;
import com.bemclinicinf2cn.api.repository.MedicoRepository;
import com.bemclinicinf2cn.api.repository.HospitalRepository;
import com.bemclinicinf2cn.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class MedicoService {

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    public List<Medico> listarMedicos() {
        return medicoRepository.findAll();
    }

    public Optional<Medico> getMedicoById(Long id) {
        return medicoRepository.findById(id);
    }

    public Medico incluir(Medico medico) {
        return medicoRepository.save(medico);
    }

    public Medico atualizar(Long id, Medico medico) {
        if (medicoRepository.existsById(id)) {
            medico.setId(id); // ✅ Corrigido: usando setId() em vez de setId_Medico()
            return medicoRepository.save(medico);
        }
        return null;
    }

    public boolean deletar(Long id) {
        if (medicoRepository.existsById(id)) {
            medicoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<Map<String, Object>> getPerfilMedicoByEmail(String email) {
        return medicoRepository.findByEmail(email).map(func -> {
            Map<String, Object> perfil = new HashMap<>();
            perfil.put("id", func.getId());
            perfil.put("nome", func.getNome());
            perfil.put("email", func.getEmail());
            perfil.put("cpf", func.getCpf());
            perfil.put("foto", func.getFoto());
            perfil.put("idEndereco", func.getIdEndereco());
            perfil.put("enderecoObj", func.getEnderecoObj());
            return perfil;
        });
    }

    // Método para atualizar perfil (igual ao do cliente)
    public boolean atualizarPerfilPorEmail(String email, AtualizarPerfilMedicoDTO dto) {
        Optional<Medico> optFunc = medicoRepository.findByEmail(email);
        if (optFunc.isEmpty()) {
            return false;
        }

        Medico func = optFunc.get();

        // Atualiza nome
        if (dto.getNome() != null && !dto.getNome().trim().isEmpty()) {
            func.setNome(dto.getNome().trim());
        }

        // Atualiza senha (com criptografia)
        if (dto.getSenha() != null && !dto.getSenha().trim().isEmpty()) {
            String senhaCriptografada = passwordEncoder.encode(dto.getSenha().trim());
            func.setSenha(senhaCriptografada);
        }

        // Nota: O endereço agora é gerenciado através da tabela Endereco
        // e vinculado pelo campo idEndereco, não mais como string

        medicoRepository.save(func);
        return true;
    }

    public boolean atualizarFotoPorEmail(String email, MultipartFile foto) throws Exception {
        Optional<Medico> optFunc = medicoRepository.findByEmail(email);
        if (optFunc.isEmpty()) {
            return false;
        }

        Medico func = optFunc.get();
        // ✅ Converte para Base64 e salva como String
        String fotoBase64 = java.util.Base64.getEncoder().encodeToString(foto.getBytes());
        func.setFoto(fotoBase64);
        medicoRepository.save(func);
        return true;
    }

    // ==================== MÉTODOS PARA GERENCIAMENTO HOSPITALAR ====================

    // Buscar todos os médicos
    public List<Medico> listarTodos() {
        return medicoRepository.findAll();
    }

    // Buscar médico por ID
    public Optional<Medico> buscarPorId(Long id) {
        return medicoRepository.findById(id);
    }

    // Buscar médicos por hospital
    public List<Medico> buscarPorHospital(Long hospitalId) {
        return medicoRepository.findByHospitalId(hospitalId);
    }

    // Buscar médicos ativos por hospital
    public List<Medico> buscarAtivosPorHospital(Long hospitalId) {
        return medicoRepository.findByHospitalIdAndAtivoTrue(hospitalId);
    }

    // Buscar médicos por especialidade
    public List<Medico> buscarPorEspecialidade(String especialidade) {
        return medicoRepository.findByEspecialidade(especialidade);
    }

    // Criar novo médico
    public Medico criar(Medico medico) {
        // Validar se hospital existe
        if (medico.getHospitalId() != null) {
            Optional<Hospital> hospital = hospitalRepository.findById(medico.getHospitalId());
            if (hospital.isEmpty()) {
                throw new RuntimeException("Hospital não encontrado com ID: " + medico.getHospitalId());
            }
        }

        // Validar se CRM já existe
        if (medico.getCrm() != null && medicoRepository.findByCrm(medico.getCrm()).isPresent()) {
            throw new RuntimeException("CRM já cadastrado: " + medico.getCrm());
        }

        // Validar se email já existe
        if (medico.getEmail() != null && medicoRepository.findByEmail(medico.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado: " + medico.getEmail());
        }

        // Validar se CPF já existe
        if (medico.getCpf() != null && medicoRepository.findByCpf(medico.getCpf()).isPresent()) {
            throw new RuntimeException("CPF já cadastrado: " + medico.getCpf());
        }

        // Definir como ativo por padrão
        if (medico.getAtivo() == null) {
            medico.setAtivo(true);
        }

        // Criptografar senha se fornecida
        if (medico.getSenha() != null && !medico.getSenha().trim().isEmpty()) {
            String senhaCriptografada = passwordEncoder.encode(medico.getSenha().trim());
            medico.setSenha(senhaCriptografada);
        }

        // Salvar o médico primeiro
        Medico medicoSalvo = medicoRepository.save(medico);

        // Criar usuário para o médico
        try {
            Usuario usuario = new Usuario();
            usuario.setEmail(medico.getEmail());
            usuario.setSenha(medico.getSenha()); // Já está criptografada
            usuario.setTipo("MEDICO");
            usuario.setIdMedico(medicoSalvo.getId());

            usuarioRepository.save(usuario);
        } catch (Exception e) {
            // Se falhar ao criar usuário, remove o médico criado (rollback)
            medicoRepository.deleteById(medicoSalvo.getId());
            throw new RuntimeException("Erro ao criar usuário para o médico: " + e.getMessage());
        }

        return medicoSalvo;
    }

    // Atualizar médico
    public Medico atualizarMedico(Long id, Medico medicoAtualizado) {
        Optional<Medico> medicoExistente = medicoRepository.findById(id);
        
        if (medicoExistente.isEmpty()) {
            throw new RuntimeException("Médico não encontrado com ID: " + id);
        }

        Medico medico = medicoExistente.get();

        // Validar se hospital existe (se foi fornecido)
        if (medicoAtualizado.getHospitalId() != null) {
            Optional<Hospital> hospital = hospitalRepository.findById(medicoAtualizado.getHospitalId());
            if (hospital.isEmpty()) {
                throw new RuntimeException("Hospital não encontrado com ID: " + medicoAtualizado.getHospitalId());
            }
        }

        // Validar se CRM já existe (para outro médico)
        if (medicoAtualizado.getCrm() != null && 
            medicoRepository.existsByCrmAndIdNot(medicoAtualizado.getCrm(), id)) {
            throw new RuntimeException("CRM já cadastrado para outro médico: " + medicoAtualizado.getCrm());
        }

        // Validar se email já existe (para outro médico)
        if (medicoAtualizado.getEmail() != null && 
            medicoRepository.existsByEmailAndIdNot(medicoAtualizado.getEmail(), id)) {
            throw new RuntimeException("Email já cadastrado para outro médico: " + medicoAtualizado.getEmail());
        }

        // Atualizar campos
        if (medicoAtualizado.getNome() != null) {
            medico.setNome(medicoAtualizado.getNome());
        }
        if (medicoAtualizado.getEmail() != null) {
            medico.setEmail(medicoAtualizado.getEmail());
        }
        if (medicoAtualizado.getCpf() != null) {
            medico.setCpf(medicoAtualizado.getCpf());
        }
        if (medicoAtualizado.getTelefone() != null) {
            medico.setTelefone(medicoAtualizado.getTelefone());
        }
        if (medicoAtualizado.getCrm() != null) {
            medico.setCrm(medicoAtualizado.getCrm());
        }
        if (medicoAtualizado.getEspecialidade() != null) {
            medico.setEspecialidade(medicoAtualizado.getEspecialidade());
        }
        if (medicoAtualizado.getHospitalId() != null) {
            medico.setHospitalId(medicoAtualizado.getHospitalId());
        }
        if (medicoAtualizado.getAtivo() != null) {
            medico.setAtivo(medicoAtualizado.getAtivo());
        }
        if (medicoAtualizado.getFoto() != null) {
            medico.setFoto(medicoAtualizado.getFoto());
        }
        if (medicoAtualizado.getIdEndereco() != null) {
            medico.setIdEndereco(medicoAtualizado.getIdEndereco());
        }

        // Atualizar senha se fornecida
        if (medicoAtualizado.getSenha() != null && !medicoAtualizado.getSenha().trim().isEmpty()) {
            String senhaCriptografada = passwordEncoder.encode(medicoAtualizado.getSenha().trim());
            medico.setSenha(senhaCriptografada);
        }

        return medicoRepository.save(medico);
    }

    // Deletar médico (hard delete)
    public void deletarMedico(Long id) {
        Optional<Medico> medico = medicoRepository.findById(id);
        
        if (medico.isEmpty()) {
            throw new RuntimeException("Médico não encontrado com ID: " + id);
        }

        medicoRepository.deleteById(id);
    }

    // Desativar médico (soft delete)
    public Medico desativar(Long id) {
        Optional<Medico> medicoExistente = medicoRepository.findById(id);
        
        if (medicoExistente.isEmpty()) {
            throw new RuntimeException("Médico não encontrado com ID: " + id);
        }

        Medico medico = medicoExistente.get();
        medico.setAtivo(false);
        
        return medicoRepository.save(medico);
    }

    // Ativar médico
    public Medico ativar(Long id) {
        Optional<Medico> medicoExistente = medicoRepository.findById(id);
        
        if (medicoExistente.isEmpty()) {
            throw new RuntimeException("Médico não encontrado com ID: " + id);
        }

        Medico medico = medicoExistente.get();
        medico.setAtivo(true);
        
        return medicoRepository.save(medico);
    }

    // Contar médicos por hospital
    public Long contarPorHospital(Long hospitalId) {
        return medicoRepository.countByHospitalId(hospitalId);
    }

    // Buscar médico por CRM
    public Optional<Medico> buscarPorCrm(String crm) {
        return medicoRepository.findByCrm(crm);
    }

    // Buscar médico por CPF
    public Optional<Medico> buscarPorCpf(String cpf) {
        return medicoRepository.findByCpf(cpf);
    }


}