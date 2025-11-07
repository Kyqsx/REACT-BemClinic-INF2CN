package com.bemclinicinf2cn.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bemclinicinf2cn.api.domain.Vacina;
import com.bemclinicinf2cn.api.repository.VacinasRepository;

@Service
public class VacinasService {
    @Autowired
    private VacinasRepository vacinasRepository;


    // Listar todos as vacinas
    public List<Vacina> listarVacinas() {
        return (List<Vacina>) vacinasRepository.findAll();
    }

    // Incluir nova vacina
    public Vacina incluir(Vacina vacina) {
        return vacinasRepository.save(vacina);
    }

    // Excluir vacina
    public void excluir(Long id) {
        vacinasRepository.deleteById(id);
    }

    // Atualizar vacina
    public Vacina atualizar(Long id, Vacina vacina) {
        if (vacinasRepository.existsById(id)) {
            vacina.setId(id);
            return vacinasRepository.save(vacina);
        }
        return null; // ou lançar uma exceção   
    }
}
