
import { useEffect, useState } from 'react'
import { Titulo } from '../../../../components/Navegacao/Titulo'
import { Breadcrumbs } from '../../../../components/Navegacao/Breadcrumbs'


import { Box, Divider, FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'

import { FormProvider, useForm } from 'react-hook-form'
import { Arquivo, ArquivoSalvar, IEixo, IEvento, IEventoSalvar,IListaEventos, ITipoEvento } from '../../../../services/sisConferenciaApi/eventos/types'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDrawer } from '../../../../components/CidadaniaApp/Drawer/hooks/useDrawer'
import { BotaoPadrao } from '../../../../components/Formulario/BotaoPadrao'
import { useNavigate, useParams } from 'react-router-dom'
import { FormContainer } from '../../../../components/Formulario/FormContainer'
import { RHFText } from '../../../../components/Formulario/reactHookForms/RHFText'
import { RHFSelect } from '../../../../components/Formulario/reactHookForms/RHFSelect'
import RHFTextArea from '../../../../components/Formulario/TextArea'
import { RHFDate } from '../../../../components/Formulario/reactHookForms/RHFDate'
import RHFInputFile from '../../../../components/Formulario/InputFile'
import apiServiceTipoEvento from '../../../../services/sisConferenciaApi/tipoEvento'
import apiServiceTipoRegime from '../../../../services/sisConferenciaApi/tipoRegime'
import apiServicePortaria from '../../../../services/sisConferenciaApi/portaria'
import { ITipoRegime } from '../../../../services/sisConferenciaApi/tipoRegime/types'
import { IPortaria } from '../../../../services/sisConferenciaApi/portaria/types'
import { ITipoFormato } from '../../../../services/sisConferenciaApi/tipoFormato/types'
import apiServiceTipoFormato from '../../../../services/sisConferenciaApi/tipoFormato'
import Eixo from '../../Eixo'
import { useToast } from '../../../../hooks/useToast'
import apiService from '../../../../services/sisConferenciaApi/eventos';
import { borderRadius } from '@mui/system'
import { arrayBufferToBase64, fileToArrayBuffer, getFileAsByteArray } from '../../../../utils/files'


interface Props {
}



