package com.bemclinicinf2cn.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bemclinicinf2cn.api.domain.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

        Optional<Usuario> findByEmail(String email);

        @Query("SELECT u FROM Usuario u WHERE u.email = :email AND u.tipo = :tipo")
        Optional<Usuario> findByEmailAndTipo(@Param("email") String email, @Param("tipo") String tipo);

        @Query("SELECT u FROM Usuario u WHERE " +
                "(u.idPaciente = :idPaciente AND :idPaciente IS NOT NULL) OR " +
                "(u.idMedico = :idMedico AND :idMedico IS NOT NULL)")
        Optional<Usuario> findByPacienteIdOrMedicoId(
                @Param("idPaciente") Long idPaciente,
                @Param("idMedico") Long idMedico);

        // Buscar usuários por tipo
        List<Usuario> findByTipo(String tipo);
}