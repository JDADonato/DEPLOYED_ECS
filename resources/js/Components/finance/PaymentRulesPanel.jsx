import React, { useEffect, useState } from 'react';
import csrfFetch from '../../utils/csrf';
import StaffSkeleton from '../staff/StaffSkeleton';
import { Percent, Clock, Briefcase, Truck, Building, Receipt, FileText, Settings, ShieldAlert, Zap, Users } from 'lucide-react';

const defaultRules = {
    reservation_fee_percentage: 10,
    downpayment_percentage: 70,
    final_payment_percentage: 20,
    reservation_validity_hours: 24,
    downpayment_due_days: 30,
    final_payment_due_days: 14,
    location_surcharge_rate: 0.20,
    floor_surcharge_rate: 0.03,
    december_surcharge_rate: 0.10,
    transport_fee: 1500,
    labor_surcharge: 2000,
    service_charge_rate: 0.10,
    contingency_surcharge_rate: 0.10,
    vat_rate: 0.12,
    extra_service_hours_fee: 5000,
    minimum_pax_per_event: 50,
    maximum_pax_per_event: 1000,
};

const numberField = (value) => value === null || value === undefined ? '' : String(value);

const SurchargeInput = ({ field, label, icon: Icon, type = 'percent', rules, updateField }) => {
    const isDecimalRate = field.endsWith('_rate');
    
    let externalValue = rules[field] !== null && rules[field] !== undefined ? String(rules[field]) : '';
    if (isDecimalRate && type === 'percent' && externalValue !== '') {
        externalValue = String(Math.round(Number(externalValue) * 10000) / 100);
    }

    const [localValue, setLocalValue] = React.useState(externalValue);
    const [isFocused, setIsFocused] = React.useState(false);

    React.useEffect(() => {
        if (!isFocused) {
            setLocalValue(externalValue);
        }
    }, [externalValue, isFocused]);

    const handleChange = (event) => {
        const val = event.target.value;
        setLocalValue(val);

        if (val === '') {
            updateField(field, '');
            return;
        }
        
        let parsedForParent = val;
        if (isDecimalRate && type === 'percent') {
            parsedForParent = String(Number(val) / 100);
        }
        updateField(field, parsedForParent);
    };

    return (
        <label className="group flex flex-col gap-1.5 p-4 rounded-2xl border border-slate-200 bg-slate-50 transition-colors focus-within:border-[#720101] focus-within:bg-[#720101]/5 hover:bg-slate-100">
            <div className="flex items-center gap-2 text-slate-500 group-focus-within:text-[#720101]">
                <Icon size={16} />
                <span className="text-xs font-black uppercase tracking-widest">{label}</span>
            </div>
            <div className="relative mt-1">
                <input
                    type="number"
                    min="0"
                    step={type === 'percent' ? 'any' : '1'}
                    value={isFocused ? localValue : externalValue}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pl-8 text-sm font-bold shadow-sm outline-none transition-shadow focus:border-[#720101] focus:ring-4 focus:ring-[#720101]/10"
                />
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    {type === 'percent' ? '%' : '₱'}
                </span>
            </div>
        </label>
    );
};

const PaymentRulesPanel = ({ onToast, embedded = false }) => {
    const [rules, setRules] = useState(defaultRules);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingSurcharges, setSavingSurcharges] = useState(false);
    const [savingBookingRules, setSavingBookingRules] = useState(false);

    const notify = (message, type = 'success') => {
        if (onToast) onToast(message, type);
    };

    const loadRules = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/payment-rules', { headers: { Accept: 'application/json' } });
            if (!response.ok) throw new Error('Could not load payment rules.');
            const data = await response.json();
            setRules({ ...defaultRules, ...(data || {}) });
        } catch (error) {
            notify(error.message || 'Could not load payment rules.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRules();
    }, []);

    const updateField = (field, value) => {
        setRules((current) => ({ ...current, [field]: value }));
    };

    const saveRules = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            const payload = Object.fromEntries(Object.entries(rules).map(([key, value]) => [key, Number(value)]));
            const response = await csrfFetch('/api/admin/payment-rules', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || data.message || 'Could not save payment rules.');
            setRules({ ...defaultRules, ...(data.rules || payload) });
            notify('Payment rules updated.');
        } catch (error) {
            notify(error.message || 'Could not save payment rules.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const saveSurcharges = async (event) => {
        event.preventDefault();
        setSavingSurcharges(true);
        try {
            const payload = {
                location_surcharge_rate: Number(rules.location_surcharge_rate),
                floor_surcharge_rate: Number(rules.floor_surcharge_rate),
                december_surcharge_rate: Number(rules.december_surcharge_rate),
                transport_fee: Number(rules.transport_fee),
                labor_surcharge: Number(rules.labor_surcharge),
                service_charge_rate: Number(rules.service_charge_rate),
                contingency_surcharge_rate: Number(rules.contingency_surcharge_rate),
                vat_rate: Number(rules.vat_rate),
                extra_service_hours_fee: Number(rules.extra_service_hours_fee),
            };
            const response = await csrfFetch('/api/admin/surcharge-rules', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || data.message || 'Could not save surcharge rules.');
            setRules(current => ({ ...current, ...(data.rules || payload) }));
            notify('Surcharge rules updated.');
        } catch (error) {
            notify(error.message || 'Could not save surcharge rules.', 'error');
        } finally {
            setSavingSurcharges(false);
        }
    };

    const saveBookingRules = async (event) => {
        event.preventDefault();
        setSavingBookingRules(true);
        try {
            const payload = {
                minimum_pax_per_event: Number(rules.minimum_pax_per_event),
                maximum_pax_per_event: Number(rules.maximum_pax_per_event),
            };
            const response = await csrfFetch('/api/admin/booking-rules', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || data.message || 'Could not save booking rules.');
            setRules(current => ({ ...current, ...(data.rules || payload) }));
            notify('Booking rules updated.');
        } catch (error) {
            notify(error.message || 'Could not save booking rules.', 'error');
        } finally {
            setSavingBookingRules(false);
        }
    };

    if (loading) {
        return <StaffSkeleton rows={4} label="Loading payment rules" />;
    }

    const total = Number(rules.reservation_fee_percentage || 0) + Number(rules.downpayment_percentage || 0) + Number(rules.final_payment_percentage || 0);

    return (
        <div className="flex flex-col gap-8">
            <section className={embedded ? 'staff-settings-form-block' : 'admin-panel p-6'}>
                <div className="mb-6 border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-2 text-[#720101]">
                        <Users size={20} />
                        <p className="admin-kicker !mb-0">Booking Rules</p>
                    </div>
                    <h3 className="mt-2 text-xl font-black text-slate-950">Guest Requirements</h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">Set the minimum and maximum number of guests allowed per booking. This is enforced during the customer booking process.</p>
                </div>

                <form onSubmit={saveBookingRules} className="grid gap-5 lg:grid-cols-3">
                    <SurchargeInput rules={rules} updateField={updateField} field="minimum_pax_per_event" label="Minimum Guests" icon={Users} type="flat" />
                    <SurchargeInput rules={rules} updateField={updateField} field="maximum_pax_per_event" label="Maximum Guests" icon={Users} type="flat" />

                    <div className="flex items-end lg:col-span-3 mt-2 border-t border-slate-100 pt-5">
                        <button type="submit" disabled={savingBookingRules} className="admin-button-primary px-6 py-3 text-sm font-black flex items-center gap-2 shadow-sm">
                            {savingBookingRules ? 'Saving...' : 'Save Booking Rules'}
                        </button>
                    </div>
                </form>
            </section>
            <section className={embedded ? 'staff-settings-form-block' : 'admin-panel p-6'}>
                <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-5">
                    <div>
                        <div className="flex items-center gap-2 text-[#720101]">
                            <Receipt size={20} />
                            <p className="admin-kicker !mb-0">Tranches & Terms</p>
                        </div>
                        <h3 className="mt-2 text-xl font-black text-slate-950">Payment Schedule</h3>
                        <p className="mt-1 text-sm font-semibold text-slate-500">Control booking payment tranche percentages and due-date windows.</p>
                    </div>
                    <span className={`rounded-full px-4 py-1.5 text-sm font-black shadow-sm ${Math.round(total * 100) / 100 === 100 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                        Total {total.toFixed(2)}%
                    </span>
                </div>

                <form onSubmit={saveRules} className="grid gap-5 lg:grid-cols-3">
                    <SurchargeInput rules={rules} updateField={updateField} field="reservation_fee_percentage" label="Reservation Fee %" icon={Percent} />
                    <SurchargeInput rules={rules} updateField={updateField} field="downpayment_percentage" label="Down Payment %" icon={Percent} />
                    <SurchargeInput rules={rules} updateField={updateField} field="final_payment_percentage" label="Final Payment %" icon={Percent} />
                    <SurchargeInput rules={rules} updateField={updateField} field="reservation_validity_hours" label="Reservation Validity (Hours)" icon={Clock} type="flat" />
                    <SurchargeInput rules={rules} updateField={updateField} field="downpayment_due_days" label="Down Payment Due (Days)" icon={Clock} type="flat" />
                    <SurchargeInput rules={rules} updateField={updateField} field="final_payment_due_days" label="Final Payment Due (Days)" icon={Clock} type="flat" />
                    
                    <div className="flex items-end lg:col-span-3 mt-2 border-t border-slate-100 pt-5">
                        <button type="submit" disabled={saving} className="admin-button-primary px-6 py-3 text-sm font-black flex items-center gap-2 shadow-sm">
                            {saving ? 'Saving...' : 'Save Payment Schedule'}
                        </button>
                    </div>
                </form>
            </section>

            <section className={embedded ? 'staff-settings-form-block' : 'admin-panel p-6'}>
                <div className="mb-6 border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-2 text-[#720101]">
                        <Settings size={20} />
                        <p className="admin-kicker !mb-0">Global Adjustments</p>
                    </div>
                    <h3 className="mt-2 text-xl font-black text-slate-950">Additional Fees & Surcharges</h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">Configure global rates for extra services, statutory fees, and logistical surcharges.</p>
                </div>

                <form onSubmit={saveSurcharges} className="space-y-8">
                    <div>
                        <h4 className="mb-4 text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                            <FileText size={16} className="text-slate-400" />
                            Statutory & Core Fees
                        </h4>
                        <div className="grid gap-5 lg:grid-cols-3">
                            <SurchargeInput rules={rules} updateField={updateField} field="service_charge_rate" label="Service Charge Rate" icon={Briefcase} type="percent" />
                            <SurchargeInput rules={rules} updateField={updateField} field="vat_rate" label="Value Added Tax (VAT)" icon={Percent} type="percent" />
                            <SurchargeInput rules={rules} updateField={updateField} field="contingency_surcharge_rate" label="Contingency Rate" icon={ShieldAlert} type="percent" />
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                            <Clock size={16} className="text-slate-400" />
                            Service Extrapolations
                        </h4>
                        <div className="grid gap-5 lg:grid-cols-3">
                            <SurchargeInput rules={rules} updateField={updateField} field="extra_service_hours_fee" label="Extra Service Hours" icon={Zap} type="flat" />
                            <SurchargeInput rules={rules} updateField={updateField} field="december_surcharge_rate" label="December Peak Surcharge" icon={Percent} type="percent" />
                            <SurchargeInput rules={rules} updateField={updateField} field="labor_surcharge" label="Default Labor Surcharge" icon={Briefcase} type="flat" />
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                            <Truck size={16} className="text-slate-400" />
                            Logistics & Mobility
                        </h4>
                        <div className="grid gap-5 lg:grid-cols-3">
                            <SurchargeInput rules={rules} updateField={updateField} field="location_surcharge_rate" label="Out-of-Town Surcharge" icon={Truck} type="percent" />
                            <SurchargeInput rules={rules} updateField={updateField} field="floor_surcharge_rate" label="High-Rise Floor Surcharge" icon={Building} type="percent" />
                            <SurchargeInput rules={rules} updateField={updateField} field="transport_fee" label="Default Transport Fee" icon={Truck} type="flat" />
                        </div>
                    </div>

                    <div className="flex items-end mt-2 border-t border-slate-100 pt-5">
                        <button type="submit" disabled={savingSurcharges} className="admin-button-primary px-6 py-3 text-sm font-black flex items-center gap-2 shadow-sm">
                            {savingSurcharges ? 'Saving...' : 'Save All Fees & Surcharges'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default PaymentRulesPanel;
