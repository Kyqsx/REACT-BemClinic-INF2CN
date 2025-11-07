package com.bemclinicinf2cn.api.service;

import com.bemclinicinf2cn.api.domain.Paciente;
import com.bemclinicinf2cn.api.domain.Endereco;
import com.bemclinicinf2cn.api.dto.EnderecoDTO;
import com.bemclinicinf2cn.api.repository.PacienteRepository;
import com.bemclinicinf2cn.api.repository.EnderecoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class EnderecoService {

    @Autowired
    private EnderecoRepository enderecoRepository;

    @Autowired
    private PacienteRepository repository;

    public List<EnderecoDTO> listarEnderecos() {
        return enderecoRepository.findAllBasic();
    }

    // ✅ Adicione este método
    public List<EnderecoDTO> listarEnderecosPorPaciente(Long pacienteId) {
        Optional<EnderecoDTO> enderecoOpt = getEnderecoPrincipalDoPaciente(pacienteId);
        if (enderecoOpt.isPresent()) {
            List<EnderecoDTO> lista = new ArrayList<>();
            lista.add(enderecoOpt.get());
            return lista;
        }
        return new ArrayList<>(); // Retorna lista vazia
    }

    public Optional<EnderecoDTO> getEnderecoById(Long id) {
        return enderecoRepository.findBasicById(id);
    }

    public Endereco incluir(Endereco endereco) {
        return enderecoRepository.save(endereco);
    }

    public Endereco atualizar(Long id, Endereco endereco) {
        if (enderecoRepository.existsById(id)) {
            endereco.setId_endereco(id);
            return enderecoRepository.save(endereco);
        }
        return null;
    }

    public boolean deletar(Long id) {
        if (enderecoRepository.existsById(id)) {
            enderecoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean associarEnderecoAoPaciente(Long id_endereco, Long idPaciente) {
        try {
            // Busca o paciente pelo ID
            Optional<Paciente> pacienteOpt = repository.findById(idPaciente);
            if (pacienteOpt.isPresent()) {
                Paciente paciente = pacienteOpt.get();
                // Atualiza o campo id_endereco do paciente
                paciente.setIdEndereco(id_endereco);
                // Salva o paciente atualizado
                repository.save(paciente);
                return true;
            } else {
                // Paciente nao encontrado
                return false;
            }
        } catch (Exception e) {
            // Log do erro
            e.printStackTrace(); // Use um logger em producao
            return false; // Falha na associacao
        }
    }


    public Optional<EnderecoDTO> getEnderecoPrincipalDoPaciente(Long idPaciente) {
        try {
            Optional<Paciente> pacienteOpt = repository.findById(idPaciente);
            if (pacienteOpt.isPresent()) {
                Paciente paciente = pacienteOpt.get();
                Long idEnderecoPrincipal = paciente.getIdEndereco();
                if (idEnderecoPrincipal != null) {
                    return enderecoRepository.findBasicById(idEnderecoPrincipal);
                }
            }
            return Optional.empty(); // Paciente nao encontrado ou sem endereco principal
        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty(); // Erro ao buscar
        }
    }

}