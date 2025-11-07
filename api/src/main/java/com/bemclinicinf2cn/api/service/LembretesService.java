package com.bemclinicinf2cn.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bemclinicinf2cn.api.domain.Lembrete;
import com.bemclinicinf2cn.api.repository.LembretesRepository;

@Service
public class LembretesService {
    @Autowired
    private LembretesRepository lembretesRepository;


    // Listar todos os usuários
    public List<Lembrete> listarLembretes() {
        return (List<Lembrete>) lembretesRepository.findAll();
    }

    // Incluir novo usuário
    public Lembrete incluir(Lembrete lembrete) {
        return lembretesRepository.save(lembrete);
    }

    // Excluir usuário
    public void excluir(Long id) {
        lembretesRepository.deleteById(id);
    }

    // Atualizar lembrete
    public Lembrete atualizar(Long id, Lembrete lembrete) {
        if (lembretesRepository.existsById(id)) {
            lembrete.setId(id);
            return lembretesRepository.save(lembrete);
        }
        return null; // ou lançar uma exceção   
    }
}
