package br.gov.mds.sisConferencia.service;

import br.gov.mds.sisConferencia.config.mapper.EntityMapper;
import br.gov.mds.sisConferencia.service.dto.PerfilDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.gov.mds.sisConferencia.models.Perfil;
import br.gov.mds.sisConferencia.repository.PerfilRepository;

import javax.transaction.Transactional;

@Service
public class PerfilService extends GenericService<Perfil , Long> {

	@Autowired
	EntityMapper<PerfilDTO, Perfil> entityMapper;

	@Transactional
	public PerfilDTO salvar(PerfilDTO perfilDTO) {
		return this.entityMapper.toDto(save(this.entityMapper.toEntity(perfilDTO)));
	}

	public PerfilService(PerfilRepository repository) {
		super(repository);
	}

	@Transactional
	public Perfil atualizar(Long id, Perfil perfil) {
		Perfil existingPerfil = findById(id);
		existingPerfil.setDescricao(perfil.getDescricao());
		return save(existingPerfil);
		
	}

}
