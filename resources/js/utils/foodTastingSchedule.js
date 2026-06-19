export const TASTING_TIME_OPTIONS = [
    { value: '11:00', label: '11:00 AM' },
    { value: '11:30', label: '11:30 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '12:30', label: '12:30 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '13:30', label: '1:30 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '14:30', label: '2:30 PM' },
    { value: '15:00', label: '3:00 PM' },
];

export const formatDateInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const parseDateInput = (value) => {
    if (!value) return null;
    return new Date(`${value}T00:00:00`);
};

export const minFoodTastingDate = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3);
    return formatDateInput(date);
};

export const isFoodTastingDay = (dateValue) => {
    const date = typeof dateValue === 'string' ? parseDateInput(dateValue) : dateValue;
    if (!date || Number.isNaN(date.getTime())) return false;
    return [0, 5, 6].includes(date.getDay());
};

export const isFoodTastingDateAllowed = (dateValue, fullDates = []) => {
    if (!dateValue) return false;
    return dateValue >= minFoodTastingDate()
        && isFoodTastingDay(dateValue)
        && !new Set(fullDates).has(dateValue);
};

export const isFoodTastingTimeAllowed = (timeValue) => TASTING_TIME_OPTIONS.some((option) => option.value === timeValue);

export const formatTastingTime = (timeValue) => TASTING_TIME_OPTIONS.find((option) => option.value === timeValue)?.label || timeValue || '';

export const monthTitle = (date) => date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

export const sameMonth = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
