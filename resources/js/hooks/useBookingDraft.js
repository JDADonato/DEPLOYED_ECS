import { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';

export const BOOKING_DRAFT_KEY = 'ecs_booking_draft';

const ACTIVE_KEY = 'ecs_booking_active';
const REMINDER_KEY = 'ecs_booking_reminder_sent';
const SMART_CACHE_PREFIX = 'ecs:smart-resource:';

export const defaultBookingData = {
    date: null, time: '', duration: 4, remainingPax: null,
    eventType: '',
    pax: 50, dietaryNotes: '',
    budget: 0, selectedDishes: { starter: [], main: [], side: [], dessert: [], drink: [] }, customMenu: {}, totalCost: 0,
    client_full_name: '', venue_address_line: '', venue_street: '', venue_city: '', venue_province: '', venue_zip_code: '', client_email: '', client_phone: '', venueDistance: 'metro-manila', isHighRise: false,
    wantsTasting: false, tasting_guest_name: '', tasting_guest_email: '', tasting_guest_phone: '', tasting_preferred_date: '', tasting_preferred_time: '', tasting_notes: ''
};

const isValidDraft = (draft, userId) => {
    return draft?._user_id === undefined || draft?._user_id === null || draft?._user_id === userId;
};

const readDraft = (userId) => {
    try {
        const saved = localStorage.getItem(BOOKING_DRAFT_KEY);
        if (!saved) return null;
        const draft = JSON.parse(saved);
        return isValidDraft(draft, userId) ? draft : null;
    } catch (error) {
        return null;
    }
};

const compactDish = (dish) => {
    if (!dish || typeof dish !== 'object') return dish;

    return {
        id: dish.id,
        dishId: dish.dishId,
        name: dish.name,
        category: dish.category,
        costPerHead: dish.costPerHead,
        priceAdj: dish.priceAdj,
        includedInPackage: dish.includedInPackage,
        isExtraSelection: dish.isExtraSelection,
    };
};

const compactMenu = (menu = {}) => Object.fromEntries(
    Object.entries(menu || {}).map(([category, dishes]) => [
        category,
        Array.isArray(dishes) ? dishes.map(compactDish).filter(Boolean) : [],
    ])
);

const compactDraft = (draft, step, userId, { minimal = false } = {}) => {
    const payload = {
        ...draft,
        selectedDishes: Object.fromEntries(
            Object.entries(draft?.selectedDishes || defaultBookingData.selectedDishes).map(([category, ids]) => [
                category,
                Array.isArray(ids) ? ids : [],
            ])
        ),
        customMenu: minimal ? {} : compactMenu(draft?.customMenu),
        _step: step,
        _user_id: userId,
    };

    Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) delete payload[key];
    });

    return payload;
};

const clearDraftStoragePressure = () => {
    try {
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith(SMART_CACHE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
        localStorage.removeItem(REMINDER_KEY);
    } catch (error) {
        // Ignore cleanup failures; saving the draft is best-effort.
    }
};

const safeSetDraft = (payload) => {
    try {
        localStorage.setItem(BOOKING_DRAFT_KEY, JSON.stringify(payload));
        return true;
    } catch (error) {
        if (error?.name !== 'QuotaExceededError') return false;
    }

    clearDraftStoragePressure();

    try {
        localStorage.setItem(BOOKING_DRAFT_KEY, JSON.stringify(payload));
        return true;
    } catch (error) {
        return false;
    }
};

const sendContinuationReminder = (draft, user) => {
    if (!user || !draft?._step || draft._step <= 1) return;

    const signature = [user.id, draft._step, draft.date || '', draft.eventType || '', draft.pax || ''].join('|');
    try {
        const previous = JSON.parse(localStorage.getItem(REMINDER_KEY) || '{}');
        const sentRecently = previous.signature === signature && Date.now() - Number(previous.sentAt || 0) < 6 * 60 * 60 * 1000;
        if (sentRecently) return;
        localStorage.setItem(REMINDER_KEY, JSON.stringify({ signature, sentAt: Date.now() }));
    } catch (error) {}

    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    fetch('/api/bookings/abandoned-reminder', {
        method: 'POST',
        keepalive: true,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'X-CSRF-TOKEN': token } : {}),
        },
        body: JSON.stringify({
            step: draft._step,
            event_date: draft.date,
            event_time: draft.time,
            event_type: draft.eventType,
            pax: draft.pax,
            client_email: draft.client_email || user.email,
            client_full_name: draft.client_full_name,
            total_cost: draft.totalCost || draft.budget || 0,
        }),
    }).catch(() => {});
};

export const saveBookingDraft = (draft, step, userId = null) => {
    const compact = compactDraft(draft, step, userId);
    if (safeSetDraft(compact)) return true;

    return safeSetDraft(compactDraft(draft, step, userId, { minimal: true }));
};

export default function useBookingDraft(user, toast) {
    const userId = user?.id;
    const initDone = useRef(false);
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [resumeStep, setResumeStep] = useState(1);
    const [currentStep, setCurrentStep] = useState(() => readDraft(userId)?._step || 1);
    const [bookingData, setBookingData] = useState(() => {
        const draft = readDraft(userId);
        if (!draft) return { ...defaultBookingData };
        const { _step, _user_id, ...rest } = draft;
        return { ...defaultBookingData, ...rest };
    });

    useEffect(() => {
        if (initDone.current) return;
        initDone.current = true;
        const wasActive = sessionStorage.getItem(ACTIVE_KEY);
        const draft = readDraft(userId);

        if (draft && !wasActive) {
            if (draft._customPackageFromMenu) {
                toast.success('Your custom package is ready! Fill in the event details to complete your booking.');
            } else if (draft._step && draft._step > 1) {
                setResumeStep(draft._step);
                setShowResumeModal(true);
            }
        }

        sessionStorage.setItem(ACTIVE_KEY, '1');
    }, [toast, userId]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            saveBookingDraft(bookingData, currentStep, userId || null);
        }, 250);

        return () => window.clearTimeout(timer);
    }, [bookingData, currentStep, userId]);

    useEffect(() => {
        const removeStartListener = router.on('start', (event) => {
            const url = event.detail.visit.url;
            const path = typeof url === 'string' ? url : url?.pathname || '';
            if (path.includes('/book')) return;

            sessionStorage.removeItem(ACTIVE_KEY);

            const draft = readDraft(userId);
            if (draft?._step && draft._step > 1) {
                toast.success('Your booking progress has been saved. You can resume anytime.');
                sendContinuationReminder(draft, user);
            }
        });

        return () => removeStartListener();
    }, [toast, user, userId]);

    const clearDraft = () => {
        localStorage.removeItem(BOOKING_DRAFT_KEY);
        sessionStorage.removeItem(ACTIVE_KEY);
    };

    const updateBooking = (data) => {
        setBookingData(prev => ({ ...prev, ...data }));
    };

    const handleResumeContinue = () => setShowResumeModal(false);

    const handleResumeStartFresh = () => {
        setBookingData({ ...defaultBookingData });
        setCurrentStep(1);
        clearDraft();
        sessionStorage.setItem(ACTIVE_KEY, '1');
        setShowResumeModal(false);
    };

    return {
        bookingData,
        clearDraft,
        currentStep,
        handleResumeContinue,
        handleResumeStartFresh,
        resumeStep,
        setBookingData,
        setCurrentStep,
        setShowResumeModal,
        showResumeModal,
        updateBooking,
    };
}
