package com.bemclinicinf2cn.api.service;

import com.bemclinicinf2cn.api.domain.Consulta;
import com.bemclinicinf2cn.api.domain.Consulta.StatusConsulta;
import com.bemclinicinf2cn.api.domain.Medico;
import com.bemclinicinf2cn.api.domain.Paciente;
import com.bemclinicinf2cn.api.dto.ConsultaResponseDTO;
import com.bemclinicinf2cn.api.repository.ConsultaRepository;
import com.bemclinicinf2cn.api.repository.MedicoRepository;
import com.bemclinicinf2cn.api.repository.PacienteRepository;
import com.bemclinicinf2cn.api.request.ConsultaRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    // Criar nova consulta (paciente solicita)
    public ConsultaResponseDTO criarConsulta(ConsultaRequest request) {
        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        Consulta consulta = new Consulta();
        consulta.setPaciente(paciente);
        consulta.setDataPreferencia(request.getDataPreferencia());
        consulta.setHorarioPreferencia(request.getHorarioPreferencia());
        consulta.setLocalPreferencia(request.getLocalPreferencia());
        consulta.setEspecialidade(request.getEspecialidade());
        consulta.setObservacoes(request.getObservacoes());

        // Se médico foi especificado
        if (request.getMedicoId() != null) {
            Medico medico = medicoRepository.findById(request.getMedicoId())
                    .orElseThrow(() -> new RuntimeException("Médico não encontrado"));
            consulta.setMedico(medico);
        }

        Consulta consultaSalva = consultaRepository.save(consulta);
        return new ConsultaResponseDTO(consultaSalva);
    }

    // Buscar todas as consultas pendentes (para hospitais verem)
    public List<ConsultaResponseDTO> listarConsultasPendentes() {
        List<Consulta> consultas = consultaRepository.findByStatusOrderByDataCriacaoDesc(StatusConsulta.PENDENTE);
        return consultas.stream()
                .map(ConsultaResponseDTO::new)
                .collect(Collectors.toList());
    }

    // Buscar consultas por paciente
    public List<ConsultaResponseDTO> listarConsultasPorPaciente(Long pacienteId) {
        List<Consulta> consultas = consultaRepository.findByPacienteId(pacienteId);
        return consultas.stream()
                .map(ConsultaResponseDTO::new)
                .collect(Collectors.toList());
    }

    // Aceitar consulta (hospital aceita)
    public ConsultaResponseDTO aceitarConsulta(Long consultaId, Long hospitalId) {
        Consulta consulta = consultaRepository.findById(consultaId)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

        if (consulta.getStatus() != StatusConsulta.PENDENTE) {
            throw new RuntimeException("Consulta não está pendente");
        }

        consulta.setStatus(StatusConsulta.ACEITA);
        consulta.setIdHospitalAceito(hospitalId);
        consulta.setDataAtualizacao(LocalDate.now());

        Consulta consultaAtualizada = consultaRepository.save(consulta);
        return new ConsultaResponseDTO(consultaAtualizada);
    }

    // Recusar consulta (hospital recusa)
    public ConsultaResponseDTO recusarConsulta(Long consultaId) {
        Consulta consulta = consultaRepository.findById(consultaId)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

        if (consulta.getStatus() != StatusConsulta.PENDENTE) {
            throw new RuntimeException("Consulta não está pendente");
        }

        consulta.setStatus(StatusConsulta.RECUSADA);
        consulta.setDataAtualizacao(LocalDate.now());

        Consulta consultaAtualizada = consultaRepository.save(consulta);
        return new ConsultaResponseDTO(consultaAtualizada);
    }

    // Cancelar consulta
    public ConsultaResponseDTO cancelarConsulta(Long consultaId) {
        Consulta consulta = consultaRepository.findById(consultaId)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

        consulta.setStatus(StatusConsulta.CANCELADA);
        consulta.setDataAtualizacao(LocalDate.now());

        Consulta consultaAtualizada = consultaRepository.save(consulta);
        return new ConsultaResponseDTO(consultaAtualizada);
    }

    // Buscar consulta por ID
    public ConsultaResponseDTO buscarConsultaPorId(Long id) {
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));
        return new ConsultaResponseDTO(consulta);
    }

    // Listar todas as consultas
    public List<ConsultaResponseDTO> listarTodasConsultas() {
        List<Consulta> consultas = consultaRepository.findAll();
        return consultas.stream()
                .map(ConsultaResponseDTO::new)
                .collect(Collectors.toList());
    }

    // Listar consultas por hospital
    public List<ConsultaResponseDTO> listarConsultasPorHospital(Long hospitalId) {
        List<Consulta> consultas = consultaRepository.findByIdHospitalAceito(hospitalId);
        return consultas.stream()
                .map(ConsultaResponseDTO::new)
                .collect(Collectors.toList());
    }
}
