import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(Number(price));
};

export const formatDate = (date: Date | string, formatStr: string = 'PP') => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, formatStr, { locale: id });
};

export const formatPhone = (phone: string) => {
    if (!phone) return '';
    // Simple format for Indonesian numbers: 0812-3456-7890
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{4})(\d{4})(\d{4,5})$/);
    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phone;
};
