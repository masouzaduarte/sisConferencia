package br.gov.mds.sisConferencia.service.mapper;

import br.gov.mds.sisConferencia.config.mapper.EntityMapper;
import br.gov.mds.sisConferencia.models.Eixo;
import br.gov.mds.sisConferencia.service.dto.EixoDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@ComponentScan
public class EixoMapper implements EntityMapper<EixoDTO, Eixo> {

    private static ModelMapper mapper;

    @Autowired
    public void setModelMapper(ModelMapper mapper) {
        EixoMapper.mapper = mapper;
    }

    @Override
    public Eixo toEntity(EixoDTO eixoDTO) {
        return mapper.map(eixoDTO, Eixo.class);
    }

    @Override
    public EixoDTO toDto(Eixo eixo) {
        return mapper.map(eixo, EixoDTO.class);
    }

    @Override
    public List<Eixo> toEntity(List<EixoDTO> eixoDTOList) {
        return eixoDTOList.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<EixoDTO> toDto(List<Eixo> eixoList) {
        return eixoList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}