import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { useAuth } from '../../context/AuthContext';
import csrfFetch from '../../utils/csrf';
import { FieldError, FormErrorSummary } from '../../Components/common/FormFeedback';
import { focusFirstInvalidField, firstErrorMessage } from '../../utils/validation';
import StaffPreviewBanner from '../../Components/common/StaffPreviewBanner';
import ClientNavbar from '../../Components/common/ClientNavbar';
import RevealOnScroll from '../../Components/common/RevealOnScroll';
import { dashboardHrefForUser, isStaffUser } from '../../utils/dashboardLinks';

const FoodTasting = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        guest_name: user ? user.username || user.client_full_name : '',
        guest_email: user ? user.email || '' : '',
        guest_phone: '',
        preferred_date: '',
        preferred_time: '',
        notes: '',
        website: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [errors, setErrors] = useState({});
    const [scheduledTastingId, setScheduledTastingId] = useState(null);
    const dashboardHref = dashboardHrefForUser(user, '/');

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newErrors = { ...errors };

        if (name === 'preferred_date' && value) {
            const dateObj = new Date(value);
            const day = dateObj.getDay();
            if (day >= 1 && day <= 4) {
                newErrors.preferred_date = 'Food tastings are only available Friday to Sunday.';
            } else {
                delete newErrors.preferred_date;
            }
        } else if (name === 'preferred_time' && value) {
            const [hours, minutes] = value.split(':').map(Number);
            if (hours < 11 || hours > 15 || (hours === 15 && minutes > 0)) {
                newErrors.preferred_time = 'Food tastings are only available between 11:00 AM and 3:00 PM.';
            } else {
                delete newErrors.preferred_time;
            }
        } else if (newErrors[name]) {
            delete newErrors[name];
        }

        setFormData({ ...formData, [name]: value });
        setErrors(newErrors);
    };

    const getMinDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 3);
        return today.toISOString().split('T')[0];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        let nextErrors = {};
        if (formData.preferred_date) {
            const day = new Date(formData.preferred_date).getDay();
            if (day >= 1 && day <= 4) nextErrors.preferred_date = 'Food tastings are only available Friday to Sunday.';
        }
        if (formData.preferred_time) {
            const [hours, minutes] = formData.preferred_time.split(':').map(Number);
            if (hours < 11 || hours > 15 || (hours === 15 && minutes > 0)) {
                nextErrors.preferred_time = 'Food tastings are only available between 11:00 AM and 3:00 PM.';
            }
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            setMessage({ type: 'error', text: firstErrorMessage(nextErrors, 'Please correct the highlighted errors.') });
            setLoading(false);
            return;
        }

        try {
            const response = await csrfFetch('/api/food-tasting', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Food tasting scheduled successfully.' });
                setScheduledTastingId(data.tastingId || true);
                if (!user) setFormData({ guest_name: '', guest_email: '', guest_phone: '', preferred_date: '', preferred_time: '', notes: '', website: '' });
            } else {
                const nextErrors = data.errors || {};
                setErrors(nextErrors);
                setMessage({ type: 'error', text: firstErrorMessage(nextErrors, data.message || 'We could not schedule the tasting. Please try again.') });
                focusFirstInvalidField(nextErrors);
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'We could not schedule the tasting. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="booking-page min-h-screen bg-[#fffaf3] font-sans text-slate-900">
            <Head title="Food Tasting | Eloquente Catering" />
            <ClientNavbar user={user} />
            <StaffPreviewBanner user={user} label="customer-facing food tasting page" />

            <div className={`booking-wizard-shell flex min-h-[calc(100vh-68px)] ${isStaffUser(user) ? 'pt-[104px]' : 'pt-[68px]'}`}>
                <main className="booking-wizard-main min-w-0 flex-1">
                    <RevealOnScroll className="booking-wizard-header border-b border-[#720101]/10 bg-white">
                        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div className="min-w-0">
                                    <Link href="/" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-slate-400 transition hover:text-[#720101]">
                                        <span className="mr-2 text-base leading-none">&larr;</span>
                                        Home
                                    </Link>
                                    <div className="mt-3">
                                        <p className="text-[11px] font-black uppercase tracking-widest text-[#9f6500]">Food tasting</p>
                                        <h1 className="mt-1 font-display text-2xl font-bold leading-tight text-[#1a1a1a] sm:text-3xl">Would you like to schedule a food tasting?</h1>
                                        <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-slate-500">You can request a food tasting before your event to confirm flavors.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>

                    <RevealOnScroll as="section" delay="rv-d1" className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                        <div className="booking-step animate-fadeIn">
                            <div className="booking-step-grid">
                                <section className="booking-step-panel">
                                    <p className="booking-step-kicker">Final preference</p>
                                    <h2>Taste the menu before the event day.</h2>
                                    <p className="booking-step-copy">
                                        Schedule a focused tasting session so our team can confirm flavor direction, dietary needs, and final menu notes.
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
                                            The dishes that will be served are good for 4 pax only. Please also note there is a maximum of 6 bookings per day.
                                            Food tastings require at least 3 days lead time, and are only available Friday to Sunday, between 11:00 AM and 3:00 PM.
                                        </p>
                                    </div>

                                    {message && (
                                        <div className={`mt-6 flex items-center gap-3 rounded-xl p-4 text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                            {message.text}
                                        </div>
                                    )}

                                    {scheduledTastingId && user && (
                                        <div className="mt-6 rounded-2xl border border-[#720101]/10 bg-[#faf7f2] p-4">
                                            <p className="text-sm font-bold text-[#1a1a1a]">Your tasting request is on file. The team will confirm the schedule from the Marketing workspace.</p>
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <button type="button" onClick={() => router.get(dashboardHref)} className="rounded-xl bg-[#720101] px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-[#5a0101]">Go to Dashboard</button>
                                                <button type="button" onClick={() => router.get('/menu')} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50">Browse Menu</button>
                                            </div>
                                        </div>
                                    )}
                                </section>

                                <section className="booking-choice-area">
                                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <input type="text" name="website" value={formData.website} onChange={handleChange} tabIndex="-1" autoComplete="off" className="hidden" aria-hidden="true" />
                                        
                                        <div className="md:col-span-2">
                                            <FormErrorSummary errors={errors} message={Object.keys(errors).length > 0 ? firstErrorMessage(errors) : ''} />
                                        </div>
                                        
                                        <label>
                                            <span className="booking-field-label">Guest name</span>
                                            <input
                                                type="text"
                                                name="guest_name"
                                                placeholder="Name for the tasting"
                                                value={formData.guest_name}
                                                onChange={handleChange}
                                                required
                                                className="booking-input"
                                            />
                                            <FieldError message={errors.guest_name} />
                                        </label>
                                        <label>
                                            <span className="booking-field-label">Email address</span>
                                            <input
                                                type="email"
                                                name="guest_email"
                                                placeholder="Email address"
                                                value={formData.guest_email}
                                                onChange={handleChange}
                                                required
                                                className="booking-input"
                                            />
                                            <FieldError message={errors.guest_email} />
                                        </label>
                                        <label>
                                            <span className="booking-field-label">Mobile number</span>
                                            <input
                                                type="tel"
                                                name="guest_phone"
                                                placeholder="Phone number"
                                                value={formData.guest_phone}
                                                onChange={handleChange}
                                                required
                                                className="booking-input"
                                                pattern="^(09|\+639)\d{9}$"
                                                title="Please enter a valid Philippine mobile number (e.g., 09123456789 or +639123456789)"
                                            />
                                            <FieldError message={errors.guest_phone} />
                                        </label>
                                        <div className="hidden md:block"></div>
                                        <label>
                                            <span className="booking-field-label">Preferred date</span>
                                            <input
                                                type="date"
                                                name="preferred_date"
                                                min={getMinDate()}
                                                value={formData.preferred_date}
                                                onChange={handleChange}
                                                required
                                                className="booking-input"
                                            />
                                            <FieldError message={errors.preferred_date} />
                                        </label>
                                        <label>
                                            <span className="booking-field-label">Preferred time</span>
                                            <input
                                                type="time"
                                                name="preferred_time"
                                                value={formData.preferred_time}
                                                onChange={handleChange}
                                                required
                                                className="booking-input"
                                            />
                                            <FieldError message={errors.preferred_time} />
                                        </label>
                                        <label className="md:col-span-2">
                                            <span className="booking-field-label">Notes</span>
                                            <textarea
                                                name="notes"
                                                rows="3"
                                                placeholder="Dietary restrictions or tasting requests"
                                                value={formData.notes}
                                                onChange={handleChange}
                                                className="booking-note-field"
                                            />
                                            <FieldError message={errors.notes} />
                                        </label>
                                        
                                        <div className="md:col-span-2 booking-step-actions !mt-6 !border-t-0 !p-0">
                                            <button type="button" onClick={() => router.get('/menu')} disabled={loading} className="booking-secondary-btn">Browse Menu</button>
                                            <button type="submit" disabled={loading} className="booking-primary-btn disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500">
                                                {loading ? 'Scheduling...' : 'Schedule food tasting'}
                                            </button>
                                        </div>
                                    </form>
                                </section>
                            </div>
                        </div>
                    </RevealOnScroll>
                </main>
            </div>
        </div>
    );
};

export default FoodTasting;
