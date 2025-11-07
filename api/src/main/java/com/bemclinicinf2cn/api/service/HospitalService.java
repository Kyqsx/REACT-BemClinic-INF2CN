package com.bemclinicinf2cn.api.service;

import com.bemclinicinf2cn.api.domain.Endereco;
import com.bemclinicinf2cn.api.domain.Hospital;
import com.bemclinicinf2cn.api.domain.Usuario;
import com.bemclinicinf2cn.api.repository.EnderecoRepository;
import com.bemclinicinf2cn.api.repository.HospitalRepository;
import com.bemclinicinf2cn.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private EnderecoRepository enderecoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Hospital> listarTodos() {
        return hospitalRepository.findAll();
    }

    public Optional<Hospital> buscarPorId(Long id) {
        return hospitalRepository.findById(id);
    }

    @Transactional
    public Hospital criar(Hospital hospital) {
        if (hospitalRepository.existsByCnpj(hospital.getCnpj())) {
            throw new RuntimeException("CNPJ já cadastrado");
        }
        
        if (hospital.getEmail() == null || hospital.getEmail().trim().isEmpty()) {
            throw new RuntimeException("E-mail do hospital é obrigatório");
        }
        
        // Verifica se já existe usuário com este e-mail
        if (usuarioRepository.findByEmail(hospital.getEmail()).isPresent()) {
            throw new RuntimeException("Já existe um usuário com este e-mail");
        }
        
        // Salva o hospital primeiro
        Hospital hospitalSalvo = hospitalRepository.save(hospital);
        
        // Gera uma senha temporária (CNPJ sem pontuação)
        String senhaTemporaria = hospital.getCnpj().replaceAll("[^0-9]", "");
        
        // Cria o usuário do tipo HOSPITAL
        Usuario usuario = new Usuario();
        usuario.setEmail(hospital.getEmail());
        usuario.setSenha(passwordEncoder.encode(senhaTemporaria));
        usuario.setTipo("HOSPITAL");
        usuario.setIdHospital(hospitalSalvo.getId());
        
        usuarioRepository.save(usuario);
        
        System.out.println("✅ Hospital cadastrado: " + hospitalSalvo.getNome());
        System.out.println("📧 E-mail: " + hospital.getEmail());
        System.out.println("🔑 Senha temporária: " + senhaTemporaria + " (CNPJ sem pontuação)");
        
        return hospitalSalvo;
    }

    @Transactional
    public Hospital atualizar(Long id, Hospital hospitalAtualizado) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospital não encontrado"));

        // Se o e-mail mudou, atualiza o usuário também
        if (hospitalAtualizado.getEmail() != null && 
            !hospitalAtualizado.getEmail().equals(hospital.getEmail())) {
            
            // Verifica se o novo e-mail já existe
            Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(hospitalAtualizado.getEmail());
            if (usuarioExistente.isPresent() && 
                !usuarioExistente.get().getIdHospital().equals(id)) {
                throw new RuntimeException("Já existe um usuário com este e-mail");
            }
            
            // Busca o usuário do hospital e atualiza o e-mail
            Optional<Usuario> usuarioOpt = usuarioRepository.findAll().stream()
                    .filter(u -> u.getIdHospital() != null && u.getIdHospital().equals(id))
                    .findFirst();
            
            if (usuarioOpt.isPresent()) {
                Usuario usuario = usuarioOpt.get();
                usuario.setEmail(hospitalAtualizado.getEmail());
                usuarioRepository.save(usuario);
            }
        }

        hospital.setNome(hospitalAtualizado.getNome());
        hospital.setCnpj(hospitalAtualizado.getCnpj());
        hospital.setRazaoSocial(hospitalAtualizado.getRazaoSocial());
        hospital.setTelefone(hospitalAtualizado.getTelefone());
        hospital.setEmail(hospitalAtualizado.getEmail());
        hospital.setTipoEstabelecimento(hospitalAtualizado.getTipoEstabelecimento());
        hospital.setEspecialidades(hospitalAtualizado.getEspecialidades());
        hospital.setHorarioFuncionamento(hospitalAtualizado.getHorarioFuncionamento());
        hospital.setAtendimentoEmergencia(hospitalAtualizado.getAtendimentoEmergencia());
        hospital.setNumeroLeitos(hospitalAtualizado.getNumeroLeitos());
        hospital.setDiretorResponsavel(hospitalAtualizado.getDiretorResponsavel());
        hospital.setCnes(hospitalAtualizado.getCnes());
        hospital.setObservacoes(hospitalAtualizado.getObservacoes());

        // Atualizar endereço se fornecido
        if (hospitalAtualizado.getEndereco() != null) {
            Endereco endereco = hospitalAtualizado.getEndereco();
            if (endereco.getId_endereco() != null) {
                endereco = enderecoRepository.findById(endereco.getId_endereco())
                        .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));
            }
            hospital.setEndereco(endereco);
        }

        return hospitalRepository.save(hospital);
    }

    @Transactional
    public void deletar(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospital não encontrado"));
        
        // Remove o usuário associado ao hospital
        Optional<Usuario> usuarioOpt = usuarioRepository.findAll().stream()
                .filter(u -> u.getIdHospital() != null && u.getIdHospital().equals(id))
                .findFirst();
        
        if (usuarioOpt.isPresent()) {
            usuarioRepository.delete(usuarioOpt.get());
            System.out.println("🗑️ Usuário do hospital removido");
        }
        
        hospitalRepository.delete(hospital);
        System.out.println("🗑️ Hospital removido: " + hospital.getNome());
    }

    public Optional<Hospital> buscarPorCnpj(String cnpj) {
        return hospitalRepository.findByCnpj(cnpj);
    }

    public Optional<Hospital> buscarPorEmail(String email) {
        return hospitalRepository.findByEmail(email);
    }

    @Transactional
    public String redefinirSenha(Long hospitalId) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new RuntimeException("Hospital não encontrado"));
        
        // Busca o usuário do hospital
        Optional<Usuario> usuarioOpt = usuarioRepository.findAll().stream()
                .filter(u -> u.getIdHospital() != null && u.getIdHospital().equals(hospitalId))
                .findFirst();
        
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuário do hospital não encontrado");
        }
        
        Usuario usuario = usuarioOpt.get();
        
        // Gera uma nova senha temporária (CNPJ sem pontuação)
        String novaSenha = hospital.getCnpj().replaceAll("[^0-9]", "");
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);
        
        System.out.println("🔑 Senha redefinida para hospital: " + hospital.getNome());
        System.out.println("📧 E-mail: " + hospital.getEmail());
        System.out.println("🔑 Nova senha: " + novaSenha);
        
        return novaSenha;
    }
}
