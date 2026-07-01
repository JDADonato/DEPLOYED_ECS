import { useEffect, useRef, useState } from 'react';
import Modal from '../common/Modal';
import { FieldError, FormErrorSummary } from '../common/FormFeedback';
import { focusFirstInvalidField } from '../../utils/validation';
import FoodTastingSchedulePicker from './FoodTastingSchedulePicker';
import { isFoodTastingTimeAllowed } from '../../utils/foodTastingSchedule';
import MenuPickerModal from './MenuPickerModal';

const FoodTastingStep = ({ bookingData, updateBooking, onReview, onBack, isSubmitting = false }) => {
    const [showTasting, setShowTasting] = useState(true);
    const [sameAsAbove, setSameAsAbove] = useState(false);
    const [tastingData, setTastingData] = useState({
        guest_name: bookingData.tasting_guest_name || bookingData.client_full_name || '',
        guest_email: bookingData.tasting_guest_email || bookingData.client_email || '',
        guest_phone: bookingData.tasting_guest_phone || bookingData.client_phone || '',
        preferred_date: bookingData.tasting_preferred_date || '',
        preferred_time: bookingData.tasting_preferred_time || '',
        notes: bookingData.tasting_notes || '',
        requested_dishes: bookingData.tasting_requested_dishes || [],
    });
    const [modal, setModal] = useState({ isOpen: false, type: 'info', title: '', message: '' });
    const [isMenuPickerOpen, setIsMenuPickerOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const formRef = useRef(null);

    useEffect(() => {
        updateBooking({ wantsTasting: true });
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        let newErrors = { ...errors };

        if (newErrors[name]) {
            delete newErrors[name];
        }

        setTastingData({ ...tastingData, [name]: value });
        setErrors(newErrors);
    };

    const handleSameAsAbove = (checked) => {
        setSameAsAbove(checked);
        if (checked) {
            setTastingData(prev => ({
                ...prev,
                guest_name: bookingData.client_full_name || '',
                guest_email: bookingData.client_email || '',
                guest_phone: bookingData.client_phone || '',
            }));
        }
    };

    const handleSubmitWithTasting = () => {
        if (isSubmitting) return;
        const nextErrors = {};
        if (!tastingData.guest_name?.trim()) nextErrors.guest_name = 'Add the name for the food tasting request.';
        if (!tastingData.guest_email?.trim()) nextErrors.guest_email = 'Add an email so the team can confirm the food tasting.';
        if (!tastingData.preferred_date) {
            nextErrors.preferred_date = 'Choose a preferred food tasting date.';
        }
        
        if (!tastingData.preferred_time) {
            nextErrors.preferred_time = 'Choose a preferred food tasting time.';
        } else if (!isFoodTastingTimeAllowed(tastingData.preferred_time)) {
            nextErrors.preferred_time = 'Food tastings are only available between 11:00 AM and 3:00 PM.';
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Missing Details',
                message: 'Complete the highlighted tasting details before review.',
            });
            focusFirstInvalidField(nextErrors, formRef.current || document);
            return;
        }

        const finalData = {
            wantsTasting: true,
            tasting_guest_name: tastingData.guest_name,
            tasting_guest_email: tastingData.guest_email,
            tasting_guest_phone: tastingData.guest_phone,
            tasting_preferred_date: tastingData.preferred_date,
            tasting_preferred_time: tastingData.preferred_time,
            tasting_notes: tastingData.notes,
            tasting_requested_dishes: tastingData.requested_dishes,
        };

        updateBooking(finalData);
        onReview(finalData);
    };

    const handleSkipToCheckout = () => {
        if (isSubmitting) return;
        const finalData = { wantsTasting: false };
        updateBooking(finalData);
        onReview(finalData);
    };

    const handleScheduleChange = (updates) => {
        setTastingData((current) => ({ ...current, ...updates }));
        setErrors((current) => {
            const next = { ...current };
            if (updates.preferred_date !== undefined) delete next.preferred_date;
            if (updates.preferred_time !== undefined) delete next.preferred_time;
            return next;
        });
    };

    return (
        <div className="booking-step animate-fadeIn">
            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                message={modal.message}
                type={modal.type}
            />

            <div className="booking-step-grid">
                <section className="booking-step-panel">
                    <p className="booking-step-kicker">Final preference</p>
                    <h2>Would you like to schedule a food tasting?</h2>
                    <p className="booking-step-copy">
                        You can request a food tasting before the event, or submit the booking now and coordinate details with the team later.
                    </p>
                    <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
                        Food tasting lets you sample selected dishes, confirm flavors, and share final notes before the event menu is locked in.
                    </p>
                    <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
                        <p className="text-sm font-bold text-blue-900 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                            Heads up!
                        </p>
                        <p className="mt-1 text-sm text-blue-800">
                            Food tasting servings are prepared for up to 4 pax. You may bring more guests, but please expect the tasting portions to be good for 4 pax only.
                        </p>
                    </div>

                    {isSubmitting && (
                        <div className="booking-inline-error border-[#f0aa0b]/40 bg-[#f0aa0b]/10 text-[#6f4a05]">
                            Submitting your booking. Please keep this page open.
                        </div>
                    )}
                </section>

                <section className="booking-choice-area">
                    <div className="booking-preset-grid">
                        <button
                            type="button"
                            onClick={() => setShowTasting(true)}
                            disabled={isSubmitting}
                            className={`booking-preset ${showTasting ? 'booking-preset-active' : ''}`}
                        >
                            <strong>Schedule food tasting</strong>
                            <span>Pick a preferred date and time.</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleSkipToCheckout}
                            disabled={isSubmitting}
                            className="booking-preset"
                        >
                            <strong>Review without food tasting</strong>
                            <span>Check your choices before sending.</span>
                        </button>
                    </div>

                    {showTasting && (
                        <div ref={formRef} className="food-tasting-form mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <FormErrorSummary errors={errors} />
                            </div>
                            <label>
                                <span className="booking-field-label">Guest name</span>
                                <input
                                    type="text"
                                    name="guest_name"
                                    placeholder="Name for the tasting"
                                    value={tastingData.guest_name}
                                    onChange={handleChange}
                                    disabled={sameAsAbove}
                                    className="booking-input disabled:cursor-not-allowed disabled:bg-gray-100"
                                />
                                <FieldError message={errors.guest_name} />
                            </label>
                            <label>
                                <span className="booking-field-label">Email address</span>
                                <input
                                    type="email"
                                    name="guest_email"
                                    placeholder="Email address"
                                    value={tastingData.guest_email}
                                    onChange={handleChange}
                                    disabled={sameAsAbove}
                                    className="booking-input disabled:cursor-not-allowed disabled:bg-gray-100"
                                />
                                <FieldError message={errors.guest_email} />
                            </label>
                            <label>
                                <span className="booking-field-label">Mobile number</span>
                                <input
                                    type="tel"
                                    name="guest_phone"
                                    placeholder="Phone number"
                                    value={tastingData.guest_phone}
                                    onChange={handleChange}
                                    disabled={sameAsAbove}
                                    pattern="^(09|\+639)\d{9}$"
                                    title="Please enter a valid Philippine mobile number (e.g., 09123456789 or +639123456789)"
                                    className="booking-input disabled:cursor-not-allowed disabled:bg-gray-100"
                                />
                            </label>
                            <label className="flex items-center gap-3 self-end rounded-2xl border border-gray-200 bg-white px-4 py-4">
                                <input
                                    type="checkbox"
                                    checked={sameAsAbove}
                                    onChange={(event) => handleSameAsAbove(event.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-[#720101] focus:ring-[#720101]"
                                />
                                <span className="text-sm font-semibold text-gray-600">Use my booking contact details</span>
                            </label>
                            <FoodTastingSchedulePicker
                                dateValue={tastingData.preferred_date}
                                maxDateValue={bookingData.event_date}
                                timeValue={tastingData.preferred_time}
                                onChange={handleScheduleChange}
                                errors={errors}
                                disabled={isSubmitting}
                            />
                            <label className="md:col-span-2">
                                <span className="booking-field-label">Notes</span>
                                <textarea
                                    name="notes"
                                    rows="3"
                                    placeholder="Dietary restrictions or tasting requests"
                                    value={tastingData.notes}
                                    onChange={handleChange}
                                    className="booking-note-field"
                                />
                            </label>

                            <div className="md:col-span-2 border border-slate-100 rounded-xl p-5 bg-white shadow-sm mt-2">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <span className="booking-field-label !mb-1 block">Requested Dishes (Optional)</span>
                                        <p className="text-xs font-medium text-slate-500">Pick up to 5 dishes you want to taste.</p>
                                    </div>
                                    <button type="button" onClick={() => setIsMenuPickerOpen(true)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors whitespace-nowrap">
                                        Select Dishes
                                    </button>
                                </div>
                                {tastingData.requested_dishes.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {tastingData.requested_dishes.map((dish, i) => (
                                            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#720101]/5 text-[#720101] text-xs font-bold rounded-lg border border-[#720101]/10">
                                                {dish.name}
                                                <button type="button" onClick={() => setTastingData(prev => ({ ...prev, requested_dishes: prev.requested_dishes.filter(d => d.id !== dish.id) }))} className="hover:text-[#5a0101]">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </section>
            </div>

            <MenuPickerModal 
                isOpen={isMenuPickerOpen} 
                onClose={() => setIsMenuPickerOpen(false)} 
                onSelect={(dishes) => setTastingData(prev => ({ ...prev, requested_dishes: dishes }))} 
                initialSelections={tastingData.requested_dishes} 
                maxSelections={5} 
            />

            <div className="booking-step-actions">
                <button onClick={onBack} disabled={isSubmitting} className="booking-secondary-btn disabled:cursor-not-allowed disabled:opacity-50">Back</button>
                {showTasting && (
                    <button onClick={handleSubmitWithTasting} disabled={isSubmitting} className="booking-primary-btn disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500">
                        Review booking
                    </button>
                )}
            </div>
        </div>
    );
};

export default FoodTastingStep;
