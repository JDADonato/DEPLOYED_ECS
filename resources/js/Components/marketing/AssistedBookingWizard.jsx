import { useEffect, useMemo, useState } from 'react';
import EventIdentity from '../client/EventIdentity';
import CalendarView from '../client/CalendarView';
import GuestLogistics from '../client/GuestLogistics';
import MenuBuilder from '../client/MenuBuilder';
import EventSurcharges from '../client/EventSurcharges';
import FoodTastingStep from '../client/FoodTastingStep';
import BlueprintPanel from '../client/BlueprintPanel';
import Modal from '../common/Modal';
import csrfFetch from '../../utils/csrf';
import { defaultBookingData } from '../../hooks/useBookingDraft';

const steps = [
    { step: 0, label: 'Customer', eyebrow: 'Staff assisted', greeting: 'Who is this booking for?', sub: 'Link an existing client or create a walk-in account first.' },
    { step: 1, label: 'Details', eyebrow: 'Set logistics', greeting: 'Where should the team prepare?', sub: 'Complete contact, venue, and service details.' },
    { step: 2, label: 'Vision', eyebrow: 'Start with the occasion', greeting: 'What are we helping them celebrate?', sub: 'Choose the event type and give the booking a clear name.' },
    { step: 3, label: 'Date', eyebrow: 'Choose the day', greeting: "Let's find their date", sub: 'Pick a date, start time, and service window.' },
    { step: 4, label: 'Guests', eyebrow: 'Estimate the crowd', greeting: 'Who should we prepare for?', sub: 'Enter the guest count and any dietary notes.' },
    { step: 5, label: 'Packages', eyebrow: 'Choose package', greeting: 'Review the best package fit', sub: 'Use the same package flow customers see.' },
    { step: 6, label: 'Menu', eyebrow: 'Personalize the spread', greeting: 'Build the menu together', sub: 'Choose dishes and watch the estimate update.' },
    { step: 7, label: 'Tasting', eyebrow: 'Food tasting', greeting: 'Do they want to schedule a tasting?', sub: 'Record the preference before review.' },
    { step: 8, label: 'Review', eyebrow: 'Final review', greeting: 'Check the event plan before sending', sub: 'Confirm the customer, totals, and invite details.' },
];

const money = (value) => `PHP ${Number(value || 0).toLocaleString()}`;

const initialCustomerState = () => ({
    mode: 'existing',
    search: '',
    selected: null,
    newCustomer: { full_name: '', email: '', phone: '', username: '' },
    sendInvite: true,
});

const initialBookingState = () => ({
    ...defaultBookingData,
    pax: 50,
    package_id: 'custom',
});

const emptyCustomerSearchMeta = {
    total: 0,
    limit: 8,
    page: 1,
    last_page: 1,
    from: 0,
    to: 0,
    has_more: false,
    search: '',
};

const summarizeBookingCosts = (data = {}, businessRules = {}) => {
    const baseEventCost = data.totalCost || 0;
    const serviceCharge = Math.round(baseEventCost * (data.package_service_charge_rate || 0));
    const vatFee = Math.round(baseEventCost * (data.package_vat_rate || 0));
    const locationSurcharge = ['outside-16-30', 'outside-31-50'].includes(data.venueDistance)
        ? Math.round(baseEventCost * (data.package_location_surcharge_rate || 0.20))
        : 0;
    const highRiseFee = data.isHighRise ? Math.round(baseEventCost * (data.package_floor_surcharge_rate || 0.03)) : 0;
    const decemberSurcharge = data.date && data.package_december_surcharge && new Date(data.date).getMonth() === 11
        ? data.package_december_surcharge
        : 0;
    const contingencyFee = data.package_security_type === 'contingency'
        ? Math.round((baseEventCost + serviceCharge + vatFee + locationSurcharge + highRiseFee + decemberSurcharge) * (data.package_security_rate || 0))
        : 0;
    const cashBond = data.package_security_type === 'cash_bond' ? (data.package_cash_bond || 0) : 0;
    const overtimeFee = Math.max(0, (data.duration || 4) - 4) * (data.package_extra_service_hours_fee !== undefined ? Number(data.package_extra_service_hours_fee) : (businessRules?.extra_service_hours_fee !== undefined ? Number(businessRules.extra_service_hours_fee) : 5000));
    const laborSurcharge = serviceCharge + vatFee + highRiseFee + decemberSurcharge + contingencyFee + cashBond + overtimeFee;

    return {
        baseEventCost,
        locationSurcharge,
        laborSurcharge,
        finalTotal: baseEventCost + locationSurcharge + laborSurcharge,
    };
};

const selectedMenuRows = (data = {}) => Object.values(data.customMenu || {})
    .flat()
    .filter(Boolean)
    .map((dish) => ({
        id: `${dish.id}-${dish.name}`,
        name: dish.name,
        category: dish.category,
        included: dish.includedInPackage,
        cost: dish.includedInPackage ? 0 : Number(dish.costPerHead || dish.priceAdj || 0) * Number(data.pax || 0),
    }));

const selectedMenuPayload = (data = {}) => ({
    source: 'assisted_booking_wizard',
    package: data.package_name ? {
        id: data.package_id || 'custom',
        name: data.package_name,
        category: data.package_category_label,
    } : null,
    items: Object.entries(data.customMenu || {}).flatMap(([category, dishes]) => (
        (dishes || []).map((dish) => ({
            id: dish.id,
            name: dish.name,
            category,
            included: Boolean(dish.includedInPackage),
            price_per_head: Number(dish.costPerHead || dish.priceAdj || 0),
        }))
    )),
    notes: data.dietaryNotes || null,
});

