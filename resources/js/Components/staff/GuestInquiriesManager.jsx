import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { formatDate } from '../../utils/dashboardUtils';
import useSmartResource from '../../hooks/useSmartResource';
import useSmartRefresh from '../../hooks/useSmartRefresh';
import StaffStatusBadge from './StaffStatusBadge';
import StaffEmptyState from './StaffEmptyState';
import StaffSkeleton from './StaffSkeleton';
import StaffPagination from './StaffPagination';
import csrfFetch from '../../utils/csrf';
import { usePage } from '@inertiajs/react';

const concernLabels = {
    general: 'General inquiry',
    planning: 'Event planning',
    availability: 'Check dates',
    menu: 'Menu questions',
    pricing: 'Pricing & quotes',
    tasting: 'Food tasting',
    active_booking: 'Existing booking',
};

export default function GuestInquiriesManager() {
    const { auth } = usePage().props;
    const user = auth?.user || null;

    const [filters, setFilters] = useState({
        search: '',
        status: '',
        concern_type: '',
        date_from: '',
        date_to: '',
        page: 1,
        per_page: 15,
    });

    const updateFilter = (key, value) => {
        setFilters(current => ({ ...current, [key]: value, page: key === 'page' ? value : 1 }));
    };

    const { data: rawData, loading: isInitialLoading, refreshing: isRefreshing, reload } = useSmartResource('/api/marketing/contact-inquiries', {
        params: filters,
        cacheKey: 'staff:guest-inquiries',
        ttl: 15000,
    });

    useSmartRefresh({
        refresh: reload,
        interval: 60000,
        eventNames: ['.contact_inquiries.changed'],
    });

    const leadData = rawData || { data: [], meta: { current_page: 1, per_page: 15, total: 0 } };

    const [selectedLead, setSelectedLead] = useState(null);
    const [leadSaving, setLeadSaving] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [replying, setReplying] = useState(false);

    // Refresh selected lead when rawData changes
    useEffect(() => {
        if (selectedLead && rawData?.data) {
            const updatedLead = rawData.data.find(l => l.id === selectedLead.id);
            if (updatedLead) {
                setSelectedLead(current => ({ ...updatedLead, staff_notes: current.staff_notes || updatedLead.staff_notes }));
            }
        }
    }, [rawData]);

    const updateLead = async (id, payload) => {
        setLeadSaving(true);
        try {
            const response = await csrfFetch(`/api/marketing/contact-inquiries/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Could not update this inquiry.');
            setSelectedLead(result.inquiry);
            reload({ silent: true, force: true });
            toast.success('Inquiry updated.');
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Could not update this inquiry.');
        } finally {
            setLeadSaving(false);
        }
    };

    const sendReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim() || !selectedLead) return;
        
        setReplying(true);
        try {
            const response = await csrfFetch(`/api/marketing/contact-inquiries/${selectedLead.id}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: replyText.trim() }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || result.error || 'Could not send reply.');
            setSelectedLead(result.inquiry);
            setReplyText('');
            toast.success('Reply sent successfully.');
            reload({ silent: true, force: true });
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Could not send reply.');
        } finally {
            setReplying(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="marketing-panel staff-filter-bar">
                <input value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} placeholder="Search name, email, phone, subject, or message" className="staff-control" />
                <select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)} className="staff-control">
                    <option value="">All statuses</option>
                    {['New', 'Contacted', 'In Review', 'Follow Up', 'Resolved', 'Closed', 'Archived', 'Spam'].map(status => <option key={status} value={status}>{status}</option>)}
                </select>
                <select value={filters.concern_type} onChange={(event) => updateFilter('concern_type', event.target.value)} className="staff-control">
                    <option value="">All concerns</option>
                    {Object.entries(concernLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <input type="date" value={filters.date_from} onChange={(event) => updateFilter('date_from', event.target.value)} className="staff-control" />
                <input type="date" value={filters.date_to} onChange={(event) => updateFilter('date_to', event.target.value)} className="staff-control" />
            </div>

            <div className="marketing-panel overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                         <thead className="border-b border-amber-100 bg-[#fffaf3] text-xs font-black uppercase tracking-widest text-slate-500">
                             <tr>
                                <th className="px-5 py-4">Guest</th>
                                 <th className="px-5 py-4">Concern</th>
                                <th className="px-5 py-4">Event</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-amber-100/70">
                             {isInitialLoading ? (
                                <tr><td colSpan="5"><StaffSkeleton rows={5} label="Loading guest inquiries" /></td></tr>
                            ) : leadData.data.length === 0 ? (
                                <tr><td colSpan="5" className="px-5 py-10"><StaffEmptyState title="No guest inquiries found" message="Questions from the Contact page will appear here." /></td></tr>
                             ) : leadData.data.map((lead) => (
                                <tr key={lead.id} className="hover:bg-[#fffaf3]">
                                    <td className="px-5 py-4">
                                        <p className="font-black text-slate-950">{lead.full_name}</p>
                                        <p className="mt-1 text-xs font-semibold text-slate-500">{lead.email}{lead.phone ? ` / ${lead.phone}` : ''}</p>
                                        {lead.duplicate_user && <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-amber-700">{lead.duplicate_user.is_deactivated ? 'Matches deactivated customer' : 'Matches customer'}</p>}
                                        <p className="mt-1 line-clamp-1 text-xs font-semibold text-slate-400">{lead.subject}</p>
                                    </td>
                                    <td className="px-5 py-4"><StaffStatusBadge tone="muted">{concernLabels[lead.concern_type] || 'General'}</StaffStatusBadge></td>
                                    <td className="px-5 py-4 text-sm font-bold text-slate-600">
                                        <p>{lead.event_type || 'Not specified'}</p>
                                        <p className="mt-1 text-xs text-slate-400">{lead.event_date ? formatDate(lead.event_date) : 'No date'}{lead.pax ? ` / ${lead.pax} guests` : ''}</p>
                                    </td>
                                    <td className="px-5 py-4"><StaffStatusBadge tone={lead.status === 'Resolved' || lead.status === 'Closed' ? 'good' : lead.status === 'New' ? 'warn' : lead.status === 'Contacted' ? 'good' : 'muted'}>{lead.status}</StaffStatusBadge></td>
                                    <td className="px-5 py-4 text-right">
                                        <button type="button" onClick={() => setSelectedLead(lead)} className="rounded-lg bg-[#720101] px-4 py-2 text-xs font-black text-white">Review</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <StaffPagination page={leadData.meta.current_page} perPage={leadData.meta.per_page} total={leadData.meta.total} onPageChange={(page) => updateFilter('page', page)} onPerPageChange={(perPage) => updateFilter('per_page', perPage)} />
            </div>

            {selectedLead && (
                <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/35 backdrop-blur-sm" onClick={() => setSelectedLead(null)}>
                     <aside className="custom-scrollbar flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
                         <div className="flex shrink-0 items-start justify-between gap-4">
                             <div>
                                <p className="marketing-kicker">Guest inquiry</p>
                                 <h3 className="mt-2 text-2xl font-black text-slate-950">{selectedLead.full_name}</h3>
                                <p className="mt-1 text-sm font-bold text-slate-500">{selectedLead.email}{selectedLead.phone ? ` / ${selectedLead.phone}` : ''}</p>
                            </div>
                            <button type="button" onClick={() => setSelectedLead(null)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-black text-slate-500">Close</button>
                        </div>
                        
                        <div className="mt-6 shrink-0 grid gap-3 sm:grid-cols-2">
                            <select value={selectedLead.status || 'New'} disabled={leadSaving} onChange={(event) => updateLead(selectedLead.id, { status: event.target.value })} className="staff-control">
                                {['New', 'Contacted', 'In Review', 'Follow Up', 'Resolved', 'Closed', 'Archived', 'Spam'].map(status => <option key={status}>{status}</option>)}
                            </select>
                            <button type="button" disabled={leadSaving || selectedLead.assigned_to === user?.id} onClick={() => updateLead(selectedLead.id, { assigned_to: user?.id, status: selectedLead.status === 'New' ? 'In Review' : selectedLead.status })} className="rounded-lg bg-[#720101] px-4 py-3 text-sm font-black text-white disabled:opacity-60">
                                {selectedLead.assigned_to === user?.id ? 'Assigned to you' : 'Assign to me'}
                            </button>
                        </div>

                        <div className="mt-6 flex-1 space-y-6 pb-6">
                            <div className="rounded-2xl border border-amber-100 bg-[#fffaf3] p-5">
                                <p className="text-xs font-black uppercase tracking-widest text-[#9f6500]">{concernLabels[selectedLead.concern_type] || 'General'} / {selectedLead.event_type || 'No event type'}</p>
                                <h4 className="mt-2 text-lg font-black text-slate-950">{selectedLead.subject}</h4>
                                <p className="mt-3 whitespace-pre-line text-sm font-semibold leading-6 text-slate-600">{selectedLead.message}</p>
                                <p className="mt-4 text-xs font-bold text-slate-400">{selectedLead.event_date ? formatDate(selectedLead.event_date) : 'No event date'}{selectedLead.pax ? ` / ${selectedLead.pax} guests` : ''}</p>
                            </div>

                            {selectedLead.replies && selectedLead.replies.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Conversation History</h4>
                                    {selectedLead.replies.map(reply => (
                                        <div key={reply.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-black text-slate-700">{reply.user?.full_name || 'Staff'}</p>
                                                <p className="text-[10px] font-bold text-slate-400">{new Date(reply.created_at).toLocaleString()}</p>
                                            </div>
                                            <p className="mt-3 whitespace-pre-line text-sm font-semibold leading-6 text-slate-600">{reply.message}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <form onSubmit={sendReply} className="space-y-3">
                                <label className="block text-sm font-black uppercase tracking-widest text-slate-500">Reply via Email</label>
                                <textarea
                                    rows={4}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your reply here. This will be emailed directly to the guest..."
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold shadow-sm focus:border-[#720101] focus:ring-[#720101]"
                                    disabled={replying}
                                    required
                                />
                                <div className="flex justify-end">
                                    <button type="submit" disabled={replying || !replyText.trim()} className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-black text-white shadow-sm disabled:opacity-60">
                                        {replying ? 'Sending...' : 'Send Email Reply'}
                                    </button>
                                </div>
                            </form>

                            <div className="pt-6 border-t border-slate-100">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500">Internal Staff notes</label>
                                <textarea rows={4} value={selectedLead.staff_notes || ''} onChange={(event) => setSelectedLead((current) => ({ ...current, staff_notes: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold bg-slate-50" placeholder="Notes for internal team only..." />
                                <div className="mt-3 flex justify-end gap-3">
                                    <button type="button" disabled={leadSaving} onClick={() => updateLead(selectedLead.id, { staff_notes: selectedLead.staff_notes || '' })} className="rounded-lg border border-[#720101]/20 bg-white px-4 py-2 text-sm font-black text-[#720101] disabled:opacity-60">Save notes</button>
                                    {selectedLead.status !== 'Resolved' && (
                                        <button type="button" disabled={leadSaving} onClick={() => updateLead(selectedLead.id, { status: 'Resolved', staff_notes: selectedLead.staff_notes || '' })} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-black text-white disabled:opacity-60">Mark resolved</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}
