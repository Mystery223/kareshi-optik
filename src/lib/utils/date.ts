import { isSunday, addDays, format } from 'date-fns';

export const isClinicClosed = (date: Date) => {
    return isSunday(date);
};

export const getAvailableDates = (daysCount: number = 14) => {
    const dates = [];
    let current = new Date();

    while (dates.length < daysCount) {
        if (!isClinicClosed(current)) {
            dates.push(new Date(current));
        }
        current = addDays(current, 1);
    }

    return dates;
};

export const formatDateKey = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
};
