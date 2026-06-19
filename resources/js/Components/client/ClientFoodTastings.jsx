import React, { useState } from 'react';
import FoodTastingSchedulePicker from './FoodTastingSchedulePicker';
import ConfirmModal from '../common/ConfirmModal';
import { isFoodTastingTimeAllowed } from '../../utils/foodTastingSchedule';

const displayDate = (date) => (
    date ? new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Date pending'
);

const ClientFoodTastings = ({ tastings, onUpdate, onCancel, router, hideNewRequest = false }) => {
    const [editModal, setEditModal] = useState({ isOpen: false, tasting: null });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, tasting: null });
    
    const [scheduleData, setScheduleData] = useState({ preferred_date: '', preferred_time: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openEdit = (tasting) => {
        setScheduleData({ preferred_date: tasting.preferred_date || '', preferred_time: tasting.preferred_time || '' });
        setErrors({});
        setEditModal({ isOpen: true, tasting });
    };

    const handleScheduleChange = (updates) => {
        setScheduleData((prev) => ({ ...prev, ...updates }));
        setErrors({});
    };

    const submitUpdate = async () => {
        const nextErrors = {};
        if (!scheduleData.preferred_date) nextErrors.preferred_date = 'Choose a preferred date.';
        if (!scheduleData.preferred_time) {
            nextErrors.preferred_time = 'Choose a preferred time.';
        } else if (!isFoodTastingTimeAllowed(scheduleData.preferred_time)) {
            nextErrors.preferred_time = 'Food tastings are only available between 11:00 AM and 3:00 PM.';
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            await onUpdate(editModal.tasting.id, scheduleData);
            setEditModal({ isOpen: false, tasting: null });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isOpenTasting = (tasting) => tasting && !['Cancelled', 'Completed'].includes(tasting.status);

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fadeIn">
            <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-2xl">
                    <h3 className="text-2xl font-bold font-display text-[#1a1a1a]">Food Tastings</h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-gray-500">
                        Manage your food tasting schedules. Taste our menu before finalizing your event details.
                    </p>
                </div>
                {!hideNewRequest && (
                    <button 
                        onClick={() => router.get('/food-tasting')} 
                        className="group flex items-center gap-2 rounded-2xl bg-[#720101] px-6 py-3.5 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-[#720101]/20 hover:bg-[#5a0101] transition-all active:scale-95"
                    >
                        <svg className="w-4 h-4 text-[#f0aa0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        New Request
                    </button>
                )}
            </div>

            {(!tastings || tastings.length === 0) ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-sm font-black uppercase tracking-widest text-[#1a1a1a]">No Food Tastings</h3>
                    <p className="mt-2 text-sm font-medium text-gray-500">You haven't requested any food tastings yet.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {tastings.map(tasting => (
                        <div key={tasting.id} className="rounded-2xl border border-[#720101]/10 bg-[#faf7f2]/70 p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between transition-all hover:bg-[#faf7f2]">
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-[11px] font-black uppercase tracking-widest text-[#720101]">
                                        Status: {tasting.status || 'Pending'}
                                    </p>
                                    {tasting.status === 'Approved' && (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-green-800">
                                            Confirmed
                                        </span>
                                    )}
                                </div>
                                <h4 className="mt-1 text-lg font-display font-bold text-[#1a1a1a]">
                                    {displayDate(tasting.preferred_date)}
                                </h4>
                                <p className="mt-2 text-sm font-semibold leading-6 text-gray-600">
                                    {tasting.preferred_time ? `Time: ${tasting.preferred_time}` : 'Time pending'}
                                    {tasting.guest_name && ` • Guest: ${tasting.guest_name}`}
                                </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                {isOpenTasting(tasting) && (
                                    <>
                                        <button
                                            onClick={() => openEdit(tasting)}
                                            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50"
                                        >
                                            Update Schedule
                                        </button>
                                        <button
                                            onClick={() => setConfirmModal({ isOpen: true, tasting })}
                                            className="rounded-xl bg-red-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-red-700 hover:bg-red-100"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {editModal.isOpen && (
                <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-[#720101]/10 bg-white shadow-2xl transform transition-all scale-100 animate-scaleIn">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-xl font-black font-display text-slate-900">Update Tasting Schedule</h3>
                                <button onClick={() => setEditModal({ isOpen: false, tasting: null })} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <p className="mb-6 text-sm text-gray-500">
                                Select a new date and time for your food tasting request. Note that tastings are only available from Friday to Sunday between 11:00 AM and 3:00 PM.
                            </p>
                            
                            <FoodTastingSchedulePicker
                                dateValue={scheduleData.preferred_date}
                                timeValue={scheduleData.preferred_time}
                                onChange={handleScheduleChange}
                                errors={errors}
                                disabled={isSubmitting}
                            />
                            
                            <div className="mt-8 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditModal({ isOpen: false, tasting: null })}
                                    className="rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={submitUpdate}
                                    disabled={isSubmitting}
                                    className="rounded-xl bg-[#720101] px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-[#720101]/20 hover:bg-[#5a0101] transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Schedule'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, tasting: null })}
                onConfirm={async () => {
                    if (!confirmModal.tasting) return;
                    await onCancel(confirmModal.tasting.id);
                    setConfirmModal({ isOpen: false, tasting: null });
                }}
                title="Cancel Food Tasting"
                message="Are you sure you want to cancel this food tasting schedule? This action cannot be undone."
                confirmText="Cancel Session"
                isDangerous={true}
            />
        </div>
    );
};

export default ClientFoodTastings;
