import { parseISO, isAfter } from 'date-fns'
import Mask from './mask'

export function valorMinimoMaximo(vl: any, vlMin: any, vlMax: any | undefined) {
    try {
        const value = Mask.formatUS(vl, true)
        const min = Mask.formatUS(vlMin, true)
        const max = Mask.formatUS(vlMax, true)

        if (value <= 0) return false

        if (value > 0) {
            if (Number(value) < Number(min)) {
                return false
            } else if (max && Number(value) > Number(max)) {
                return false
            }
        }

        return true
    } catch (error) {
        console.log('error valorMinimoMaximo', error)
        return false
    }
}

export function valueToString(valor?: string) {
    if (!valor) return ''

    return valor.toString()
}

export function stringToIntOrNull(valor?: string | number, isZero = true) {
    if (!valor) return isZero ? 0 : undefined

    return Number(`${valor}`)
}

export function trueOrFalse(valor?: boolean | number | string) {
    if (!valor) return false

    if (valor === 0 || valor === '0') return false

    return true
}

export function labelSimOuNao(valor?: boolean | number | string) {
    if (!valor) return 'Não'

    if (valor === 0 || valor === '0') return 'Não'

    return 'Sim'
}

export function maiorQueZero(valor?: number | string) {
    if (!valor) return false

    const v = Number(valor)

    if (v <= 0) return false

    return true
}

export function isAfterToday(startDate?: string): boolean {
    if (!startDate) {
        return false
    }

    const parsedDate = parseISO(startDate)

    return isAfter(parsedDate, new Date()) // true
}

export function formatCPF(cpf: any) {
    const cpfRegex = /^(\d{3})(\d{3})(\d{3})(\d{2})$/
    return cpf.replace(cpfRegex, '$1.$2.$3-$4')
}



export function validarCNPJ(value?: string): boolean {
    if (!value) {
        return false
    }

    // Aceita receber o valor como string, número ou array com todos os dígitos
    const isString = typeof value === 'string'
    const validTypes = isString || Number.isInteger(value) || Array.isArray(value)

    // Elimina valor de tipo inválido
    if (!validTypes) return false

    // Filtro inicial para entradas do tipo string
    if (isString) {
        // Limita ao mínimo de 14 caracteres, válido para apenas dígitos
        // Limita ao máximo de 18 caracteres, válido para CNPJ formatado
        // Se passar dos limites, retorna inválido
        if (value.length < 14 || value.length > 18) return false

        // Teste Regex para veificar se é uma string apenas dígitos válida
        const digitsOnly = /^\d{14}$/.test(value)
        // Teste Regex para verificar se é uma string formatada válida
        const validFormat = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/.test(value)
        // Verifica se o valor passou em ao menos 1 dos testes
        const isValid = digitsOnly || validFormat

        // Se o formato não é válido, retorna inválido
        if (!isValid) return false
    }

    // Guarda um array com todos os dígitos do valor
    const match = value.toString().match(/\d/g)
    const numbers = Array.isArray(match) ? match.map(Number) : []

    // Valida a quantidade de dígitos
    if (numbers.length !== 14) return false

    // Elimina inválidos com todos os dígitos iguais
    const items = [...new Set(numbers)]
    if (items.length === 1) return false

    // Cálculo validador
    const calc = (x: number) => {
        const slice = numbers.slice(0, x)
        let factor = x - 7
        let sum = 0

        for (let i = x; i >= 1; i--) {
            const n = slice[x - i]
            sum += n * factor--
            if (factor < 2) factor = 9
        }

        const result = 11 - (sum % 11)

        return result > 9 ? 0 : result
    }

    // Separa os 2 últimos dígitos de verificadores
    const digits = numbers.slice(12)

    // Valida 1o. dígito verificador
    const digit0 = calc(12)
    if (digit0 !== digits[0]) return false

    // Valida 2o. dígito verificador
    const digit1 = calc(13)
    return digit1 === digits[1]
}
