import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

    const [activeTab, setActiveTab] = useState('reply');

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
                                <tr key={lead.id} className="hover:bg-[#fffaf3] transition-colors cursor-pointer" onClick={() => setSelectedLead(lead)}>
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
                                        <button type="button" className="rounded-lg bg-[#720101] hover:bg-[#a30000] transition-colors px-4 py-2 text-xs font-black text-white shadow-sm">Review</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <StaffPagination page={leadData.meta.current_page} perPage={leadData.meta.per_page} total={leadData.meta.total} onPageChange={(page) => updateFilter('page', page)} onPerPageChange={(perPage) => updateFilter('per_page', perPage)} />
            </div>

            {selectedLead && createPortal(
                <div className="fixed inset-0 z-[9999] flex justify-end bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedLead(null)}>
                     <aside className="animate-in slide-in-from-right duration-300 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
                         
                         {/* Header */}
                         <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-slate-100 bg-white/80 p-6 backdrop-blur-md pt-8">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#720101] to-[#a30000] text-xl font-black text-white shadow-lg ring-4 ring-rose-50">
                                    {selectedLead.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight text-slate-950">{selectedLead.full_name}</h3>
                                    <p className="text-xs font-bold tracking-wide text-slate-500">{selectedLead.email}{selectedLead.phone ? ` • ${selectedLead.phone}` : ''}</p>
                                </div>
                            </div>
                            <button type="button" onClick={() => setSelectedLead(null)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </header>
                        
                        {/* Action Bar */}
                        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/80 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <select value={selectedLead.status || 'New'} disabled={leadSaving} onChange={(event) => updateLead(selectedLead.id, { status: event.target.value })} className="rounded-xl border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm focus:border-[#720101] focus:ring-[#720101]">
                                    {['New', 'Contacted', 'In Review', 'Follow Up', 'Resolved', 'Closed', 'Archived', 'Spam'].map(status => <option key={status}>{status}</option>)}
                                </select>
                            </div>
                            <button type="button" disabled={leadSaving || selectedLead.assigned_to === user?.id} onClick={() => updateLead(selectedLead.id, { assigned_to: user?.id, status: selectedLead.status === 'New' ? 'In Review' : selectedLead.status })} className={`relative overflow-hidden rounded-xl px-5 py-2.5 text-sm font-black text-white shadow-md transition-all ${selectedLead.assigned_to === user?.id ? 'bg-slate-100 text-emerald-700 shadow-none ring-1 ring-emerald-200/50' : 'bg-gradient-to-r from-slate-800 to-slate-900 hover:scale-[1.02] active:scale-95'} disabled:pointer-events-none disabled:opacity-60`}>
                                {selectedLead.assigned_to === user?.id ? (
                                    <span className="flex items-center gap-2"><svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> Assigned to you</span>
                                ) : 'Assign to me'}
                            </button>
                        </div>

                        {/* Conversation History */}
                        <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto bg-slate-50/50 p-6">
                            
                            {/* Customer Initial Inquiry */}
                            <div className="flex w-full justify-start">
                                <div className="max-w-[85%]">
                                    <div className="flex items-center gap-2 mb-1.5 ml-1">
                                        <span className="text-xs font-black text-slate-700">{selectedLead.full_name}</span>
                                        <span className="text-[10px] font-bold text-slate-400">{selectedLead.created_at ? new Date(selectedLead.created_at).toLocaleString() : ''}</span>
                                    </div>
                                    <div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white p-5 shadow-sm relative">
                                        <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-[#720101]">{concernLabels[selectedLead.concern_type] || 'General'} • {selectedLead.event_type || 'No event type'}</p>
                                        <h4 className="mb-2 text-sm font-black text-slate-900">{selectedLead.subject}</h4>
                                        <p className="whitespace-pre-line text-sm font-semibold leading-relaxed text-slate-600">{selectedLead.message}</p>
                                        <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 border border-slate-100 text-xs font-bold text-slate-500">
                                            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            {selectedLead.event_date ? formatDate(selectedLead.event_date) : 'No specific date'}
                                            {selectedLead.pax && <><span className="mx-1 text-slate-300">•</span>{selectedLead.pax} guests</>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Staff Replies */}
                            {selectedLead.replies?.map(reply => (
                                <div key={reply.id} className="flex w-full justify-end">
                                    <div className="max-w-[85%]">
                                        <div className="flex items-center justify-end gap-2 mb-1.5 mr-1">
                                            <span className="text-[10px] font-bold text-slate-400">{new Date(reply.created_at).toLocaleString()}</span>
                                            <span className="text-xs font-black text-slate-700">{reply.user?.full_name || 'Staff'}</span>
                                        </div>
                                        <div className="rounded-2xl rounded-tr-sm bg-gradient-to-br from-[#720101] to-[#a30000] p-4 text-white shadow-md">
                                            <p className="whitespace-pre-line text-sm font-semibold leading-relaxed text-white/95">{reply.message}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Reply Area */}
                        <div className="shrink-0 border-t border-slate-200 bg-white p-6 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-20">
                            {/* Minimalist Tabs */}
                            <div className="mb-4 flex items-center gap-6 border-b border-slate-100 px-1">
                                <button type="button" onClick={() => setActiveTab('reply')} className={`pb-3 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'reply' ? 'border-b-2 border-[#720101] text-[#720101]' : 'text-slate-400 hover:text-slate-600'}`}>Email Reply</button>
                                <button type="button" onClick={() => setActiveTab('notes')} className={`pb-3 text-xs font-black uppercase tracking-widest transition-colors relative ${activeTab === 'notes' ? 'border-b-2 border-[#720101] text-[#720101]' : 'text-slate-400 hover:text-slate-600'}`}>
                                    Internal Notes
                                    {selectedLead.staff_notes && <span className="absolute -right-3 -top-1 h-2 w-2 rounded-full bg-amber-500"></span>}
                                </button>
                            </div>

                            {activeTab === 'reply' ? (
                                <form onSubmit={sendReply}>
                                    <div className="relative rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-[#720101] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#720101] transition-all shadow-sm">
                                        <textarea
                                            rows={3}
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder={`Reply to ${selectedLead.full_name} via email...`}
                                            className="w-full resize-none border-0 bg-transparent px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:ring-0"
                                            disabled={replying}
                                            required
                                        />
                                        <div className="flex items-center justify-between border-t border-slate-100 bg-white px-3 py-2 rounded-b-2xl">
                                            <span className="text-[10px] font-bold text-slate-400 pl-2">Reply will be sent to {selectedLead.email}</span>
                                            <button type="submit" disabled={replying || !replyText.trim()} className="rounded-xl bg-[#720101] px-5 py-2 text-xs font-black text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50">
                                                {replying ? 'Sending...' : 'Send Email'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div className="relative rounded-2xl border border-amber-200 bg-amber-50/50 focus-within:border-amber-400 focus-within:bg-amber-50 focus-within:ring-1 focus-within:ring-amber-400 transition-all shadow-sm">
                                    <textarea
                                        rows={3}
                                        value={selectedLead.staff_notes || ''}
                                        onChange={(event) => setSelectedLead((current) => ({ ...current, staff_notes: event.target.value }))}
                                        placeholder="Add private staff notes here..."
                                        className="w-full resize-none border-0 bg-transparent px-4 py-3 text-sm font-semibold text-amber-900 placeholder:text-amber-500/60 focus:ring-0"
                                    />
                                    <div className="flex items-center justify-between border-t border-amber-200/50 bg-amber-100/30 px-3 py-2 rounded-b-2xl">
                                        <span className="text-[10px] font-bold text-amber-600 pl-2">Notes are invisible to guests</span>
                                        <div className="flex gap-2">
                                            {selectedLead.status !== 'Resolved' && (
                                                <button type="button" disabled={leadSaving} onClick={() => updateLead(selectedLead.id, { status: 'Resolved', staff_notes: selectedLead.staff_notes || '' })} className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-black text-white hover:bg-slate-900 transition-colors disabled:opacity-50 shadow-sm">Mark Resolved</button>
                                            )}
                                            <button type="button" disabled={leadSaving} onClick={() => updateLead(selectedLead.id, { staff_notes: selectedLead.staff_notes || '' })} className="rounded-xl bg-amber-600 px-5 py-2 text-xs font-black text-white hover:bg-amber-700 transition-colors disabled:opacity-50 shadow-sm">
                                                Save Notes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            , document.body)}
        </div>
    );
}
