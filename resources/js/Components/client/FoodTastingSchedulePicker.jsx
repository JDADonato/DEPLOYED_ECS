import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    formatDateInput,
    isFoodTastingDateAllowed,
    isFoodTastingDay,
    isFoodTastingTimeAllowed,
    minFoodTastingDate,
    monthTitle,
    parseDateInput,
    sameMonth,
    TASTING_TIME_OPTIONS,
} from '../../utils/foodTastingSchedule';
import { FieldError } from '../common/FormFeedback';

const availabilityCache = new Map();

const startOfVisibleMonth = (selectedDate) => {
    const source = parseDateInput(selectedDate) || new Date();
    return new Date(source.getFullYear(), source.getMonth(), 1);
};

const fetchMonthAvailability = async (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth() + 1;
    const key = `${year}-${String(month).padStart(2, '0')}`;

    if (availabilityCache.has(key)) {
        return availabilityCache.get(key);
    }

    const response = await fetch(`/api/food-tasting/availability?year=${year}&month=${month}`, {
        headers: { Accept: 'application/json' },
    });

    if (!response.ok) throw new Error('Unable to check tasting availability.');

    const data = await response.json();
    const fullDates = data.full_dates || [];
    availabilityCache.set(key, fullDates);
    return fullDates;
};

const FoodTastingSchedulePicker = ({ dateValue, timeValue, onChange, errors = {}, disabled = false }) => {
    const [visibleMonth, setVisibleMonth] = useState(() => startOfVisibleMonth(dateValue));
    const [fullDates, setFullDates] = useState([]);
    const [loadingDates, setLoadingDates] = useState(false);
    const [availabilityError, setAvailabilityError] = useState('');
    const minDate = useMemo(() => minFoodTastingDate(), []);
    const fullDateSet = useMemo(() => new Set(fullDates), [fullDates]);

    useEffect(() => {
        let cancelled = false;
        setLoadingDates(true);
        setAvailabilityError('');

        fetchMonthAvailability(visibleMonth)
            .then((dates) => {
                if (cancelled) return;
                setFullDates(dates);
                if (dateValue && dates.includes(dateValue)) {
                    onChange({ preferred_date: '', preferred_time: timeValue });
                }
            })
            .catch(() => {
                if (!cancelled) setAvailabilityError('Availability could not be refreshed. Please try again before submitting.');
            })
            .finally(() => {
                if (!cancelled) setLoadingDates(false);
            });

        return () => {
            cancelled = true;
        };
    }, [visibleMonth.getFullYear(), visibleMonth.getMonth()]);

    const calendarDays = useMemo(() => {
        const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
        const start = new Date(firstDay);
        start.setDate(firstDay.getDate() - firstDay.getDay());

        return Array.from({ length: 42 }, (_, index) => {
            const date = new Date(start);
            date.setDate(start.getDate() + index);
            const value = formatDateInput(date);
            const full = fullDateSet.has(value);
            const outsideMonth = !sameMonth(date, visibleMonth);
            const tooSoon = value < minDate;
            const wrongDay = !isFoodTastingDay(date);
            const disabledDate = outsideMonth || tooSoon || wrongDay || full;

            return {
                value,
                day: date.getDate(),
                full,
                outsideMonth,
                disabled: disabledDate,
                selected: value === dateValue,
                label: full ? 'Fully booked' : tooSoon ? 'Needs 3 days lead time' : wrongDay ? 'Friday to Sunday only' : 'Available',
            };
        });
    }, [dateValue, fullDateSet, minDate, visibleMonth]);

    const selectDate = (value) => {
        if (disabled || !isFoodTastingDateAllowed(value, fullDates)) return;
        onChange({ preferred_date: value, preferred_time: timeValue });
    };

    const selectTime = (value) => {
        if (disabled || !isFoodTastingTimeAllowed(value)) return;
        onChange({ preferred_date: dateValue, preferred_time: value });
    };

    return (
        <div className="food-tasting-picker md:col-span-2">
            <div className="food-tasting-picker-grid">
                <div>
                    <div className="booking-field-label food-tasting-picker-label">Preferred date</div>
                    <p className="food-tasting-picker-help">Friday-Sunday only, at least 3 days ahead. Full dates are disabled.</p>
                    <div className="booking-calendar food-tasting-calendar">
                        <div className="booking-calendar-header">
                            <button type="button" onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))} disabled={disabled} aria-label="Previous month">
                                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <strong>{monthTitle(visibleMonth)}</strong>
                            <button type="button" onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))} disabled={disabled} aria-label="Next month">
                                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="booking-calendar-weekdays">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}
                        </div>
                        <div className="booking-calendar-grid">
                            {calendarDays.map((day) => (
                                <button
                                    key={day.value}
                                    type="button"
                                    disabled={disabled || day.disabled}
                                    onClick={() => selectDate(day.value)}
                                    title={day.label}
                                    className={`${day.outsideMonth ? 'booking-calendar-day-muted' : ''} ${day.selected ? 'booking-calendar-day-selected' : ''} ${day.full ? 'food-tasting-day-full' : ''}`}
                                >
                                    <span>{day.day}</span>
                                    {day.full && <small>Full</small>}
                                </button>
                            ))}
                        </div>
                        {loadingDates && <p className="food-tasting-picker-help mt-2">Checking full tasting dates...</p>}
                        {availabilityError && <p className="mt-2 text-xs font-bold text-red-700">{availabilityError}</p>}
                    </div>
                    <FieldError message={errors.preferred_date} />
                </div>

                <div>
                    <div className="booking-field-label food-tasting-picker-label">Preferred time</div>
                    <p className="food-tasting-picker-help">Available from 11:00 AM to 3:00 PM.</p>
                    <div className="food-tasting-time-grid" role="group" aria-label="Preferred food tasting time">
                        {TASTING_TIME_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                disabled={disabled}
                                onClick={() => selectTime(option.value)}
                                className={option.value === timeValue ? 'food-tasting-time-option is-selected' : 'food-tasting-time-option'}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                    <FieldError message={errors.preferred_time} />
                </div>
            </div>
        </div>
    );
};

export default FoodTastingSchedulePicker;
