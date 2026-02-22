import { nanoid } from 'nanoid';
import { format } from 'date-fns';

export const generateBookingCode = () => {
    const prefix = 'KRS';
    const dateStr = format(new Date(), 'yyMM');
    const randomStr = nanoid(4).toUpperCase();
    return `${prefix}-${dateStr}-${randomStr}`;
};

export const generateOrderCode = () => {
    const prefix = 'ORD';
    const dateStr = format(new Date(), 'yyyyMMdd');
    const randomStr = nanoid(6).toUpperCase();
    return `${prefix}-${dateStr}-${randomStr}`;
};
