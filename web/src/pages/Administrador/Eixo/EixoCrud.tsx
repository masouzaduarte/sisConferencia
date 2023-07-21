import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    Typography,
} from '@mui/material'



import { RHFText } from '../../../components/Formulario/reactHookForms/RHFText'
import { BotaoPadrao } from '../../../components/Formulario/BotaoPadrao'

import { useToast } from '../../../hooks/useToast'
import Mask from '../../../utils/mask'
import { useNavigate } from 'react-router-dom'
import { CustomTable } from '../../../components/Tabela/CustomTable'
import { IEixo } from '../../../services/sisConferenciaApi/eventos/types'
import RHFTextArea from '../../../components/Formulario/TextArea'

interface ColumnConfig {
    key: string
    displayName: string
    width?: number
    visible?: boolean
}

interface Props {
    visible: boolean
    eixos: IEixo[]
    setEixos: (eixos: IEixo[]) => void
    columnConfig: ColumnConfig[]
}

const EixoCrud = ({ visible, eixos, setEixos,columnConfig }: Props) => {
    const navigate = useNavigate()
    const [isForm, setIsForm] = useState(false)
    const [editItem, setEditItem] = useState<IEixo | null>(null)

    const adicionarEixo = (item: IEixo) => {
        const index = eixos.findIndex((eixo) => eixo.id === item.id)
    
        if (index !== -1) {
            const updatedEixos = [...eixos]
            updatedEixos[index] = item
            setEixos(updatedEixos)
        } else {
            setEixos([...eixos, item])
        }
    }

    const deletarEixo = async (item: IEixo) => {
        const list = eixos.filter((c) => c.id !== item.id)
        setEixos(list)
    }

    const verifyDuplicateDescricao = (txtDescricao: string) => {
        txtDescricao = Mask.numeros(txtDescricao)
        const find = eixos.find((eixo) => String(eixo.descricao) === txtDescricao)
        if (find) return false
        return true
    }

    const { toastSuccess, toastError } = useToast()

    const FormSchema = yup.object().shape({
        descricao: yup
            .string()
            .required('Descrição é obrigatório *')
            .test('test-descricao', 'Tipo de Regime já cadastrado', (value: any) => {
                return verifyDuplicateDescricao(value)
            }),
    })

    const rhfmethods = useForm<IEixo>({ resolver: yupResolver(FormSchema) })

    const handleSalvar = async (values: IEixo) => {
        try {


            let ementa = {
                id: values.ementa.id,
                descricao: values.ementa.descricao,
            }

            let dataSave = {
                id: values.id,
                descricao: values.descricao,
                ementa:ementa,
                numero:values.numero,
                tema:values.tema
            }
          
            adicionarEixo(dataSave)
            toastSuccess('Tipo de Regime adicionado com sucesso.')
            setIsForm(false)
            setEditItem(null)
        } catch (error) {
            console.log(error)
            toastError('Erro ao adicionar tipo de Regime')
        }
    }

    const handleEditar = (item: IEixo) => {
        setEditItem(item)
        setIsForm(true)
        rhfmethods.reset(item)
    }

    const initializeFormFields = () => {
        setTimeout(() => {
            rhfmethods.setValue('descricao', '');
            rhfmethods.setValue('numero', 0);
            rhfmethods.setValue('ementa.descricao', '');
            rhfmethods.setValue('tema', '');
            rhfmethods.setValue('descricao', '');
            rhfmethods.setValue('id', 0);
        }, 0);
    };

    return (
        <>
            <FormProvider {...rhfmethods}>
                {visible && (
                    <Grid>
                        <CustomTable
                            data={eixos}
                            onEdit={handleEditar}
                            onDelete={deletarEixo}
                            columnConfig={columnConfig}
                        />
                        
                        <Dialog fullWidth={true}
                            maxWidth={"md"}  {...rhfmethods} open={isForm} onClose={() => setIsForm(false)}>
                            <DialogTitle>Cadastrar Eixo</DialogTitle>
                            <DialogContent>

                              <Grid container xs={12} spacing={3} mt={1}>
                                    <RHFText
                                        name={'numero'}
                                        label={'Número'}
                                        gridProps={{ xs: 4}}
                                        inputProps={{ maxLength: 7 }}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(e) => {
                                            const v = parseInt(e.target.value, 10);
                                            rhfmethods.setValue('numero', v);
                                        }}
                                    />
                                
                                    <RHFText
                                        name={'tema'}
                                        label={'Tema'}
                                        gridProps={{ xs: 8 }}
                                        inputProps={{ maxLength: 100 }}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(e) => {
                                            const v = e.target.value
                                            rhfmethods.setValue('tema', v)
                                        }}
                                    />
                        
                                    <RHFText
                                        name={'descricao'}
                                        label={'Descrição'}
                                        gridProps={{ xs: 12 }}
                                        inputProps={{ maxLength: 100 }}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(e) => {
                                            const v = e.target.value
                                            rhfmethods.setValue('descricao', v)
                                        }}
                                    />
                         
                                <RHFTextArea 
                                    name="ementa.descricao"
                                    label="Descrição Ementa"
                                    control={rhfmethods.control as any} // passando o 'control' para o RHFTextArea
                                    rules={{ required: true }}
                                    defaultValue=""
                                    rows={4}
                                    gridProps={{ lg: 12 }}
                                    onChange={(e) => {
                                        const v = e.target.value
                                        rhfmethods.setValue('ementa.descricao', v)
                                    }}
                                />
                                </Grid>

                                <Grid container justifyContent={'end'} mt={2}>
                                    <Grid>
                                        <BotaoPadrao
                                            variant='outlined'
                                            onClick={() => setIsForm(false)}
                                            sx={{ p: 2 }}
                                            style={{ height: 50 }}
                                        >
                                            Cancelar
                                        </BotaoPadrao>
                                    </Grid>
                                    <Grid ml={2}>
                                        <BotaoPadrao
                                            type='button'
                                            onClick={rhfmethods.handleSubmit(handleSalvar)}
                                            style={{ height: 50 }}
                                            sx={{ p: 2 }}
                                        >
                                            Salvar Eixo
                                        </BotaoPadrao>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                        </Dialog>
                          
                        <Grid container spacing={2} my={4} mr={4} justifyContent={'end'}>
                            <Grid>
                                <BotaoPadrao size={'large'} variant='outlined' onClick={() =>{ 
                                setIsForm(true);
                                initializeFormFields();
                                }}>
                                ADICIONAR EIXO
                            </BotaoPadrao>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </FormProvider>
        </>
    )
}

export default EixoCrud