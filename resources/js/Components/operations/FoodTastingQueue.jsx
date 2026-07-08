import React, { useEffect, useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Edit3, RefreshCw, Search } from 'lucide-react';
import useLiveResource from '../../hooks/useLiveResource';
import csrfFetch from '../../utils/csrf';
import { operationalChannelsForUser } from '../../utils/liveChannels';
import { LiveSyncIndicator, SoftRefreshBoundary, UpdatedRowPulse } from '../common/LiveFeedback';
import StaffEmptyState from '../staff/StaffEmptyState';
import StaffPagination from '../staff/StaffPagination';
import StaffSkeleton from '../staff/StaffSkeleton';
import { TASTING_TIME_OPTIONS, isFoodTastingDay, minFoodTastingDate } from '../../utils/foodTastingSchedule';

const STATUS_OPTIONS = ['Pending', 'Approved', 'Completed', 'Cancelled'];
const STATUS_FILTER_OPTIONS = [
    { value: 'all', label: 'All tasting work', statuses: [] },
    { value: 'active', label: 'Active (Pending/Approved)', statuses: ['Pending', 'Approved'] },
    { value: 'completed', label: 'Completed', statuses: ['Completed'] },
    { value: 'cancelled', label: 'Cancelled', statuses: ['Cancelled'] },
];

