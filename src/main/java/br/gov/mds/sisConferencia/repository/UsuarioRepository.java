package br.gov.mds.sisConferencia.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.gov.mds.sisConferencia.models.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

}
