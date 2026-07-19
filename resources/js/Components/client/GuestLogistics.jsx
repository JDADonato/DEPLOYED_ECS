import { useState, useMemo } from 'react';
import Modal from '../common/Modal';

const GuestLogistics = ({ bookingData, updateBooking, onNext, onBack, businessRules = {} }) => {
    const minPax = useMemo(() => {
        const val = parseInt(businessRules?.minimum_pax_per_event, 10);
        return isNaN(val) || val < 1 ? 50 : val;
    }, [businessRules?.minimum_pax_per_event]);

    const maxPax = useMemo(() => {
        const val = parseInt(businessRules?.maximum_pax_per_event, 10);
        return isNaN(val) || val < minPax ? 1000 : val;
    }, [businessRules?.maximum_pax_per_event, minPax]);

    const guestPresets = useMemo(() => {
        const presets = [minPax];
        const candidates = [50, 100, 150, 200, 300, 500, 1000];
        for (const c of candidates) {
            if (c > minPax && c <= maxPax && !presets.includes(c)) presets.push(c);
        }
        if (presets.length < 3 && minPax < 50) {
            for (const c of [minPax + 10, minPax + 20, minPax + 50]) {
                if (!presets.includes(c)) presets.push(c);
            }
        }
        return presets.sort((a, b) => a - b).slice(0, 6);
    }, [minPax]);

    const [paxInput, setPaxInput] = useState(() => {
        const initial = parseInt(bookingData.pax, 10);
        return String(isNaN(initial) ? minPax : Math.min(maxPax, Math.max(minPax, initial)));
    });
    const [dietaryNotes, setDietaryNotes] = useState(bookingData.dietaryNotes || '');
    const [modal, setModal] = useState({ isOpen: false, type: 'info', title: '', message: '' });

    const handlePaxChange = (value) => {
        const cleaned = value.replace(/[^0-9]/g, '');
        if (cleaned === '') {
            setPaxInput('');
            updateBooking({ pax: '' });
            return;
        }
        const withoutLeadingZeros = cleaned.replace(/^0+/, '');
        if (withoutLeadingZeros === '') {
            setPaxInput('0');
            updateBooking({ pax: 0 });
            return;
        }
        setPaxInput(withoutLeadingZeros);
        updateBooking({ pax: parseInt(withoutLeadingZeros, 10) });
    };

    const handleDietaryChange = (value) => {
        setDietaryNotes(value);
        updateBooking({ dietaryNotes: value });
    };

    const handleNext = () => {
        const currentPax = parseInt(paxInput, 10);
        if (isNaN(currentPax) || currentPax < minPax) {
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Guest count needed',
                message: `Please enter at least ${minPax} guests to continue.`,
            });
            return;
        }

        if (currentPax > maxPax) {
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Maximum capacity exceeded',
                message: `We can only accommodate up to ${maxPax} guests for a single event.`,
            });
            return;
        }

        if (bookingData.remainingPax && currentPax > bookingData.remainingPax) {
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Capacity exceeded',
                message: `Only ${bookingData.remainingPax} slots are available for this date.`,
            });
            return;
        }

        updateBooking({ pax: currentPax, dietaryNotes });
        onNext(true);
    };

    return (
        <div className="booking-step">
            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                message={modal.message}
                type={modal.type}
            />

            <div className="booking-single-panel booking-guests-panel">
                <div className="booking-guests-main">
                    <div>
                        <p className="booking-step-kicker">Guests</p>
                        <h2>Enter your estimated headcount.</h2>
                        <p>A close estimate is enough. You can update your guest count later from your dashboard before making a payment.</p>
                    </div>

                    <div className="booking-compact-number">
                        <button type="button" onClick={() => handlePaxChange(String(Math.max(minPax, (parseInt(paxInput, 10) || minPax) - 10)))}>-</button>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={paxInput}
                            onChange={(event) => handlePaxChange(event.target.value)}
                            aria-label="Number of guests"
                        />
                        <button type="button" onClick={() => handlePaxChange(String(Math.min(maxPax, (parseInt(paxInput, 10) || 0) + 10)))}>+</button>
                    </div>

                    <div className="booking-guest-presets">
                        {guestPresets.map((count) => (
                            <button
                                key={count}
                                type="button"
                                onClick={() => handlePaxChange(String(count))}
                                className={parseInt(paxInput, 10) === count ? 'active' : ''}
                            >
                                {count}
                            </button>
                        ))}
                    </div>

                    <p className="text-sm font-semibold text-slate-500">
                        Minimum {minPax} to maximum {maxPax} guests{bookingData.remainingPax ? `. Available for this date: ${bookingData.remainingPax}.` : '.'}
                    </p>
                </div>

                <div className="booking-guests-notes">
                    <label className="booking-field-label">Dietary notes <span>Optional</span></label>
                    <textarea
                        rows="3"
                        placeholder="Allergies, halal, vegetarian options, no pork, nut-free..."
                        value={dietaryNotes}
                        onChange={(event) => handleDietaryChange(event.target.value)}
                        className="booking-input resize-none"
                    />

                    {bookingData.remainingPax && parseInt(paxInput, 10) > bookingData.remainingPax && (
                        <p className="booking-inline-error">Only {bookingData.remainingPax} slots are available for this date.</p>
                    )}
                </div>
            </div>

            <div className="booking-step-actions">
                <button onClick={onBack} className="booking-secondary-btn">Back</button>
                <button onClick={handleNext} className="booking-primary-btn">Continue</button>
            </div>
        </div>
    );
};

export default GuestLogistics;