const formatDate = (value) => {
    if (!value) return 'Date pending';
    return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const standardWindowWarning = (date, time) => {
    if (!date && !time) return '';
    const warnings = [];
    if (date) {
        if (date < minFoodTastingDate()) warnings.push('less than 3 days lead time');
        if (!isFoodTastingDay(date)) warnings.push('outside Friday to Sunday');
    }
    if (time && !TASTING_TIME_OPTIONS.some((option) => option.value === time)) {
        warnings.push('outside 11:00 AM to 3:00 PM slots');
    }
    return warnings.length ? `Outside standard customer-facing window: ${warnings.join(', ')}.` : '';
};

const StaffScheduleModal = ({ row, saving, onClose, onSave }) => {
    const [form, setForm] = useState(() => ({
        status: row?.status || 'Pending',
        preferred_date: row?.preferred_date || '',
        preferred_time: row?.preferred_time || '',
        notes: row?.notes || '',
        outcome_notes: row?.outcome_notes || '',
    }));

    useEffect(() => {
        setForm({
            status: row?.status || 'Pending',
            preferred_date: row?.preferred_date || '',
            preferred_time: row?.preferred_time || '',
            notes: row?.notes || '',
            outcome_notes: row?.outcome_notes || '',
        });
    }, [row?.id]);

    if (!row) return null;

    const warning = standardWindowWarning(form.preferred_date, form.preferred_time);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="border-b border-slate-100 bg-[#fffaf3] px-6 py-5">
                    <p className="marketing-kicker">Food tasting schedule</p>
                    <h3 className="mt-1 text-xl font-black text-slate-950">Edit tasting request</h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{row.client_name || 'Guest'} / {row.client_email || 'No email'}</p>
                </div>
                <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
                    <label>
                        <span className="booking-field-label">Status</span>
                        <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className="staff-control w-full">
                            {STATUS_OPTIONS.filter((status) => status !== 'All').map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                    </label>
                    <label>
                        <span className="booking-field-label">Preferred date</span>
                        <input type="date" value={form.preferred_date || ''} onChange={(event) => setForm((current) => ({ ...current, preferred_date: event.target.value }))} className="staff-control w-full" />
                    </label>
                    <label>
                        <span className="booking-field-label">Preferred time</span>
                        <select value={form.preferred_time || ''} onChange={(event) => setForm((current) => ({ ...current, preferred_time: event.target.value }))} className="staff-control w-full">
                            <option value="">Time pending</option>
                            {TASTING_TIME_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                    </label>
                    <div className="self-end">
                        {warning ? (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold leading-5 text-amber-800">
                                {warning} Staff can still save this as an operational exception.
                            </div>
                        ) : (
                            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold leading-5 text-emerald-700">
                                This schedule fits the standard customer-facing tasting window.
                            </div>
                        )}
                    </div>
                    <label className="sm:col-span-2">
                        <span className="booking-field-label">Customer notes</span>
                        <textarea rows="3" value={form.notes || ''} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} className="booking-note-field !mt-2" />
                    </label>
                    <label className="sm:col-span-2">
                        <span className="booking-field-label">Outcome notes</span>
                        <textarea rows="3" value={form.outcome_notes || ''} onChange={(event) => setForm((current) => ({ ...current, outcome_notes: event.target.value }))} className="booking-note-field !mt-2" />
                    </label>
                </div>
                <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end">
                    <button type="button" onClick={onClose} disabled={saving} className="staff-row-action">
                        Cancel
                    </button>
                    <button type="button" onClick={() => onSave(row, form)} disabled={saving} className="staff-row-action staff-row-action-primary">
                        {saving ? 'Saving...' : 'Save schedule'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const FoodTastingQueue = ({ onToast, surfaceMode = 'default' }) => {
    const { auth } = usePage().props;
    const isAdminSurface = surfaceMode === 'admin-full';
    const [rows, setRows] = useState([]);
    const [savingId, setSavingId] = useState(null);
    const [editingRow, setEditingRow] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        ownership: 'all',
        statusGroup: 'all',
        dateWindow: 'all',
        sort: 'date-asc',
    });
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const query = useMemo(() => {
        const params = new URLSearchParams({ paginated: '1', per_page: '100' });
        return params.toString();
    }, []);
    const liveChannels = useMemo(() => operationalChannelsForUser(auth?.user), [auth?.user?.id, auth?.user?.role]);
    const tastingResource = useLiveResource(`/api/marketing/food-tastings${query ? `?${query}` : ''}`, {
        cacheKey: 'food-tastings',
        channels: liveChannels,
        resources: ['food_tastings'],
        interval: 45000,
        select: (payload) => Array.isArray(payload) ? payload : (payload?.data || []),
    });

    const notify = (message, type = 'success') => {
        if (onToast) onToast(message, type);
    };

    const loadRows = async ({ silent = false } = {}) => {
        const data = await tastingResource.refetch({ silent, force: true, reason: 'manual' });
        if (Array.isArray(data)) setRows(data);
    };

    useEffect(() => {
        if (Array.isArray(tastingResource.data)) setRows(tastingResource.data);
    }, [tastingResource.data]);

    const visibleRows = useMemo(() => {
        const queryText = filters.search.trim().toLowerCase();
        const selectedStatusGroup = STATUS_FILTER_OPTIONS.find((option) => option.value === filters.statusGroup);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filteredRows = rows.filter((row) => {
            const rowStatus = row.status || 'Pending';
            const preferredDate = row.preferred_date ? new Date(row.preferred_date) : null;
            const matchesSearch = !queryText || [
                row.client_name,
                row.client_email,
                row.client_phone,
                row.preferred_date,
                row.preferred_time,
                row.status,
                row.notes,
                row.outcome_notes,
            ].some((value) => String(value || '').toLowerCase().includes(queryText));
            const matchesStatus = !selectedStatusGroup?.statuses?.length || selectedStatusGroup.statuses.includes(rowStatus);
            const ownedByMe = Number(row.owner_id ?? row.handled_by) === Number(auth?.user?.id);
            const matchesOwnership = filters.ownership === 'all'
                || (filters.ownership === 'unclaimed' && !row.handled_by)
                || (filters.ownership === 'claimed' && row.handled_by)
                || (filters.ownership === 'mine' && ownedByMe);
            const matchesDate = filters.dateWindow === 'all'
                || (filters.dateWindow === 'upcoming' && preferredDate && preferredDate >= today)
                || (filters.dateWindow === 'past' && preferredDate && preferredDate < today)
                || (filters.dateWindow === 'unscheduled' && !preferredDate);

            return matchesSearch && matchesStatus && matchesOwnership && matchesDate;
        });

        return [...filteredRows].sort((a, b) => {
            const aDate = a.preferred_date ? new Date(a.preferred_date).getTime() : Number.MAX_SAFE_INTEGER;
            const bDate = b.preferred_date ? new Date(b.preferred_date).getTime() : Number.MAX_SAFE_INTEGER;

            if (filters.sort === 'date-desc') return bDate - aDate;
            if (filters.sort === 'recent') return Number(b.id || 0) - Number(a.id || 0);
            if (filters.sort === 'name') return String(a.client_name || '').localeCompare(String(b.client_name || ''));
            return aDate - bDate;
        });
    }, [filters, rows]);

    useEffect(() => {
        setPage(1);
    }, [filters, perPage]);

    const pageCount = Math.max(1, Math.ceil(visibleRows.length / perPage));
    const safePage = Math.min(page, pageCount);
    const paginatedRows = useMemo(() => {
        const start = (safePage - 1) * perPage;
        return visibleRows.slice(start, start + perPage);
    }, [perPage, safePage, visibleRows]);

    const updateStatus = async (row, status) => {
        setSavingId(row.id);
        try {
            const response = await csrfFetch(`/api/marketing/food-tastings/${row.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    preferred_date: row.preferred_date,
                    preferred_time: row.preferred_time,
                    notes: row.notes || '',
                    outcome_notes: row.outcome_notes || '',
                }),
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(payload.message || payload.error || 'Could not update tasting.');
            notify('Food tasting updated.');
            tastingResource.markChanged(row.id);
            loadRows({ silent: true });
        } catch (error) {
            notify(error.message || 'Could not update tasting.', 'error');
        } finally {
            setSavingId(null);
        }
    };

    const saveSchedule = async (row, form) => {
        setSavingId(row.id);
        try {
            const response = await csrfFetch(`/api/marketing/food-tastings/${row.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(payload.message || payload.error || 'Could not update tasting.');
            notify('Food tasting schedule updated.');
            setRows((current) => current.map((item) => item.id === row.id ? (payload.tasting || item) : item));
            setEditingRow(null);
            tastingResource.markChanged(row.id);
            loadRows({ silent: true });
        } catch (error) {
            notify(error.message || 'Could not update tasting.', 'error');
        } finally {
            setSavingId(null);
        }
    };

    const postTastingAction = async (row, action, successMessage) => {
        setSavingId(row.id);
        try {
            const response = await csrfFetch(`/api/marketing/food-tastings/${row.id}/${action}`, { method: 'POST' });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(payload.message || payload.error || 'Could not update tasting.');
            notify(payload.message || successMessage);
            setRows((current) => current.map((item) => item.id === row.id ? (payload.tasting || item) : item));
            tastingResource.markChanged(row.id);
            loadRows({ silent: true });
        } catch (error) {
            notify(error.message || 'Could not update tasting.', 'error');
        } finally {
            setSavingId(null);
        }
    };

    return (
        <section className={isAdminSurface ? 'admin-embedded-surface' : 'staff-work-surface'}>
            {!isAdminSurface && (
                <div className="staff-surface-head">
                    <div>
                        <p className="marketing-kicker">Customer experience</p>
                        <h3 className="mt-1 text-lg font-black text-slate-950">Food tasting queue</h3>
                        <p className="mt-1 text-sm font-semibold text-slate-500">Review tasting requests, confirm schedules, and close completed tasting outcomes.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <LiveSyncIndicator
                            state={tastingResource.syncState}
                            refreshing={tastingResource.refreshing}
                            lastSyncedAt={tastingResource.lastSyncedAt}
                            error={tastingResource.error}
                            onRetry={tastingResource.refetch}
                            compact
                            visibility={isAdminSurface ? 'exceptions' : 'always'}
                        />
                        <button
                            type="button"
                            onClick={() => loadRows()}
                            className="staff-row-action admin-refresh-action"
                            aria-label="Refresh food tastings"
                            title="Refresh food tastings"
                        >
                            <RefreshCw className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            )}

            <div className={isAdminSurface ? 'admin-command-strip food-tasting-command-strip' : 'food-tasting-command-strip border-b border-slate-100 p-4'}>
                <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <input
                        value={filters.search}
                        onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                        placeholder="Search client, email, phone, notes, date, or status"
                        className="staff-control w-full pl-12"
                    />
                </div>
                <select value={filters.statusGroup} onChange={(event) => setFilters((current) => ({ ...current, statusGroup: event.target.value }))} className="staff-control">
                    {STATUS_FILTER_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <select value={filters.ownership} onChange={(event) => setFilters((current) => ({ ...current, ownership: event.target.value }))} className="staff-control">
                    <option value="all">All ownership</option>
                    <option value="unclaimed">Unclaimed</option>
                    <option value="claimed">Claimed</option>
                    <option value="mine">Assigned to me</option>
                </select>
                <select value={filters.dateWindow} onChange={(event) => setFilters((current) => ({ ...current, dateWindow: event.target.value }))} className="staff-control">
                    <option value="all">All dates</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past dates</option>
                    <option value="unscheduled">Date pending</option>
                </select>
                <select value={filters.sort} onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))} className="staff-control">
                    <option value="date-asc">Soonest first</option>
                    <option value="date-desc">Latest date first</option>
                    <option value="recent">Newest request</option>
                    <option value="name">Client A-Z</option>
                </select>
                {isAdminSurface && (
                    <div className="flex items-center justify-end gap-2">
                        <span className="inline-flex h-10 items-center rounded-xl border border-[#720101]/10 bg-[#fbf8f2] px-3 text-xs font-black uppercase tracking-wider text-[#720101]">
                            {visibleRows.length} shown
                        </span>
                        <LiveSyncIndicator
                            state={tastingResource.syncState}
                            refreshing={tastingResource.refreshing}
                            lastSyncedAt={tastingResource.lastSyncedAt}
                            error={tastingResource.error}
                            onRetry={tastingResource.refetch}
                            compact
                            visibility="exceptions"
                        />
                        <button
                            type="button"
                            onClick={() => loadRows()}
                            className="admin-icon-action admin-refresh-action"
                            aria-label="Refresh food tastings"
                            title="Refresh food tastings"
                        >
                            <RefreshCw className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                )}
            </div>

            {tastingResource.loading && rows.length === 0 ? (
                <StaffSkeleton rows={5} label="Loading food tastings" />
            ) : visibleRows.length === 0 ? (
                <StaffEmptyState title={rows.length === 0 ? 'No food tastings found' : 'No food tastings match these filters'} message={rows.length === 0 ? 'New tasting requests from public and customer forms will appear here.' : 'Try a broader search, status group, or date filter.'} />
            ) : (
                <SoftRefreshBoundary
                    loading={tastingResource.loading}
                    refreshing={tastingResource.refreshing}
                    hasData={visibleRows.length > 0}
                    className={isAdminSurface ? 'admin-surface-grid admin-responsive-table' : 'overflow-x-auto'}
                >
                    <table className="staff-table">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Preferred Slot</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Details</th>
                                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRows.map((row) => (
                                <UpdatedRowPulse key={row.id} as="tr" watchKey={`${row.id}:${row.status}:${row.preferred_date}:${row.preferred_time}`} active={tastingResource.changedKeys.has(row.id)}>
                                    <td className="px-6 py-4">
                                        <div className="font-black text-slate-950">{row.client_name || 'Guest'}</div>
                                        <div className="text-xs font-bold text-slate-500">{row.client_email || 'No email'} / {row.client_phone || 'No phone'}</div>
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${!row.handled_by ? 'bg-amber-50 text-amber-700' : Number(row.handled_by) === Number(auth?.user?.id) ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {!row.handled_by ? 'Unclaimed' : Number(row.handled_by) === Number(auth?.user?.id) ? 'Assigned to me' : `Owned by ${row.owner_name || 'staff'}`}
                                            </span>
                                            {row.transfer_requested_to && (
                                                <span className="inline-flex rounded-full bg-[#fff7e8] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#9f6500]">
                                                    Transfer pending
                                                </span>
                                            )}
                                        </div>
                                        {row.duplicate_customer && (
                                            <div className="mt-1 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-amber-700">
                                                {row.duplicate_customer.is_deactivated ? 'Matches deactivated customer' : 'Matches customer'}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-700">{formatDate(row.preferred_date)} / {row.preferred_time || 'Time pending'}</td>
                                    <td className="max-w-md px-6 py-4">
                                        <div className="text-sm font-semibold text-slate-600 mb-2">{row.outcome_notes || row.notes || 'No notes yet.'}</div>
                                        {row.requested_dishes && row.requested_dishes.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {row.requested_dishes.map((dish, i) => (
                                                    <span key={i} className="inline-flex items-center px-2 py-1 rounded bg-[#720101]/5 text-[#720101] text-[10px] font-bold border border-[#720101]/10">
                                                        {dish.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="mb-1">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wide
                                                    ${row.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                                                      row.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                                                      row.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                                                      'bg-amber-100 text-amber-800'}`}>
                                                    {row.status || 'Pending'}
                                                </span>
                                            </div>
                                            
                                            <div className="flex flex-wrap justify-end gap-1.5 mb-2">
                                                {(row.status === 'Pending' || !row.status) && (
                                                    <>
                                                        <button disabled={savingId === row.id} onClick={() => updateStatus(row, 'Approved')} className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors border border-blue-200">Approve</button>
                                                        <button disabled={savingId === row.id} onClick={() => updateStatus(row, 'Cancelled')} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors border border-rose-200">Cancel</button>
                                                    </>
                                                )}
                                                {row.status === 'Approved' && (
                                                    <>
                                                        <button disabled={savingId === row.id} onClick={() => updateStatus(row, 'Completed')} className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors border border-emerald-200">Mark Completed</button>
                                                        <button disabled={savingId === row.id} onClick={() => updateStatus(row, 'Cancelled')} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors border border-rose-200">Cancel</button>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap justify-end gap-2">
                                                {row.can_claim && (
                                                    <button type="button" disabled={savingId === row.id} onClick={() => postTastingAction(row, 'claim', 'Food tasting claimed.')} className="staff-row-action">
                                                        Claim
                                                    </button>
                                                )}
                                                {row.can_edit && (
                                                    <button type="button" disabled={savingId === row.id} onClick={() => setEditingRow(row)} className="staff-row-action">
                                                        <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                                                        Edit schedule
                                                    </button>
                                                )}
                                                {row.can_edit && row.handled_by && (
                                                    <button type="button" disabled={savingId === row.id} onClick={() => postTastingAction(row, 'release', 'Food tasting released.')} className="staff-row-action">
                                                        Release
                                                    </button>
                                                )}
                                                {row.can_request_transfer && (
                                                    <button type="button" disabled={savingId === row.id} onClick={() => postTastingAction(row, 'transfer/request', 'Transfer requested.')} className="staff-row-action">
                                                        Request transfer
                                                    </button>
                                                )}
                                                {row.can_accept_transfer && (
                                                    <>
                                                        <button type="button" disabled={savingId === row.id} onClick={() => postTastingAction(row, 'transfer/accept', 'Transfer accepted.')} className="staff-row-action">
                                                            Accept
                                                        </button>
                                                        <button type="button" disabled={savingId === row.id} onClick={() => postTastingAction(row, 'transfer/decline', 'Transfer declined.')} className="staff-row-action">
                                                            Decline
                                                        </button>
                                                    </>
                                                )}
                                                {row.transfer_requested_by && Number(row.transfer_requested_by) === Number(auth?.user?.id) && (
                                                    <button type="button" disabled={savingId === row.id} onClick={() => postTastingAction(row, 'transfer/cancel', 'Transfer cancelled.')} className="staff-row-action">
                                                        Cancel request
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </UpdatedRowPulse>
                            ))}
                        </tbody>
                    </table>
                </SoftRefreshBoundary>
            )}

            {visibleRows.length > 0 && (
                <StaffPagination
                    page={safePage}
                    perPage={perPage}
                    total={visibleRows.length}
                    onPageChange={setPage}
                    onPerPageChange={setPerPage}
                    perPageOptions={[10, 25, 50]}
                />
            )}
            <StaffScheduleModal
                row={editingRow}
                saving={Boolean(editingRow && savingId === editingRow.id)}
                onClose={() => setEditingRow(null)}
                onSave={saveSchedule}
            />
        </section>
    );
};

export default FoodTastingQueue;
