import React from 'react';
import { createPortal } from 'react-dom';
import csrfFetch from '../../utils/csrf';

const eventDisplayName = (booking) => booking?.event_display_name || booking?.event_name || booking?.event_type || booking?.package_name || (booking?.id ? `Booking #${booking.id}` : 'Eloquente event');

const CompleteBookingModal = ({ 
    completionPrompt, 
    setCompletionPrompt, 
    user, 
    onSuccess, 
    onError, 
    toast 
}) => {
    if (!completionPrompt.isOpen || !completionPrompt.booking) return null;

    const blockers = completionPrompt.blockers || [];
    const canOverride = user?.role === 'Admin';

    const completeBooking = async ({ override = false } = {}) => {
        const booking = completionPrompt.booking;
        if (!booking?.id || completionPrompt.saving) return;

        setCompletionPrompt(prev => ({ ...prev, saving: true }));

        try {
            const response = await csrfFetch(`/api/marketing/bookings/${booking.id}/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    override,
                    override_reason: override ? completionPrompt.overrideReason.trim() : undefined,
                }),
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (data.booking && onSuccess) onSuccess(data.booking, false);
                setCompletionPrompt(prev => ({
                    ...prev,
                    blockers: data.blockers || [],
                    saving: false,
                }));
                if (toast) toast.error(data.error || 'This booking is not ready to complete.');
                if (onError) onError(data);
                return;
            }

            if (data.booking && onSuccess) onSuccess(data.booking, true);
            setCompletionPrompt({ isOpen: false, booking: null, blockers: [], overrideReason: '', saving: false });
            if (toast) toast.success(data.message || 'Event completed and feedback request sent.');
        } catch (error) {
            console.error('Error completing booking:', error);
            setCompletionPrompt(prev => ({ ...prev, saving: false }));
            if (toast) toast.error('We could not complete this event. Please check your connection.');
            if (onError) onError(error);
        }
    };

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black/55 px-4" style={{ zIndex: 99999 }} onClick={() => setCompletionPrompt({ isOpen: false, booking: null, blockers: [], overrideReason: '', saving: false })}>
            <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
                <div className="border-b border-[#f1dfdf] bg-[#fffaf3] px-6 py-5">
                    <p className="marketing-kicker">Post-event completion</p>
                    <h3 className="mt-1 text-2xl font-black text-slate-950">Complete this event?</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                        This will move the booking into completed history, create the customer feedback request, and notify the customer.
                    </p>
                </div>

                <div className="space-y-4 px-6 py-5">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Booking</p>
                        <p className="mt-1 text-lg font-black text-slate-950">{eventDisplayName(completionPrompt.booking)}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-500">Live status: {completionPrompt.booking.live_status || 'Not Started'}</p>
                    </div>

                    {blockers.length > 0 ? (
                        <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
                            <p className="text-xs font-black uppercase tracking-widest text-rose-700">Completion blockers</p>
                            <ul className="mt-3 space-y-2 text-sm font-semibold text-rose-800">
                                {blockers.map((blocker, index) => (
                                    <li key={`${blocker.key || 'blocker'}-${index}`}>- {blocker.label || blocker.key || 'This item needs review.'}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900">
                            The server will verify payment, preparation, refunds, event date, customer account, and live status before completing.
                        </div>
                    )}

                    {canOverride && blockers.length > 0 && (
                        <label className="block">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Admin override reason</span>
                            <textarea
                                value={completionPrompt.overrideReason}
                                onChange={(event) => setCompletionPrompt(prev => ({ ...prev, overrideReason: event.target.value }))}
                                rows={3}
                                className="staff-control mt-2"
                                placeholder="Explain why this event should be completed despite the blockers..."
                            />
                        </label>
                    )}
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={() => setCompletionPrompt({ isOpen: false, booking: null, blockers: [], overrideReason: '', saving: false })}
                        className="staff-button-secondary"
                    >
                        Cancel
                    </button>
                    {canOverride && blockers.length > 0 && (
                        <button
                            type="button"
                            onClick={() => completeBooking({ override: true })}
                            disabled={completionPrompt.saving || completionPrompt.overrideReason.trim().length < 5}
                            className="staff-button-secondary border-amber-200 bg-amber-50 text-amber-800"
                        >
                            {completionPrompt.saving ? 'Completing...' : 'Override and complete'}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => completeBooking()}
                        disabled={completionPrompt.saving}
                        className="staff-button-primary"
                    >
                        {completionPrompt.saving ? 'Checking...' : 'Complete event'}
                    </button>
                </div>
            </div>
        </div>
    , document.body);
};

export default CompleteBookingModal;