const RegistrarEvento = () => {

    const { isDesktop } = useDrawer()
    const navigate = useNavigate()
    const [editItem, setEditItem] = useState(false)
    const [fileBytes, setFileBytes] = useState<string | null>(null);
    const [imageURL, setImageURL] = useState<string | null>(null);
    

    const { id } = useParams()

    const [ativo, setAtivo] = useState<string>('true');
    
    const FormSchema = yup.object().shape({
         nome: yup.string().required('Campo de preenchimento obrigatório *'),   
         tipoFormato: yup.string().required('Campo de preenchimento obrigatório *'),  
         tipoEvento: yup.string().required('Campo de preenchimento obrigatório *'),  
         dataInicial: yup.string().required('Campo de preenchimento obrigatório *'),  
         dataFinal: yup.string().required('Campo de preenchimento obrigatório *'),  

    });

    const { toastSuccess, toastError } = useToast();

    const [excluir, setExcluir] = useState(false)

    const rhfmethods = useForm<IEventoSalvar>({ resolver: yupResolver(FormSchema) })

    const paginaEventos = '/administracao/eventos'

    const gridStyle = {
        boxShadow: '2px 0px 10px #00000029'
    };

   
    const [listaEixo,setListaEixo]= useState<IEixo[]>([]);
    const [tiposEvento, setTiposEvento] = useState<ITipoEvento[]>([]);
    const [tipoFormatos, setTipoFormatos] = useState<ITipoFormato[]>([]);
    const [portarias, setPortarias] = useState<IPortaria[]>([]);




    //Carrega Dados Evento 
    useEffect(() => {
        const buscarEvento = async () => {
            try {
                if (id) {
                    const result: any = await apiService.buscar(Number(id))

                    const eventoLoad: IEvento = result
                    console.log(eventoLoad);

                    rhfmethods.setValue('id', id !== undefined ? parseInt(id) : 0)
                    rhfmethods.setValue('nome', eventoLoad.nome)
                    rhfmethods.setValue('tipoEvento', eventoLoad.tipoEvento.id)
                    rhfmethods.setValue('tipoFormato', eventoLoad.tipoFormato.id)
                    rhfmethods.setValue('tipoFormato', eventoLoad.tipoFormato.id)
                    rhfmethods.setValue('dataInicial', eventoLoad.dataInicial)
                    rhfmethods.setValue('dataFinal', eventoLoad.dataFinal)
                    rhfmethods.setValue('portaria', eventoLoad.portaria.id)
                    rhfmethods.setValue('tema', eventoLoad.tema)
                    rhfmethods.setValue('objetivo', eventoLoad.objetivo)
                    rhfmethods.setValue('ativo', eventoLoad.ativo)
                    setListaEixo(eventoLoad.eixos)
                    //carrega imagem na tela
                    let base64String = eventoLoad.imagem.byteArquivo; 
                    setImageURL(`data:image/jpeg;base64,${base64String}`);
                    setEditItem(true)

                }
            } catch (error) {
                console.error(error)
            }
            
                
        };
        
        buscarEvento();
    }, []);












    //Carrega combos
    useEffect(() => {
        const atualizarListaCombos = async () => {
            try {
                const result = await apiServiceTipoEvento.listar();
                if (Array.isArray(result)) {
                    setTiposEvento(result);
                } else {
                    console.error("Erro ao obter Tipo Evento");
                }
            }
            catch(error){
                console.error(error)
            }
            try {
                const result = await apiServiceTipoFormato.listar();
                if (Array.isArray(result)) {
                    setTipoFormatos(result);
                } else {
                    console.error("Erro ao obter Tipo Regime");
                }
            }
            catch(error){
                console.error(error)
            }
             
            try {
                const result = await apiServicePortaria.listar();
                if (Array.isArray(result)) {
                    setPortarias(result);
                } else {
                    console.error("Erro ao obter lista de portarias");
                }
            }
            catch(error){
                console.error(error)
            }
             
                
        };
        
        atualizarListaCombos();
    }, []);


    

    //Salvar Evento
    const handleSalvar = async (item: any) => {
        let msg = 'Dados salvos com sucesso.'

    
        item.eixos = listaEixo

        //processar bytes imagem upload    
       
        const arquivo: ArquivoSalvar = {
            id: 0,  
            byteArquivo: fileBytes,
        };
        

        item.imagem = arquivo
        setFileBytes(null);
        
        let id = 0
        if(editItem){
            id = item.id
        }

        console.log('evento', item)
        const dataSave = {
                id: id ? Number(id) : undefined,
                dataCadastro: new Date(),
                dataFinal: new Date(item.dataFinal),
                dataInicial: new Date(item.dataInicial),
                objetivo: item.objetivo,
                nome: item.nome,
                portaria: item.portaria,
                ativo: ativo === "true",
                eixos: item.eixos,
                tema: item.tema,
                imagem: item.imagem,
                tipoEvento: item.tipoEvento,
                tipoFormato: item.tipoFormato,
        } as unknown as IEventoSalvar

        console.log(dataSave)
        let evento: IEventoSalvar

        if (editItem) {
            evento = await apiService.atualizar(dataSave.id, dataSave)
        } else {
            evento = await apiService.criar(dataSave)
        }
        
        toastSuccess('Evento adicionado com sucesso.')

    }

      const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        

        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          const bytes = await getFileAsByteArray(file);


          const arrayBuffer = await fileToArrayBuffer(file);
          const base64String = arrayBufferToBase64(arrayBuffer);
          
          //carrega array de byte para mandar a imagem ao back
          setFileBytes(base64String);

          //carrega imagem na tela
          const blob = new Blob([bytes], { type: 'image/jpeg' }); 
          const url = URL.createObjectURL(blob);
          setImageURL(url);
        
        }
      };

   
    const deletarEvento = async () => {
        await apiService.excluir(id)
        toastSuccess('Evento excluído com sucesso.')
        navigate('/administracao/eventos')
    }
    return (
        <>
            <Breadcrumbs
                current={`Cadastrar Evento`}
                prevCrumbs={[{ name: 'Administração' },{ name: 'Eventos' }]}
            />
            <Grid padding={2}>
              <Grid style={gridStyle} padding={2}>

                 <Grid   paddingLeft={2} paddingRight={2} paddingTop={1} paddingBottom={1}>
                    <Titulo titulo={`Cadastrar Evento`} voltar={paginaEventos} />
                 </Grid>
           

                <FormProvider {...rhfmethods}>

             
                    <FormContainer>
                    <Grid  padding={2} item xs={12}>
                            <FormContainer>
                                <RHFText
                                    name={'nome'}
                                    label={'Nome'}
                                    gridProps={{ lg: 12}}
                                    inputProps={{ maxLength: 100 }}
                                    InputLabelProps={{ shrink: true }}
                                    onChange={(e) => {
                                        const v = e.target.value
                                        rhfmethods.setValue('nome', v)
                                    }}
                                />

                               <RHFSelect name='tipoEvento' label='Tipo do Evento' gridProps={{ lg: 6 }}>
                                    {tiposEvento.map((tipo) => (
                                        <MenuItem key={tipo.id} value={tipo.id}>
                                            {tipo.descricao}
                                        </MenuItem>
                                    ))}
                                </RHFSelect>
                                
                                <RHFSelect name='tipoFormato' label='TipoFormato do Evento' gridProps={{ lg:6 }}>
                                    {tipoFormatos.map((tipo) => (
                                        <MenuItem key={tipo.id} value={tipo.id}>
                                            {tipo.descricao}
                                        </MenuItem>
                                    ))}
                                </RHFSelect>
                             
                             </FormContainer>
                        </Grid>   

                        <Grid padding={2} item xs={12}>

                             <Titulo titulo={`Período`} />
                             <FormContainer>
                                <RHFDate
                                    name={'dataInicial'}
                                    label={'Inicio'}
                                    minDate={new Date()}
                                    gridProps={{ lg: 6 }}
                                />

                                <RHFDate
                                    name={'dataFinal'}
                                    label={'Fim'}
                                    minDate={new Date()}
                                    gridProps={{ lg: 6 }}
                                />
                            </FormContainer>
                        </Grid>

                        <Grid  padding={2} item xs={12}>

                            <Titulo titulo={`Portaría`} />
                            <FormContainer>
                                    <RHFSelect name='portaria' label='Portaria' gridProps={{ lg:12 }}>
                                    {portarias.map((portaria) => (
                                        <MenuItem key={portaria.id} value={portaria.id}>
                                          {portaria.numero} - {portaria.descricao} -{portaria.dataPortaria}
                                        </MenuItem>
                                    ))}
                                    </RHFSelect>
                            </FormContainer>
                        </Grid>

                        <Grid  padding={2} item xs={12}>
                            <Titulo titulo={`Outras informações`} />
                            <FormContainer>
                                <RHFText
                                    name={'tema'}
                                    label={'Tema'}
                                    gridProps={{ lg: 6}}
                                    inputProps={{ maxLength: 100 }}
                                    InputLabelProps={{ shrink: true }}
                                    onChange={(e) => {
                                        const v = e.target.value
                                        rhfmethods.setValue('tema', v)
                                    }}
                                />


                                <RHFTextArea 
                                    name="objetivo"
                                    label="Objetivo"
                                    control={rhfmethods.control as any} // passando o 'control' para o RHFTextArea
                                    rules={{ required: true }}
                                    defaultValue=""
                                    rows={4}
                                    gridProps={{ lg: 12 }}
                                    onChange={(e) => {
                                        const v = e.target.value
                                        rhfmethods.setValue('objetivo', v)
                                    }}
                                />



                                <Grid  padding={2} item xs={12}>

                                <Titulo titulo={`Imagem`} />
                                    
                                    {imageURL && (
                                        <Grid  padding={2} item xs={12}>
                                            <img src={imageURL} alt="Pré-visualização da imagem"  style={{ maxWidth: '100%', maxHeight: '300px'}} />
                                        </Grid>
                                    )}  
                                    <RHFInputFile 
                                        name="imagem" 
                                        label="" 
                                        control={rhfmethods.control as any} 
                                        gridProps={{ lg: 12 }}
                                        onFileChange={onFileChange}  
                                    />
                                  
                                </Grid>

                                <Grid  padding={2} item xs={12}>

                                    <Titulo titulo={`Status`} />
                                        <FormContainer>
                                        <RadioGroup name="ativo" value={ativo} onChange={(e) => setAtivo(e.target.value)}>
                                            <FormControlLabel value="true" control={<Radio />} label="Ativo" />
                                            <FormControlLabel value="false" control={<Radio />} label="Inativo" />
                                        </RadioGroup>
                                        </FormContainer>
                                </Grid>
                               
                                <Grid  padding={2} item xs={12}>
                                    <Titulo titulo={`Eixos`} />
                                    <Eixo listaEixos={listaEixo} setEixos={setListaEixo} idEvento={id !== undefined ? parseInt(id) : 0}></Eixo>                 
                                </Grid>
                                
                            </FormContainer>
                        </Grid>                    
                                  
                    </FormContainer>
                


                    <Grid
                        item
                        xs={12}
                        style={{
                            display: isDesktop ? 'flex' : 'block',
                            justifyContent: 'end',
                            alignItems: 'end',
                        }}
                    >
                        <BotaoPadrao
                            variant='outlined'
                            size={'large'}
                            onClick={() => navigate('/administracao/eventos')}
                            startIcon={<ArrowBackIcon fontSize='small' />}
                        >
                            Voltar para lista
                        </BotaoPadrao>

                        { id
                        && (
                            <BotaoPadrao
                                color='error'
                                variant='outlined'
                                type='button'
                                size={'large'}
                                onClick={() => deletarEvento() }
                                startIcon={<DeleteIcon fontSize='small' />}
                                style={{
                                    marginTop: isDesktop ? 0 : 10,
                                    marginLeft: isDesktop ? 10 : 0,
                                }}
                            >
                                Excluir
                            </BotaoPadrao>
                        )}

                        <BotaoPadrao
                            size={'large'}
                            type='submit'
                            onClick={rhfmethods.handleSubmit(handleSalvar)}
                            style={{
                                marginTop: isDesktop ? 0 : 10,
                                marginLeft: isDesktop ? 10 : 0,
                            }}
                        >
                            <AddCircleOutlineIcon fontSize='small' style={{ marginRight: 10 }} />
                            { id  ? 'Salvar Evento' : 'Criar Evento'}
                        </BotaoPadrao>
                    </Grid>
                </FormProvider>


            </Grid>
            </Grid>
        </>
    )
}



export default RegistrarEvento
