import React from 'react';
import StaffDrawer from './StaffDrawer';
import StaffStatusBadge from './StaffStatusBadge';
import {
    bookingStatusLabel,
    liveStatusLabel,
    ownershipStatusLabel,
    paymentMethodLabel,
    reviewStatusLabel,
} from '../../utils/statusLabels';
import { bookingContactEmail, bookingContactName, bookingContactPhone, customerAccountEmail, customerAccountHandle, customerAccountName, customerAccountPhone, hasDifferentBookingContact } from '../../utils/customerIdentity';
import SmartImage from '../common/SmartImage';

const formatDate = (value) => {
    if (!value) return 'Date pending';
    return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (value) => {
    if (!value) return 'Time pending';
    const [hour, minute] = String(value).split(':');
    const date = new Date();
    date.setHours(Number(hour || 0), Number(minute || 0), 0, 0);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const formatMoney = (value) => `PHP ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fullAddress = (booking) => [
    booking?.venue_address_line,
    booking?.venue_barangay,
    booking?.venue_city,
    booking?.venue_province,
].filter(Boolean).join(', ') || booking?.venue || 'Venue pending';

const normalizeDishes = (selectedMenu) => {
    if (!selectedMenu) return [];
    try {
        const parsed = typeof selectedMenu === 'string' ? JSON.parse(selectedMenu || '{}') : selectedMenu;
        return Object.entries(parsed || {}).flatMap(([category, items]) => (
            Array.isArray(items) ? items.map((item) => ({
                category,
                name: typeof item === 'string' ? item : item?.name,
            })) : []
        )).filter((item) => item.name);
    } catch (e) {
        return [];
    }
};

const normalizeImages = (uploads) => {
    if (!uploads) return [];
    try {
        const str = typeof uploads === 'string' ? uploads : JSON.stringify(uploads);
        const matches = str.match(/(?:https?:\/\/[^"'\s\\]+|\/storage\/[^"'\s\\]+)/g);
        if (matches && matches.length > 0) {
            return [...new Set(matches.map(m => m.replace(/\\/g, '')))];
        }
    } catch (e) {
        console.error("Failed to parse images:", e);
    }
    
    // Fallback if it's just a raw path that doesn't start with /storage/ or http
    if (typeof uploads === 'string') {
        const cleaned = uploads.replace(/^[\["'\s]+|[\]"'\s]+$/g, '').replace(/\\/g, '');
        return cleaned ? [cleaned] : [];
    }
    return Array.isArray(uploads) ? uploads.filter(item => typeof item === 'string') : [];
};

const EventDetailDrawer = ({
    isOpen,
    booking,
    role = 'staff',
    currentUser,
    title = 'Event details',
    eyebrow = 'Event brief',
    actionSlot,
    footer,
    onClose,
    onUpdateLiveStatus,
    journeySlot,
    children,
}) => {
    if (!booking) return null;

    const [activeTab, setActiveTab] = React.useState(() => {
        return localStorage.getItem('ecs_event_brief_active_tab') || 'overview';
    });

    const isApprovedForReservation = String(booking.review_status || '').toLowerCase() === 'approved for reservation';
    const displayStatus = (booking.status === 'Confirmed' && !isApprovedForReservation) ? 'Pending' : booking.status;
    const bookingStatus = bookingStatusLabel(displayStatus);
    const reviewStatus = reviewStatusLabel(booking.review_status || (booking.status === 'Pending' ? 'Submitted' : booking.status));
    const ownershipStatus = ownershipStatusLabel(booking, currentUser);
    const liveStatus = liveStatusLabel(booking.live_status);
    const dishes = normalizeDishes(booking.selected_menu);
    const themeImages = normalizeImages(booking.theme_uploads);
    const payments = booking.payments || [];
    const showCustomerAccount = hasDifferentBookingContact(booking);

    const displayTitle = title === 'Event brief' || title === 'Event details'
        ? `Booking #${String(booking.id || '').padStart(4, '0')}`
        : title;

    const displayEyebrow = eyebrow === 'Event brief'
        ? 'Event Details'
        : eyebrow;

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'menu', label: 'Menu & Package' },
        { id: 'finances', label: 'Finances' },
        journeySlot ? { id: 'journey', label: 'Customer Journey' } : null,
    ].filter(Boolean);

    React.useEffect(() => {
        if (isOpen) {
            const savedTab = localStorage.getItem('ecs_event_brief_active_tab') || 'overview';
            const isValid = tabs.some((t) => t.id === savedTab);
            setActiveTab(isValid ? savedTab : 'overview');
        }
    }, [isOpen, booking?.id, journeySlot]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        localStorage.setItem('ecs_event_brief_active_tab', tabId);
    };

    const canEdit = Boolean(
        booking?.can_edit ?? (
            currentUser?.role === 'Admin' || (
                booking?.assigned_to && Number(booking.assigned_to) === Number(currentUser?.id)
            )
        )
    );

    const showLiveStatus = booking.status === 'Confirmed' && isApprovedForReservation && onUpdateLiveStatus;
    const LIVE_STATUS_OPTIONS = ['Not Started', 'On the Way', 'Preparing', 'Serving', 'Completed'];

    const drawerFooter = (
        <div className="w-full space-y-2">
            {showLiveStatus && (
                <div className="pb-1 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                        Live Status Tracking
                    </p>
                    <div className="flex flex-wrap justify-center gap-1">
                        {LIVE_STATUS_OPTIONS.map((status) => {
                            const isActive = booking.live_status === status || (!booking.live_status && status === 'Not Started');
                            return (
                                <button
                                    key={status}
                                    type="button"
                                    disabled={!canEdit}
                                    onClick={() => onUpdateLiveStatus(booking.id, status)}
                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border transition ${
                                        isActive
                                            ? 'border-[#720101] bg-[#720101] text-white'
                                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                                    } ${!canEdit ? 'cursor-not-allowed opacity-50' : ''}`}
                                >
                                    {status}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
            {footer && (
                <div className="flex w-full items-center justify-between pt-1">
                    {footer}
                </div>
            )}
        </div>
    );

    return (
        <StaffDrawer
            isOpen={isOpen}
            eyebrow={displayEyebrow}
            title={displayTitle}
            onClose={onClose}
            footer={drawerFooter}
        >
            <div className="space-y-4">
                {/* Header Card */}
                <section className="rounded-lg border border-[#720101]/10 bg-[#fffaf3] p-4">
                    <div className="flex flex-col">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h3 className="text-lg font-black text-slate-950">{booking.event_display_name || booking.event_name || booking.event_type || booking.package_name || `Booking #${booking.id}`}</h3>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                            <StaffStatusBadge tone={bookingStatus.tone === 'success' ? 'good' : bookingStatus.tone === 'danger' ? 'danger' : bookingStatus.tone === 'warning' ? 'warn' : 'muted'}>{bookingStatus.label}</StaffStatusBadge>
                            {ownershipStatus.label !== 'Owned by another staff member' && (
                                <StaffStatusBadge tone={ownershipStatus.tone === 'success' ? 'good' : ownershipStatus.tone === 'warning' ? 'warn' : 'muted'}>{ownershipStatus.label}</StaffStatusBadge>
                            )}
                            <span className="text-slate-300">|</span>
                            <span className="text-slate-600">
                                Owner: <strong className="text-slate-800">{booking.owner_name || booking.assigned_name || booking.owner || 'Unassigned'}</strong>
                            </span>
                        </div>
                        {actionSlot && (
                            <div className="mt-3 flex flex-wrap gap-2 border-t border-[#720101]/5 pt-3">
                                {actionSlot}
                            </div>
                        )}
                    </div>
                </section>

                {/* Tabs Navigation */}
                <div className="sticky top-0 z-10 bg-white py-2 border-b border-slate-100">
                    <div className="flex p-1 bg-slate-100 rounded-xl space-x-1">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`flex-1 py-1.5 text-center text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                                        isActive
                                            ? 'bg-white text-[#720101] shadow-sm'
                                            : 'text-slate-400 hover:text-slate-700'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="mt-4 space-y-4">
                    {activeTab === 'overview' && (
                        <>
                            {/* Unified, Compact Details Card */}
                            <section className="rounded-lg border border-slate-100 bg-white p-4 space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Schedule & Guests</p>
                                        <p className="mt-1 text-sm font-bold text-slate-850">{formatDate(booking.event_date)} / {formatTime(booking.event_time)}</p>
                                        <p className="text-xs font-semibold text-slate-500">{booking.pax || 0} guests</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Venue</p>
                                        <p className="mt-1 text-sm font-bold text-slate-850">{fullAddress(booking)}</p>
                                        {booking.venue_building_details && <p className="text-xs font-semibold text-slate-500">{booking.venue_building_details}</p>}
                                    </div>
                                </div>
                                {(booking.color_motif || themeImages.length > 0) && (
                                    <div className="border-t border-slate-100 pt-3">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Event Aesthetics & Inspiration</p>
                                        {booking.color_motif && (
                                            <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5">
                                                <span className="text-xs font-bold text-slate-600">Color motif:</span>
                                                <span className="text-xs font-black text-slate-900">{booking.color_motif}</span>
                                            </div>
                                        )}
                                        {themeImages.length > 0 && (
                                            <div className="grid gap-2 sm:grid-cols-2">
                                                {themeImages.map((imgUrl, i) => (
                                                    <a key={i} href={imgUrl} target="_blank" rel="noreferrer" className="group block overflow-hidden rounded-xl border border-slate-200">
                                                        <SmartImage src={imgUrl} alt={`Theme Inspiration ${i+1}`} aspectRatio="16 / 9" containerClassName="h-48 w-full transition duration-300 group-hover:opacity-90" />
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="border-t border-slate-100 pt-3 grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Booking Contact</p>
                                        <p className="mt-1 text-sm font-bold text-slate-850">{bookingContactName(booking)}</p>
                                        <p className="text-xs font-semibold text-slate-500">{bookingContactEmail(booking) || 'No email recorded'}</p>
                                        <p className="text-xs font-semibold text-slate-500">{bookingContactPhone(booking) || 'No phone recorded'}</p>
                                    </div>
                                    {showCustomerAccount ? (
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Customer Account</p>
                                            <p className="mt-1 text-sm font-bold text-slate-850">{customerAccountName(booking)}</p>
                                            {customerAccountHandle(booking) && <p className="text-xs font-semibold text-slate-500">{customerAccountHandle(booking)}</p>}
                                            <p className="text-xs font-semibold text-slate-500">{customerAccountEmail(booking) || 'No account email'}</p>
                                            <p className="text-xs font-semibold text-slate-500">{customerAccountPhone(booking) || 'No account phone'}</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Customer Account</p>
                                            <p className="mt-1.5 text-xs font-bold text-slate-400 italic">Same as booking contact</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                            {role !== 'accounting' && children}
                        </>
                    )}

                    {activeTab === 'menu' && (
                        <section className="rounded-lg border border-slate-100 bg-white p-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Menu and package</p>
                            <p className="text-sm font-black text-slate-900">{booking.package_name || booking.package || booking.event_type || 'Package pending'}</p>
                            {dishes.length === 0 ? (
                                <p className="mt-3 rounded-lg bg-slate-50/50 p-3 text-sm font-semibold text-slate-500 italic">No dishes selected yet.</p>
                            ) : (
                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                    {dishes.slice(0, 12).map((dish, index) => (
                                        <div key={`${dish.category}-${dish.name}-${index}`} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{dish.category}</p>
                                            <p className="text-sm font-bold text-slate-850">{dish.name}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {activeTab === 'finances' && (
                        <div className="space-y-4">
                            {/* Finances Summary Card */}
                            <section className="rounded-lg border border-slate-100 bg-white p-4 grid gap-4 sm:grid-cols-3">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Event Total</p>
                                    <p className="mt-1 text-lg font-black text-slate-800">{formatMoney(booking.totalCost ?? booking.total_cost ?? booking.budget)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Travel Fee</p>
                                    <p className="mt-1 text-lg font-black text-slate-800">{formatMoney(booking.transport_fee)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Event Status</p>
                                    <div className="mt-1.5">
                                        <StaffStatusBadge tone={liveStatus.tone === 'success' ? 'good' : liveStatus.tone === 'warning' ? 'warn' : 'muted'}>{liveStatus.label}</StaffStatusBadge>
                                    </div>
                                </div>
                            </section>

                            {/* Payments schedule */}
                            {role !== 'accounting' && (
                                <section className="rounded-lg border border-slate-100 bg-white p-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Payments and refunds</p>
                                    {payments.length === 0 ? (
                                        <p className="text-sm font-semibold text-slate-500 italic">No payment records yet.</p>
                                    ) : (
                                        <div className="grid gap-2">
                                            {payments.slice(0, 5).map((payment) => (
                                                <div key={payment.id} className="flex flex-col gap-2 rounded-lg border border-slate-100 bg-slate-50/50 p-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900">{payment.payment_type || 'Payment'} / {paymentMethodLabel(payment.method || payment.payment_method)}</p>
                                                        <p className="text-xs font-bold text-slate-400">{formatDate(payment.due_date || payment.paid_at || payment.created_at)}</p>
                                                    </div>
                                                    <p className="text-sm font-black text-slate-950">{formatMoney(payment.amount)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            )}

                            {role === 'accounting' && children}
                        </div>
                    )}

                    {activeTab === 'journey' && (
                        <div className="space-y-4">
                            {journeySlot || (
                                <p className="text-sm font-semibold text-slate-500 italic">No customer journey summary available.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </StaffDrawer>
    );
};

export default EventDetailDrawer;
