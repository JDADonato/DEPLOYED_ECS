import React, { useEffect, useState } from 'react';
import csrfFetch from '../../utils/csrf';
import StaffSkeleton from '../staff/StaffSkeleton';
import { Percent, Clock, Briefcase, Truck, Building, Receipt, FileText, Settings, ShieldAlert, Zap } from 'lucide-react';

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
};

const numberField = (value) => value === null || value === undefined ? '' : String(value);

const SurchargeInput = ({ field, label, icon: Icon, type = 'percent', rules, updateField }) => {
    const isDecimalRate = field.endsWith('_rate');
    
    let displayValue = rules[field] !== null && rules[field] !== undefined ? String(rules[field]) : '';
    if (isDecimalRate && type === 'percent' && displayValue !== '') {
        displayValue = String(Math.round(Number(displayValue) * 10000) / 100);
    }

    const handleChange = (event) => {
        let val = event.target.value;
        if (val === '') {
            updateField(field, '');
            return;
        }
        if (isDecimalRate && type === 'percent') {
            val = String(Number(val) / 100);
        }
        updateField(field, val);
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
                    value={displayValue}
                    onChange={handleChange}
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

    return (
        <div className="flex flex-col gap-8">
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