const logAssistedConversionEvent = (eventName, payload = {}) => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('ecs:funnel', {
        detail: {
            event: eventName,
            source: 'assisted_booking_wizard',
            ...payload,
        },
    }));
};

const AssistedBookingWizard = ({ isOpen, onClose, onCreated, onOpenBooking, toast, businessRules }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [customerState, setCustomerState] = useState(initialCustomerState);
    const [bookingData, setBookingData] = useState(initialBookingState);
    const [summaryCollapsed, setSummaryCollapsed] = useState(false);
    const [customerResults, setCustomerResults] = useState([]);
    const [customerSearchMeta, setCustomerSearchMeta] = useState(emptyCustomerSearchMeta);
    const [customerSearchPage, setCustomerSearchPage] = useState(1);
    const [customerLoading, setCustomerLoading] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, type: 'error', title: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [upfrontPayment, setUpfrontPayment] = useState({
        enabled: false,
        tranches: [],
        method: 'Cash',
        reference: '',
    });

    const reviewCosts = useMemo(() => summarizeBookingCosts(bookingData, businessRules), [bookingData, businessRules]);

    const availableTranches = useMemo(() => {
        if (!bookingData.date) return [];
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const [year, month, day] = bookingData.date.split('-');
        const eventDate = new Date(year, month - 1, day);
        
        const days = Math.round((eventDate - today) / (1000 * 60 * 60 * 24));
        const total = reviewCosts?.finalTotal || 0;
        if (!total) return [];
        
        const resPct = businessRules?.reservation_fee_percentage !== undefined ? Number(businessRules.reservation_fee_percentage) : 10;
        const dpPct = businessRules?.downpayment_percentage !== undefined ? Number(businessRules.downpayment_percentage) : 70;
        const fpPct = businessRules?.final_payment_percentage !== undefined ? Number(businessRules.final_payment_percentage) : 20;
        const finalDays = businessRules?.final_payment_due_days !== undefined ? Number(businessRules.final_payment_due_days) : 10;
        const dpDays = businessRules?.downpayment_due_days !== undefined ? Number(businessRules.downpayment_due_days) : 30;

        if (days <= finalDays) {
            return [{ id: 'Final', label: '100% Full Payment', amount: total }];
        }
        if (days <= dpDays) {
            const upfrontPct = resPct + dpPct;
            return [
                { id: 'DownPayment', label: `${upfrontPct}% Down Payment`, amount: total * (upfrontPct / 100) },
                { id: 'Final', label: `${fpPct}% Final Balance`, amount: total * (fpPct / 100) }
            ];
        }
        return [
            { id: 'Reservation', label: `${resPct}% Reservation`, amount: total * (resPct / 100) },
            { id: 'DownPayment', label: `${dpPct}% Down Payment`, amount: total * (dpPct / 100) },
            { id: 'Final', label: `${fpPct}% Final Balance`, amount: total * (fpPct / 100) }
        ];
    }, [bookingData.date, reviewCosts?.finalTotal, businessRules]);

    const selectedTotal = useMemo(() => {
        return availableTranches
            .filter(t => upfrontPayment.tranches.includes(t.id))
            .reduce((sum, t) => sum + t.amount, 0);
    }, [availableTranches, upfrontPayment.tranches]);

    useEffect(() => {
        if (!isOpen) return;
        
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        
        setCurrentStep(0);
        setCustomerState(initialCustomerState());
        setBookingData(initialBookingState());
        setCustomerResults([]);
        setCustomerSearchMeta(emptyCustomerSearchMeta);
        setCustomerSearchPage(1);
        setSummaryCollapsed(false);
        setResult(null);
        logAssistedConversionEvent('assisted_booking_started', {
            step: 'Customer',
            metadata: { entry_point: 'marketing_workspace' },
        });

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        logAssistedConversionEvent('assisted_booking_step_viewed', {
            step: steps.find(item => item.step === currentStep)?.label || String(currentStep),
            metadata: {
                step_number: currentStep,
                customer_mode: customerState.mode,
                event_type: bookingData.eventType || null,
                pax: bookingData.pax || null,
            },
        });
    }, [isOpen, currentStep]);

    useEffect(() => {
        setCustomerSearchPage(1);
    }, [customerState.search]);

    useEffect(() => {
        if (!isOpen || customerState.mode !== 'existing') return;
        const search = customerState.search.trim();
        if (search.length < 2) {
            setCustomerResults([]);
            setCustomerSearchMeta(emptyCustomerSearchMeta);
            return;
        }

        let cancelled = false;
        setCustomerLoading(true);
        const timer = window.setTimeout(async () => {
            try {
                const response = await fetch(`/api/marketing/customers?search=${encodeURIComponent(search)}&limit=8&page=${customerSearchPage}`, {
                    headers: { Accept: 'application/json' },
                    credentials: 'same-origin',
                });
                const data = await response.json().catch(() => ({}));
                if (!cancelled) {
                    const results = Array.isArray(data) ? data : (data.data || []);
                    setCustomerResults(results);
                    setCustomerSearchMeta(Array.isArray(data) ? {
                        total: results.length,
                        limit: 8,
                        page: 1,
                        last_page: 1,
                        from: results.length ? 1 : 0,
                        to: results.length,
                        has_more: false,
                        search,
                    } : (data.meta || {
                        total: results.length,
                        limit: 8,
                        page: customerSearchPage,
                        last_page: 1,
                        from: results.length ? 1 : 0,
                        to: results.length,
                        has_more: false,
                        search,
                    }));
                }
            } catch (error) {
                if (!cancelled) {
                    setCustomerResults([]);
                    setCustomerSearchMeta(emptyCustomerSearchMeta);
                }
            } finally {
                if (!cancelled) setCustomerLoading(false);
            }
        }, 250);

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [customerState.mode, customerState.search, customerSearchPage, isOpen]);

    const updateBooking = (data) => setBookingData(prev => ({ ...prev, ...data }));
    const customerPseudoUser = useMemo(() => {
        const selected = customerState.selected;
        const customer = customerState.mode === 'existing' ? selected : customerState.newCustomer;
        return {
            email: customer?.email || '',
            phone: customer?.phone || '',
        };
    }, [customerState]);


    const menuRows = selectedMenuRows(bookingData);
    const activeStep = steps[currentStep] || steps[0];
    const progressPercent = Math.round((currentStep / (steps.length - 1)) * 100);
    const canContinueCustomer = customerState.mode === 'existing'
        ? Boolean(customerState.selected?.id)
        : Boolean(customerState.newCustomer.full_name.trim() && customerState.newCustomer.email && customerState.newCustomer.username.trim());
    const useCompactCustomerResults = customerResults.length > 4;

    const showError = (title, message) => setModal({ isOpen: true, type: 'error', title, message });

    const selectCustomer = (customer) => {
        setCustomerState(prev => ({ ...prev, selected: customer, search: customer.full_name || customer.username || '' }));
        updateBooking({
            client_full_name: customer.full_name || customer.username || '',
            client_email: customer.email || '',
            client_phone: customer.phone || '',
        });
    };

    const updateNewCustomer = (field, value) => {
        setCustomerState(prev => ({
            ...prev,
            newCustomer: { ...prev.newCustomer, [field]: value },
        }));
        if (field === 'full_name') updateBooking({ client_full_name: value });
        if (field === 'email') updateBooking({ client_email: value });
        if (field === 'phone') updateBooking({ client_phone: value });
    };

    const validateCustomerStep = () => {
        if (customerState.mode === 'existing' && !customerState.selected?.id) {
            showError('Choose a customer', 'Search and select the customer account this booking should belong to.');
            return false;
        }

        if (customerState.mode === 'new' && !customerState.newCustomer.full_name.trim()) {
            showError('Customer name needed', 'Enter the walk-in customer name before continuing.');
            return false;
        }

        if (customerState.mode === 'new' && !customerState.newCustomer.email) {
            showError('Email needed', 'An email address is required so the customer can receive the booking invite and updates.');
            return false;
        }

        if (customerState.mode === 'new' && !customerState.newCustomer.username.trim()) {
            showError('Username needed', 'A username is required so the customer can log in later.');
            return false;
        }

        return true;
    };

    const validateStep = (step) => {
        if (step === 0) return validateCustomerStep();
        if (step === 1 && (!bookingData.eventType || !String(bookingData.eventName || '').trim())) {
            showError('Event vision needed', 'Choose an event type and enter an event name.');
            return false;
        }
        if (step === 2 && (!bookingData.date || !bookingData.time)) {
            showError('Schedule needed', 'Choose an event date and time.');
            return false;
        }
        if (step === 3 && (!bookingData.pax || Number(bookingData.pax) < 20)) {
            showError('Guest count needed', 'Enter at least 20 guests.');
            return false;
        }
        if (step === 5) {
            const missing = ['starter', 'main', 'side', 'dessert', 'drink'].filter(category => !(bookingData.selectedDishes?.[category]?.length));
            if (missing.length) {
                showError('Complete the menu', 'Choose at least one item in each menu category.');
                return false;
            }
        }
        if (step === 6 && (!bookingData.client_full_name || !bookingData.client_phone || !bookingData.venue_city || !bookingData.venue_address_line)) {
            showError('Logistics needed', 'Complete the event contact, phone number, venue address, and city.');
            return false;
        }
        return true;
    };

    const goNext = (skipValidation = false) => {
        if (skipValidation || validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
        }
    };

    const goBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const handleStepperClick = (targetStep) => {
        if (targetStep <= currentStep) {
            setCurrentStep(targetStep);
            return;
        }

        for (let step = currentStep; step < targetStep; step += 1) {
            if (!validateStep(step)) {
                setCurrentStep(step);
                return;
            }
        }
        setCurrentStep(targetStep);
    };

    const openReview = (extraData = {}) => {
        const merged = { ...bookingData, ...extraData };
        setBookingData(merged);

        for (let step = 0; step <= 6; step += 1) {
            if (!validateStep(step)) {
                setCurrentStep(step);
                return;
            }
        }

        if (merged.wantsTasting && (!merged.tasting_preferred_date || !merged.tasting_preferred_time)) {
            showError('Tasting details needed', 'Choose the preferred tasting date and time, or skip tasting for now.');
            setCurrentStep(7);
            return;
        }

        setCurrentStep(8);
    };

    const submitBooking = async () => {
        if (isSubmitting) return;
        if (!validateCustomerStep()) {
            setCurrentStep(0);
            return;
        }

        const costs = summarizeBookingCosts(bookingData, businessRules);
        const customer = customerState.mode === 'existing' ? customerState.selected : customerState.newCustomer;
        const payload = {
            customer_mode: customerState.mode,
            customer_id: customerState.mode === 'existing' ? customerState.selected?.id : null,
            customer: customerState.newCustomer,
            send_invite: customerState.sendInvite,
            event_date: bookingData.date,
            event_time: bookingData.time,
            event_type: bookingData.eventType,
            event_name: bookingData.eventName,
            pax: Number(bookingData.pax || 0),
            budget: costs.finalTotal,
            package_id: String(bookingData.package_id || 'custom'),
            total_cost: costs.finalTotal,
            menu_items: [],
            selected_menu: selectedMenuPayload(bookingData),
            client_full_name: bookingData.client_full_name || customer?.full_name || customer?.username,
            client_email: bookingData.client_email || customer?.email,
            client_phone: bookingData.client_phone || customer?.phone,
            venue_address_line: bookingData.venue_address_line,
            venue_street: bookingData.venue_street,
            venue_city: bookingData.venue_city,
            venue_province: bookingData.venue_province,
            venue_zip_code: bookingData.venue_zip_code,
            venue_building_details: bookingData.venue_building_details,
            dietary_notes: bookingData.dietaryNotes,
            special_instructions: bookingData.dietaryNotes,
            venue_distance: bookingData.venueDistance,
            is_high_rise: bookingData.isHighRise,
            transport_fee: costs.locationSurcharge,
            labor_surcharge: costs.laborSurcharge,
            upfront_payment: upfrontPayment.enabled && upfrontPayment.tranches.length > 0 ? {
                tranches: upfrontPayment.tranches,
                method: upfrontPayment.method,
                reference: upfrontPayment.reference,
            } : null,
            wants_tasting: Boolean(bookingData.wantsTasting),
            tasting: bookingData.wantsTasting ? {
                guest_name: bookingData.tasting_guest_name || bookingData.client_full_name || customer?.full_name || customer?.username,
                guest_email: bookingData.tasting_guest_email || bookingData.client_email || customer?.email,
                guest_phone: bookingData.tasting_guest_phone || bookingData.client_phone || customer?.phone,
                preferred_date: bookingData.tasting_preferred_date,
                preferred_time: bookingData.tasting_preferred_time,
                notes: bookingData.tasting_notes,
            } : null,
        };

        setIsSubmitting(true);
        try {
            const response = await csrfFetch('/api/marketing/bookings/assisted', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const message = data.errors
                    ? Object.values(data.errors).flat().join(' ')
                    : data.error || data.message || 'Assisted booking could not be created.';
                throw new Error(message);
            }

            setResult(data);
            
            // Auto-open PayMongo checkout if present
            if (data.paymongo_checkout_url) {
                window.open(data.paymongo_checkout_url, '_blank');
            }

            onCreated?.(data);
            if (toast && typeof toast.success === 'function') toast.success(data.message || 'Assisted booking created.');
            else if (typeof toast === 'function') toast(data.message || 'Assisted booking created.');
        } catch (error) {
            if (toast && typeof toast.error === 'function') toast.error(error.message || 'Assisted booking could not be created.');
            else if (typeof toast === 'function') toast(error.message || 'Assisted booking could not be created.');
            
            if (String(error.message || '').toLowerCase().includes('already exists')) {
                setCurrentStep(0);
            }
            showError('Booking could not be created', error.message || 'Please review the details and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const startAnother = () => {
        setCurrentStep(0);
        setCustomerState(initialCustomerState());
        setBookingData(initialBookingState());
        setCustomerResults([]);
        setCustomerSearchMeta(emptyCustomerSearchMeta);
        setCustomerSearchPage(1);
        setResult(null);
    };

    if (!isOpen) return null;

    const renderCustomerStep = () => (
        <div className="booking-step">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
                <section className="overflow-hidden rounded-[1.5rem] border border-[#720101]/10 bg-white shadow-[0_18px_48px_rgba(74,20,0,.06)]">
                    <div className="border-b border-slate-100 bg-[#fffaf3] p-5 sm:p-6">
                        <p className="booking-step-kicker">Customer account</p>
                        <h2 className="mt-2 font-display text-3xl font-black leading-tight text-slate-950 sm:text-4xl">Start with the client record.</h2>
                        <p className="mt-2 max-w-3xl text-base font-semibold leading-7 text-slate-500">
                            Search first to avoid duplicate accounts. If this is a walk-in, create a lightweight Client account before continuing the same booking flow the customer would see.
                        </p>
                    </div>

                    <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => setCustomerState(prev => ({ ...prev, mode: 'existing' }))}
                            className={`rounded-2xl border p-5 text-left transition ${customerState.mode === 'existing' ? 'border-[#720101] bg-[#720101] text-white shadow-lg shadow-[#720101]/15' : 'border-slate-200 bg-white text-slate-800 hover:border-[#720101]/30 hover:bg-[#fff7e8]'}`}
                        >
                            <span className="text-xs font-black uppercase tracking-widest opacity-70">Recommended</span>
                            <strong className="mt-2 block text-xl font-black">Existing customer</strong>
                            <span className={`mt-1 block text-sm font-bold leading-6 ${customerState.mode === 'existing' ? 'text-white/75' : 'text-slate-500'}`}>
                                Find the account by name, email, username, or phone and attach the booking.
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setCustomerState(prev => ({ ...prev, mode: 'new', selected: null }))}
                            className={`rounded-2xl border p-5 text-left transition ${customerState.mode === 'new' ? 'border-[#720101] bg-[#720101] text-white shadow-lg shadow-[#720101]/15' : 'border-slate-200 bg-white text-slate-800 hover:border-[#720101]/30 hover:bg-[#fff7e8]'}`}
                        >
                            <span className="text-xs font-black uppercase tracking-widest opacity-70">Walk-in</span>
                            <strong className="mt-2 block text-xl font-black">New customer</strong>
                            <span className={`mt-1 block text-sm font-bold leading-6 ${customerState.mode === 'new' ? 'text-white/75' : 'text-slate-500'}`}>
                                Create a Client account now, then continue building the booking with them.
                            </span>
                        </button>
                    </div>

                    <div className="px-5 pb-6 sm:px-6">
                    {customerState.mode === 'existing' ? (
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Find customer</p>
                                    <h3 className="text-lg font-black text-slate-950">Search existing accounts</h3>
                                </div>
                                {customerState.selected?.id && (
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-700">Selected</span>
                                )}
                            </div>
                            <input
                                value={customerState.search}
                                onChange={(event) => setCustomerState(prev => ({ ...prev, search: event.target.value, selected: null }))}
                                placeholder="Search name, email, username, or phone"
                                className="booking-input"
                            />
                            <p className="text-xs font-bold text-slate-500">Search by exact email or phone for best results.</p>
                            {customerLoading && <p className="text-sm font-bold text-slate-500">Searching customers...</p>}
                            {customerResults.length > 0 && (
                                <div className="flex flex-col gap-2 rounded-2xl border border-[#720101]/10 bg-white px-4 py-3 text-sm font-bold text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                                    <span>
                                        Showing {customerSearchMeta.from || 1}-{customerSearchMeta.to || customerResults.length} of {customerSearchMeta.total || customerResults.length} matches.
                                    </span>
                                    {customerSearchMeta.has_more && (
                                        <span className="text-[#720101]">Add email or phone to narrow results.</span>
                                    )}
                                </div>
                            )}
                            <div className={useCompactCustomerResults ? 'grid gap-2' : 'grid gap-3 md:grid-cols-2'}>
                                {customerResults.map(customer => (
                                    <button
                                        key={customer.id}
                                        type="button"
                                        onClick={() => selectCustomer(customer)}
                                        className={`rounded-2xl border text-left transition ${useCompactCustomerResults ? 'flex items-center justify-between gap-4 p-3' : 'p-4'} ${customerState.selected?.id === customer.id ? 'border-[#720101] bg-[#fff7e8]' : 'border-slate-200 bg-white hover:border-[#720101]/30'}`}
                                    >
                                        <span className="min-w-0">
                                            <strong className="block truncate text-slate-950">{customer.full_name || customer.username}</strong>
                                            <span className="mt-1 block truncate text-sm font-semibold text-slate-500">{customer.email || 'No email'} / {customer.phone || 'No phone'}</span>
                                        </span>
                                        {useCompactCustomerResults && (
                                            <span className={`flex-none rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest ${customerState.selected?.id === customer.id ? 'bg-[#720101] text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                {customerState.selected?.id === customer.id ? 'Selected' : customer.account_status || 'Active'}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                            {Number(customerSearchMeta.last_page || 1) > 1 && (
                                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
                                    <span className="text-sm font-black text-slate-500">
                                        Page {customerSearchMeta.page || customerSearchPage} of {customerSearchMeta.last_page}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setCustomerSearchPage(page => Math.max(page - 1, 1))}
                                            disabled={customerLoading || Number(customerSearchMeta.page || customerSearchPage) <= 1}
                                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition hover:border-[#720101]/30 hover:bg-[#fff7e8] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCustomerSearchPage(page => Math.min(page + 1, Number(customerSearchMeta.last_page || page)))}
                                            disabled={customerLoading || Number(customerSearchMeta.page || customerSearchPage) >= Number(customerSearchMeta.last_page || 1)}
                                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition hover:border-[#720101]/30 hover:bg-[#fff7e8] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                            {customerState.search.trim().length >= 2 && !customerLoading && customerResults.length === 0 && (
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center">
                                    <p className="font-black text-slate-800">No matching customer found.</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-500">Switch to New customer if this is a walk-in or first-time client.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Walk-in details</p>
                                <h3 className="text-lg font-black text-slate-950">Create lightweight Client account</h3>
                                <p className="mt-1 text-sm font-bold leading-6 text-slate-500">Search first if the customer may already have an account. Duplicate email or phone will be blocked.</p>
                            </div>
                            <label className="md:col-span-2">
                                <span className="booking-field-label">Customer full name</span>
                                <input value={customerState.newCustomer.full_name} onChange={(event) => updateNewCustomer('full_name', event.target.value)} className="booking-input" placeholder="Walk-in customer name" />
                            </label>
                            <label>
                                <span className="booking-field-label">Email</span>
                                <input type="email" value={customerState.newCustomer.email} onChange={(event) => updateNewCustomer('email', event.target.value)} className="booking-input" placeholder="customer@email.com" />
                            </label>
                            <label>
                                <span className="booking-field-label">Phone <em>Optional</em></span>
                                <input value={customerState.newCustomer.phone} onChange={(event) => updateNewCustomer('phone', event.target.value)} className="booking-input" placeholder="Mobile number" />
                            </label>
                            <label className="md:col-span-2">
                                <span className="booking-field-label">Username</span>
                                <input value={customerState.newCustomer.username} onChange={(event) => updateNewCustomer('username', event.target.value)} className="booking-input" placeholder="Desired username for login" />
                            </label>
                        </div>
                    )}
                    </div>
                </section>

                <aside className="space-y-4">
                    <div className="rounded-[1.5rem] border border-[#720101]/10 bg-white p-5 shadow-[0_18px_48px_rgba(74,20,0,.05)]">
                        <p className="booking-step-kicker">How this works</p>
                        <ul className="mt-4 space-y-3 text-sm font-bold leading-6 text-slate-600">
                            <li className="flex gap-3"><span className="mt-2 h-2 w-2 flex-none rounded-full bg-[#720101]" />The booking is always attached to a real Client account.</li>
                            <li className="flex gap-3"><span className="mt-2 h-2 w-2 flex-none rounded-full bg-[#720101]" />Marketing owns the booking after submission.</li>
                            <li className="flex gap-3"><span className="mt-2 h-2 w-2 flex-none rounded-full bg-[#720101]" />The customer can later use dashboard, payments, chat, receipts, and feedback.</li>
                        </ul>
                    </div>
                    <label className="flex items-start gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_48px_rgba(74,20,0,.05)]">
                        <input
                            type="checkbox"
                            checked={customerState.sendInvite}
                            onChange={(event) => setCustomerState(prev => ({ ...prev, sendInvite: event.target.checked }))}
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-[#720101] focus:ring-[#720101]"
                        />
                        <span>
                            <strong className="block text-sm text-slate-950">Send customer invite when possible</strong>
                            <span className="mt-1 block text-sm font-semibold leading-6 text-slate-500">Email delivery is attempted after booking creation. The temporary password is still shown as fallback.</span>
                        </span>
                    </label>
                </aside>
            </div>
            <div className="booking-step-actions">
                <button type="button" onClick={onClose} className="booking-secondary-btn">Close</button>
                <button type="button" onClick={() => goNext()} disabled={!canContinueCustomer} className="booking-primary-btn">Continue</button>
            </div>
        </div>
    );

    const renderReviewStep = () => (
        <div className="booking-step">
            <div className="booking-step-grid">
                <section className="booking-step-panel">
                    <p className="booking-step-kicker">Review</p>
                    <h2>Confirm before creating the booking.</h2>
                    <p>Marketing will own this booking after submission. The customer account will receive an invite if email delivery is possible.</p>
                    <div className="mt-6 rounded-2xl border border-[#720101]/10 bg-[#fff7e8] p-5">
                        <span className="text-xs font-black uppercase tracking-widest text-[#9f6500]">Estimated total</span>
                        <strong className="mt-2 block text-3xl font-black text-[#720101]">{money(reviewCosts.finalTotal)}</strong>
                    </div>
                </section>

                <section className="booking-choice-area space-y-4">
                    <div className="booking-review-card">
                        <span>Customer</span>
                        <dl>
                            <div><dt>Mode</dt><dd>{customerState.mode === 'new' ? 'New walk-in customer' : 'Existing customer'}</dd></div>
                            <div><dt>Name</dt><dd>{customerState.mode === 'new' ? customerState.newCustomer.full_name : customerState.selected?.full_name || customerState.selected?.username}</dd></div>
                            <div><dt>Email</dt><dd>{customerState.mode === 'new' ? customerState.newCustomer.email || 'No email' : customerState.selected?.email || 'No email'}</dd></div>
                        </dl>
                    </div>
                    <div className="booking-review-card">
                        <span>Event</span>
                        <dl>
                            <div><dt>Type</dt><dd>{bookingData.eventType || '-'}</dd></div>
                            <div><dt>Date</dt><dd>{bookingData.date || '-'}</dd></div>
                            <div><dt>Time</dt><dd>{bookingData.time || '-'}</dd></div>
                            <div><dt>Guests</dt><dd>{bookingData.pax ? `${bookingData.pax} pax` : '-'}</dd></div>
                            <div><dt>Venue</dt><dd>{[bookingData.venue_address_line, bookingData.venue_city].filter(Boolean).join(', ') || '-'}</dd></div>
                        </dl>
                    </div>
                    <div className="booking-review-card">
                        <span>Menu</span>
                        {bookingData.package_name && (
                            <div className="booking-review-package">
                                <strong>{bookingData.package_name}</strong>
                                <b>{bookingData.package_pricing_type === 'budget' ? money(bookingData.budget || 0) : money(bookingData.package_pricing_type === 'flat' ? bookingData.package_flat_price : (bookingData.package_base_price || 0) * (bookingData.pax || 0))}</b>
                            </div>
                        )}
                        {menuRows.length ? (
                            <ul className="booking-review-menu">
                                {menuRows.map(row => (
                                    <li key={row.id}>
                                        <span>{row.name}</span>
                                        <strong>{row.included ? 'Included' : money(row.cost)}</strong>
                                    </li>
                                ))}
                            </ul>
                        ) : <p className="booking-review-muted">No dishes selected yet.</p>}
                    </div>

                    {(reviewCosts.serviceCharge > 0 || reviewCosts.vatFee > 0 || reviewCosts.locationSurcharge > 0 || reviewCosts.highRiseFee > 0 || reviewCosts.decemberSurcharge > 0 || reviewCosts.contingencyFee > 0 || reviewCosts.cashBond > 0 || reviewCosts.overtimeFee > 0) && (
                        <div className="booking-review-card">
                            <span>Fees & Surcharges</span>
                            <ul className="booking-review-menu">
                                {reviewCosts.serviceCharge > 0 && <li><span>Service Charge</span><strong>{money(reviewCosts.serviceCharge)}</strong></li>}
                                {reviewCosts.vatFee > 0 && <li><span>VAT</span><strong>{money(reviewCosts.vatFee)}</strong></li>}
                                {reviewCosts.locationSurcharge > 0 && <li><span>Location Surcharge</span><strong>{money(reviewCosts.locationSurcharge)}</strong></li>}
                                {reviewCosts.highRiseFee > 0 && <li><span>High-Rise Surcharge</span><strong>{money(reviewCosts.highRiseFee)}</strong></li>}
                                {reviewCosts.decemberSurcharge > 0 && <li><span>December Surcharge</span><strong>{money(reviewCosts.decemberSurcharge)}</strong></li>}
                                {reviewCosts.contingencyFee > 0 && <li><span>Security / Contingency Fee</span><strong>{money(reviewCosts.contingencyFee)}</strong></li>}
                                {reviewCosts.cashBond > 0 && <li><span>Refundable Cash Bond</span><strong>{money(reviewCosts.cashBond)}</strong></li>}
                                {reviewCosts.overtimeFee > 0 && <li><span>Overtime Fee</span><strong>{money(reviewCosts.overtimeFee)}</strong></li>}
                            </ul>
                        </div>
                    )}

                    <div className="booking-review-card">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="font-bold text-[#720101]">Optional: Upfront Walk-in Payment</span>
                            <label className="flex cursor-pointer items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={upfrontPayment.enabled}
                                    onChange={(e) => setUpfrontPayment({ ...upfrontPayment, enabled: e.target.checked })}
                                    className="h-5 w-5 rounded border-slate-300 text-[#720101] focus:ring-[#720101]"
                                />
                                <span className="text-sm font-medium text-slate-700">Record Payment</span>
                            </label>
                        </div>
                        {upfrontPayment.enabled && (
                            <div className="grid gap-4">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">Select terms to pay now</label>
                                    <div className="space-y-2">
                                        {availableTranches.map(t => (
                                            <label key={t.id} className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 hover:bg-slate-100">
                                                <div className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={upfrontPayment.tranches.includes(t.id)}
                                                        onChange={(e) => {
                                                            const newTranches = e.target.checked 
                                                                ? [...upfrontPayment.tranches, t.id]
                                                                : upfrontPayment.tranches.filter(id => id !== t.id);
                                                            setUpfrontPayment({ ...upfrontPayment, tranches: newTranches });
                                                        }}
                                                        className="h-4 w-4 rounded border-slate-300 text-[#720101] focus:ring-[#720101]"
                                                    />
                                                    <span className="text-sm font-semibold text-slate-800">{t.label}</span>
                                                </div>
                                                <span className="text-sm font-black text-slate-900">{money(t.amount)}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                                        <span className="text-sm font-black text-slate-600">Selected Total</span>
                                        <span className="text-lg font-black text-[#720101]">{money(selectedTotal)}</span>
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">Payment Method</label>
                                        <select
                                            className="booking-input"
                                            value={upfrontPayment.method}
                                            onChange={(e) => setUpfrontPayment({ ...upfrontPayment, method: e.target.value })}
                                        >
                                            <option value="Cash">Cash</option>
                                            <option value="Card Terminal">Card Terminal</option>
                                            <option value="PayMongo">PayMongo Checkout Link</option>
                                        </select>
                                    </div>
                                    <div className={upfrontPayment.method !== 'Card Terminal' ? 'hidden' : ''}>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">Terminal Trace / Approval Code (Optional)</label>
                                        <input
                                            type="text"
                                            className="booking-input"
                                            placeholder="e.g. TR-12345 or APPV-123"
                                            value={upfrontPayment.reference}
                                            onChange={(e) => setUpfrontPayment({ ...upfrontPayment, reference: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
            <div className="booking-step-actions">
                <button type="button" onClick={goBack} disabled={isSubmitting} className="booking-secondary-btn disabled:opacity-50">Back</button>
                <button type="button" onClick={submitBooking} disabled={isSubmitting} className="booking-primary-btn disabled:bg-slate-200 disabled:text-slate-500">
                    {isSubmitting ? 'Creating booking...' : 'Create Assisted Booking'}
                </button>
            </div>
        </div>
    );

    const renderSuccess = () => {
        const delivery = result.invite_delivery || result.invite_delivery_status || {};
        const booking = result.booking || {};
        const customer = result.customer || {};

        return (
            <div className="booking-page fixed inset-0 z-[9998] overflow-y-auto bg-[#fffaf3] font-sans text-slate-900">
                <div className="mx-auto flex min-h-screen max-w-4xl items-center px-4 py-10">
                    <div className="w-full overflow-hidden rounded-[2rem] bg-white shadow-2xl">
                        <div className="border-b border-emerald-100 bg-emerald-50 p-8">
                            <p className="booking-step-kicker text-emerald-700">Assisted booking created</p>
                            <h2 className="mt-2 font-display text-3xl font-black text-slate-950">Booking #{booking.id} is ready</h2>
                            <p className="mt-2 text-sm font-semibold text-slate-600">The booking is attached to {customer.full_name || customer.username || 'the customer'}.</p>
                        </div>
                        <div className="grid gap-4 p-8 md:grid-cols-3">
                            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Customer</span>
                                <strong className="mt-2 block text-slate-950">{customer.created ? 'New account' : 'Existing account'}</strong>
                                <p className="mt-1 text-sm font-semibold text-slate-500">{customer.email || 'No email on file'}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Invite</span>
                                <strong className="mt-2 block text-slate-950">{delivery.status || 'not sent'}</strong>
                                <p className="mt-1 text-sm font-semibold text-slate-500">{delivery.message || 'No delivery details returned.'}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Payments</span>
                                <strong className="mt-2 block text-slate-950">{booking.payments?.length || 0} terms</strong>
                                <p className="mt-1 text-sm font-semibold text-slate-500">Generated from the booking total.</p>
                            </div>
                        </div>
                        {result.paymongo_checkout_url && (
                            <div className="mx-8 rounded-2xl border border-blue-200 bg-blue-50 p-5 mt-4">
                                <span className="text-xs font-black uppercase tracking-widest text-blue-600">PayMongo Checkout Ready</span>
                                <p className="mt-2 text-sm font-bold text-blue-800">Please direct the customer to scan the QR code or click the link to pay {money(selectedTotal)}</p>
                                <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(result.paymongo_checkout_url)}`} alt="PayMongo QR Code" className="h-32 w-32 rounded-xl bg-white p-2 shadow" />
                                    <div className="w-full">
                                        <input type="text" readOnly value={result.paymongo_checkout_url} className="w-full rounded-xl border border-blue-200 bg-white p-3 text-sm text-blue-900" />
                                        <a href={result.paymongo_checkout_url} target="_blank" rel="noreferrer" className="mt-2 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">Open Checkout</a>
                                    </div>
                                </div>
                            </div>
                        )}
                        {result.temporary_password && (
                            <div className="mx-8 mt-4 rounded-2xl border border-[#f0aa0b]/40 bg-[#fff7e8] p-5">
                                <span className="text-xs font-black uppercase tracking-widest text-[#9f6500]">Temporary password fallback</span>
                                <strong className="mt-2 block text-2xl text-[#720101]">{result.temporary_password}</strong>
                                <p className="mt-2 text-sm font-bold text-[#7c4a03]">Copy this only if the invite email is unavailable. It expires at the same time as the account invite.</p>
                            </div>
                        )}
                        <div className="flex flex-col gap-3 p-8 sm:flex-row sm:justify-end">
                            <button type="button" onClick={startAnother} className="booking-secondary-btn">Start another</button>
                            <button type="button" onClick={onClose} className="booking-secondary-btn">Close</button>
                            <button type="button" onClick={() => { onOpenBooking?.(booking); onClose?.(); }} className="booking-primary-btn">Open booking</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (result) return renderSuccess();

    const renderStep = () => {
        if (currentStep === 0) return renderCustomerStep();
        if (currentStep === 1) return <EventSurcharges bookingData={bookingData} updateBooking={updateBooking} onNext={goNext} onBack={goBack} user={customerPseudoUser} requireEmail={false} />;
        if (currentStep === 2) return <EventIdentity bookingData={bookingData} updateBooking={updateBooking} onNext={goNext} onBack={goBack} />;
        if (currentStep === 3) return <CalendarView bookingData={bookingData} updateBooking={updateBooking} onNext={goNext} onBack={goBack} />;
        if (currentStep === 4) return <GuestLogistics bookingData={bookingData} updateBooking={updateBooking} onNext={goNext} onBack={goBack} businessRules={businessRules} />;
        if (currentStep === 5) return <MenuBuilder mode="packages" bookingData={bookingData} updateBooking={updateBooking} onNext={goNext} onBack={goBack} />;
        if (currentStep === 6) return <MenuBuilder mode="menu" bookingData={bookingData} updateBooking={updateBooking} onNext={goNext} onBack={goBack} />;
        if (currentStep === 7) return <FoodTastingStep bookingData={bookingData} updateBooking={updateBooking} onReview={openReview} onBack={goBack} isSubmitting={isSubmitting} />;
        return renderReviewStep();
    };

    return (
        <div className="booking-page !pb-0 fixed inset-0 z-[9998] overflow-hidden bg-[#fffaf3] font-sans text-slate-900" style={{ paddingBottom: 0 }}>
            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
                title={modal.title}
                message={modal.message}
                type={modal.type}
            />
            <div className="flex absolute inset-0 min-h-0">
                <main className="min-w-0 flex-1 h-full overflow-y-auto overscroll-none pb-32 lg:pb-0" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <div className="border-b border-[#720101]/10 bg-white">
                        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <button type="button" onClick={onClose} className="text-xs font-black uppercase tracking-widest text-slate-400 transition hover:text-[#720101]">
                                        <span className="mr-2 text-base leading-none">&larr;</span>
                                        Back to Marketing
                                    </button>
                                    <div className="mt-3">
                                        <p className="text-[11px] font-black uppercase tracking-widest text-[#9f6500]">{activeStep.eyebrow}</p>
                                        <h1 className="mt-1 font-display text-2xl font-bold leading-tight text-[#1a1a1a] sm:text-3xl">{activeStep.greeting}</h1>
                                        <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-slate-500">{activeStep.sub}</p>
                                    </div>
                                </div>
                                <div className="w-full max-w-xl lg:w-[34rem]">
                                    <div className="mb-2 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                                        <span>Step {currentStep + 1} of {steps.length}</span>
                                        <span className="text-[#720101]">{progressPercent}% complete</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-[#720101]/10">
                                        <div className="h-full rounded-full bg-[#720101] transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 custom-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
                                {steps.map(item => {
                                    const isActive = currentStep === item.step;
                                    const isComplete = currentStep > item.step;
                                    return (
                                        <button
                                            key={item.step}
                                            type="button"
                                            onClick={() => handleStepperClick(item.step)}
                                            className={`min-w-[6rem] flex-shrink-0 rounded-full border px-4 py-2 text-xs font-black transition ${isActive
                                                ? 'border-[#720101] bg-[#720101] text-white'
                                                : isComplete
                                                    ? 'border-[#720101]/15 bg-[#fff7e8] text-[#720101]'
                                                    : 'border-slate-200 bg-white text-slate-500 hover:border-[#720101]/20 hover:text-[#720101]'}`}
                                        >
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                        <div key={currentStep} className="animate-fadeIn">
                            {renderStep()}
                        </div>
                    </section>
                </main>
                {currentStep > 0 && (
                    <BlueprintPanel
                        bookingData={bookingData}
                        collapsed={summaryCollapsed}
                        onToggle={() => setSummaryCollapsed(prev => !prev)}
                    />
                )}
            </div>
        </div>
    );
};

export default AssistedBookingWizard;
