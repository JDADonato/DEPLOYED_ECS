import React, { useState, useEffect, useCallback } from 'react';
import csrfFetch from '../../utils/csrf';
import ConfirmModal from '../common/ConfirmModal';
import { RefreshCw, Undo2, Clock, User, Target, AlertTriangle } from 'lucide-react';

const ACTION_TYPE_LABELS = {
    update_booking_status: 'Status Update',
    delete_announcement: 'Deleted Announcement',
    undo_booking_status: 'Undo Status',
    undo_delete_announcement: 'Undo Deletion',
};

const ACTION_TYPE_TONES = {
    update_booking_status: 'warning',
    delete_announcement: 'danger',
    undo_booking_status: 'success',
    undo_delete_announcement: 'success',
};

const toneBadgeStyles = {
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    default: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function ActivityLogPanel({ showToast }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [undoTarget, setUndoTarget] = useState(null);
    const [undoing, setUndoing] = useState(false);

    const notify = useCallback((message, type = 'success') => {
        if (showToast) showToast(message, type);
    }, [showToast]);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/action-logs', {
                headers: { Accept: 'application/json' },
            });
            if (res.ok) {
                const data = await res.json();
                setLogs(data.data || []);
            } else {
                notify('Failed to load activity logs.', 'error');
            }
        } catch (err) {
            console.error('Failed to fetch action logs', err);
            notify('Network error loading activity logs.', 'error');
        } finally {
            setLoading(false);
        }
    }, [notify]);

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleUndo = async () => {
        if (!undoTarget) return;
        setUndoing(true);
        try {
            const res = await csrfFetch(`/api/admin/action-logs/${undoTarget.id}/undo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                notify(data.message || 'Action reversed successfully.');
                fetchLogs();
            } else {
                notify(data.error || 'Failed to undo action.', 'error');
            }
        } catch (err) {
            notify('Network error while undoing action.', 'error');
        } finally {
            setUndoTarget(null);
            setUndoing(false);
        }
    };

    const getUserDisplay = (log) => {
        if (!log.user) return 'System';
        return log.user.full_name || log.user.username || 'Unknown';
    };

    const getActionBadge = (actionType) => {
        const label = ACTION_TYPE_LABELS[actionType] || actionType.replace(/_/g, ' ');
        const tone = ACTION_TYPE_TONES[actionType] || 'default';
        const style = toneBadgeStyles[tone] || toneBadgeStyles.default;
        return { label, style };
    };

    const canUndo = (log) => ['update_booking_status', 'delete_announcement'].includes(log.action_type);

    const getChangeDetail = (log) => {
        if (log.previous_state?.status && log.new_state?.status) {
            return `${log.previous_state.status} → ${log.new_state.status}`;
        }
        return null;
    };

    return (
        <>
            <div className="admin-command-strip">
                <div className="flex items-center gap-3 flex-1">
                    <div>
                        <p className="admin-kicker !mb-0">Reversible Actions</p>
                        <h3 className="text-lg font-black text-slate-950">Activity & Undo Log</h3>
                        <p className="mt-0.5 text-sm font-semibold text-slate-500">Track and reverse recent dangerous actions like rejecting events or deleting announcements.</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={fetchLogs}
                    className="admin-icon-action admin-refresh-action"
                    aria-label="Refresh activity logs"
                    title="Refresh activity logs"
                >
                    <RefreshCw className="h-5 w-5" aria-hidden="true" />
                </button>
            </div>

            <div className="admin-surface-grid overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16 text-sm font-semibold text-slate-400">
                        <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                        Loading activity logs...
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                            <Clock className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">No actions logged yet</p>
                        <p className="mt-1 text-xs font-semibold text-slate-400">Status changes and deletions will appear here for review.</p>
                    </div>
                ) : (
                    <table className="staff-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Actor</th>
                                <th>Action</th>
                                <th>Details</th>
                                <th>Target</th>
                                <th>Changes</th>
                                <th className="text-right">Undo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => {
                                const badge = getActionBadge(log.action_type);
                                const changeDetail = getChangeDetail(log);
                                return (
                                    <tr key={log.id}>
                                        <td className="admin-audit-time">
                                            {new Date(log.created_at).toLocaleString('en-PH', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}
                                        </td>
                                        <td>
                                            <div className="admin-audit-primary">{getUserDisplay(log)}</div>
                                            <div className="admin-audit-secondary">{log.user?.role || 'System'}</div>
                                        </td>
                                        <td>
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-black ${badge.style}`}>
                                                {badge.label}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-audit-primary">{log.details?.message || '—'}</div>
                                        </td>
                                        <td>
                                            <div className="admin-audit-primary">
                                                {log.target_type ? log.target_type.split('\\').pop() : '—'}
                                            </div>
                                            <div className="admin-audit-secondary">
                                                {log.target_id ? `#${log.target_id}` : ''}
                                            </div>
                                        </td>
                                        <td>
                                            {changeDetail ? (
                                                <span className="admin-audit-change-summary">{changeDetail}</span>
                                            ) : (
                                                <span className="admin-audit-context-only">—</span>
                                            )}
                                        </td>
                                        <td className="text-right">
                                            {canUndo(log) && (
                                                <button
                                                    type="button"
                                                    onClick={() => setUndoTarget(log)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#720101]/20 bg-[#720101]/5 px-3 py-1.5 text-xs font-black text-[#720101] transition-all hover:bg-[#720101] hover:text-white hover:shadow-md"
                                                >
                                                    <Undo2 className="h-3.5 w-3.5" />
                                                    Undo
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            <ConfirmModal
                isOpen={!!undoTarget}
                title="Undo Action"
                message={`Are you sure you want to reverse: "${undoTarget?.details?.message || undoTarget?.action_type}"? This will revert the change.`}
                confirmText="Yes, Undo"
                cancelText="Cancel"
                tone="danger"
                busy={undoing}
                onConfirm={handleUndo}
                onCancel={() => setUndoTarget(null)}
            />
        </>
    );
}
