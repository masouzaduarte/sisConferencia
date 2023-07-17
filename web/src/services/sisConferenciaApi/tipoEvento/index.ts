
import { AxiosResponse } from 'axios';
import api, { getHeaders, getHeadersFiles } from '../../global'
import { ITipoEvento } from './types';




const apiService = {
    tipoEventoListar: async () => {
        try {
            const response = await api.get<ITipoEvento[]>('/tipoEvento');
            return response;
        } catch (error) {
            console.error(error);
            return [];
        }
    },
    tipoEventoCriar: async function (data: ITipoEvento): Promise<any>  {
        try {
            
            const response = await api.post<ITipoEvento>('/tipoEvento', data, getHeaders());
            return response;
        } catch (error) {
            console.error('Erro ao obter o tipo de evento:', error);
            throw error;
        }
    },
    tipoEventoAtualizar: async (id: number, data: ITipoEvento):Promise<any>  => {
        try {
            const response = await api.put(`/tipoEvento/${id}`, data, getHeaders());
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    tipoEventoExcluir: async (id: number): Promise<void> => {
        try {
            await api.delete(`/tipoEvento/${id}`);
        } catch (error) {
            console.error(error);
        }
    }
};

export default apiService;