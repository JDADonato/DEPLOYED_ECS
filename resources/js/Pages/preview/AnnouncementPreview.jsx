import React, { useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import ClientNavbar from '../../Components/common/ClientNavbar';
import Footer from '../../Components/common/Footer';
import SmartImage from '../../Components/common/SmartImage';
import { useAuth } from '../../context/AuthContext';

const typeLabels = {
    general: 'Announcement',
    promo: 'Special Offer',
    event_reminder: 'Event Reminder',
    holiday_advisory: 'Holiday Advisory',
    menu_update: 'Menu Update',
    service_notice: 'Service Notice',
    urgent: 'Important Notice',
};

const typeIcons = {
    general: '📢',
    promo: '🎉',
    event_reminder: '📅',
    holiday_advisory: '🏖️',
    menu_update: '🍽️',
    service_notice: '⚙️',
    urgent: '🚨',
};

const visibilityLabels = {
    all_customers: 'Homepage and customer dashboard',
    active_clients: 'Customer dashboard for active clients',
    specific_roles: 'Customer dashboard for selected roles',
    specific_users: 'Customer dashboard for selected people',
};

const imageUrl = (announcement) => {
    const path = announcement?.image_url || announcement?.image_path;
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) return path;
    return `/storage/${path.replace(/^\/+/, '')}`;
};

const dashboardHrefForUser = (user) => {
    if (!user) return '/';
    const role = user.role?.toLowerCase();
    if (role === 'admin' || role === 'super_admin') return '/dashboard/admin';
    if (role === 'marketing') return '/dashboard/marketing';
    if (role === 'staff') return '/dashboard/staff';
    return '/dashboard/client';
};

const dashboardLabelForUser = (user) => {
    if (!user) return 'Back';
    const role = user.role?.toLowerCase();
    if (role === 'admin' || role === 'super_admin') return 'Back to Admin';
    if (role === 'marketing') return 'Back to Marketing';
    if (role === 'staff') return 'Back to Staff';
    return 'Back to Dashboard';
};

const AnnouncementPreview = ({ announcement }) => {
    const { user, logout } = useAuth();
    const image = imageUrl(announcement);
    const label = typeLabels[announcement.type] || 'Announcement';
    const summary = announcement.summary || announcement.body || 'Announcement summary will appear here.';
    const body = announcement.body || announcement.summary || '';
    const showHomepage = announcement.visibility === 'all_customers';

    const publishedDate = useMemo(() => {
        const value = announcement?.published_at || announcement?.created_at || announcement?.starts_at || announcement?.updated_at;
        if (!value) return 'Recent update';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return 'Recent update';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }, [announcement]);

    const details = useMemo(() => [
        ['Status', announcement.status || 'draft'],
        ['Audience', visibilityLabels[announcement.visibility] || announcement.visibility || 'All customers'],
        ['Starts', announcement.starts_at ? new Date(announcement.starts_at).toLocaleString() : 'When published'],
        ['Ends', announcement.ends_at ? new Date(announcement.ends_at).toLocaleString() : 'No automatic end'],
    ], [announcement]);

    return (
        <div className="min-h-screen bg-[#f7f4ee] font-sans">
            <Head title={`Preview: ${announcement.title || 'Announcement'}`} />
            <ClientNavbar user={user} logout={logout} activePath="/" />

            <main className="mx-auto max-w-7xl px-5 pb-16 pt-28 sm:px-8">
                {/* Preview banner */}
                <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#f0aa0b]/30 bg-[#fffbf0] px-5 py-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[.22em] text-[#9f6500]">Preview mode</p>
                        <h1 className="mt-1 font-display text-2xl font-bold text-[#1a1a1a]">Customer-facing announcement preview</h1>
                        <p className="mt-1 text-sm font-semibold text-slate-500">This is how the announcement reads in customer-facing surfaces. It does not publish or send anything.</p>
                    </div>
                    <Link href={dashboardHrefForUser(user)} className="inline-flex shrink-0 rounded-full bg-[#720101] px-5 py-3 text-sm font-black text-white hover:bg-[#5a0101] transition-colors">
                        {dashboardLabelForUser(user)}
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
                    <div className="space-y-6">
                        {/* Homepage preview — clean modern styling matching the landing page */}
                        <div className="rounded-3xl overflow-hidden border border-slate-100 bg-white">
                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                                <p className="text-xs font-black uppercase tracking-[.2em] text-[#720101]">Homepage placement</p>
                                {!showHomepage && (
                                    <span className="rounded-full bg-[#fff7e8] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#720101]">
                                        Targeted only
                                    </span>
                                )}
                            </div>

                            {showHomepage ? (
                                <div className="p-6 sm:p-8">
                                    <article className="group cursor-default">
                                        {image ? (
                                            announcement.image_fit === 'fit_image' ? (
                                                <div className="relative overflow-hidden rounded-3xl p-6 md:p-8" style={{ background: '#1a1a1a' }}>
                                                    <div className="relative w-full overflow-hidden rounded-2xl bg-black/40 mb-6 flex justify-center items-center">
                                                        <img
                                                            src={image}
                                                            alt=""
                                                            className="max-h-[30rem] w-full object-contain"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                                            <span className="rounded-full bg-white/15 backdrop-blur-sm px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                                                                {label}
                                                            </span>
                                                            <span className="text-xs font-semibold text-white/50">
                                                                {publishedDate}
                                                            </span>
                                                        </div>
                                                        <h3 className="font-display text-2xl font-extrabold leading-tight text-white md:text-3xl lg:text-4xl max-w-3xl">
                                                            {announcement.title || 'Announcement title'}
                                                        </h3>
                                                        {(summary || body) && (
                                                            <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-white/70 md:text-base">
                                                                {summary || body}
                                                            </p>
                                                        )}
                                                        {announcement.cta_label && announcement.cta_url && (
                                                            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-black uppercase tracking-wider text-[#1a1a1a]">
                                                                {announcement.cta_label}
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative overflow-hidden rounded-3xl" style={{ minHeight: '20rem', background: '#1a1a1a' }}>
                                                    <SmartImage
                                                        src={image}
                                                        alt=""
                                                        aspectRatio="21 / 9"
                                                        containerClassName="absolute inset-0 h-full w-full transition-transform duration-700"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                                            <span className="rounded-full bg-white/15 backdrop-blur-sm px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                                                                {label}
                                                            </span>
                                                            <span className="text-xs font-semibold text-white/50">
                                                                {publishedDate}
                                                            </span>
                                                        </div>
                                                        <h3 className="font-display text-3xl font-extrabold leading-tight text-white md:text-4xl lg:text-5xl max-w-3xl">
                                                            {announcement.title || 'Announcement title'}
                                                        </h3>
                                                        {(summary || body) && (
                                                            <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-white/70 md:text-lg">
                                                                {summary || body}
                                                            </p>
                                                        )}
                                                        {announcement.cta_label && announcement.cta_url && (
                                                            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-black uppercase tracking-wider text-[#1a1a1a]">
                                                                {announcement.cta_label}
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        ) : (
                                            <div className="relative overflow-hidden rounded-3xl p-6 md:p-8" style={{ minHeight: '14rem', background: 'linear-gradient(135deg, #720101, #4a0101)' }}>
                                                <div className="flex flex-col justify-end h-full">
                                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                                        <span className="rounded-full bg-white/15 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                                                            {label}
                                                        </span>
                                                        <span className="text-xs font-semibold text-white/40">
                                                            {publishedDate}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-display text-3xl font-extrabold leading-tight text-white md:text-4xl lg:text-5xl max-w-3xl">
                                                        {announcement.title || 'Announcement title'}
                                                    </h3>
                                                    {(summary || body) && (
                                                        <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-white/65 md:text-lg">
                                                            {summary || body}
                                                        </p>
                                                    )}
                                                    {body && summary && body !== summary && (
                                                        <p className="mt-3 max-w-2xl whitespace-pre-line text-sm font-medium leading-relaxed text-white/40">
                                                            {body}
                                                        </p>
                                                    )}
                                                    {announcement.cta_label && announcement.cta_url && (
                                                        <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-black uppercase tracking-wider text-[#720101]">
                                                            {announcement.cta_label}
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </article>
                                </div>
                            ) : (
                                <div className="bg-slate-50 border-t border-slate-100 p-6">
                                    <p className="text-sm font-semibold leading-6 text-slate-500">
                                        This audience setting keeps the announcement inside customer dashboard announcement areas instead of the public homepage.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Dashboard card preview */}
                        <div className="rounded-3xl border border-[#720101]/10 bg-white p-5 shadow-sm">
                            <p className="text-xs font-black uppercase tracking-[.2em] text-[#720101]">Customer dashboard placement</p>
                            <article className={`mt-4 rounded-3xl border p-5 shadow-sm ${
                                announcement.type === 'urgent' ? 'border-red-200 bg-red-50 text-red-900' :
                                announcement.type === 'promo' ? 'border-yellow-200 bg-yellow-50 text-yellow-900' :
                                announcement.type === 'service_notice' ? 'border-blue-200 bg-blue-50 text-blue-900' :
                                announcement.type === 'holiday_advisory' ? 'border-amber-200 bg-amber-50 text-amber-900' :
                                announcement.type === 'menu_update' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' :
                                'border-[#720101]/15 bg-white text-[#1a1a1a]'
                            }`}>
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div className="min-w-0">
                                        <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-black uppercase tracking-widest">
                                            {label}
                                        </span>
                                        <h2 className="mt-3 font-display text-xl font-bold">{announcement.title || 'Announcement title'}</h2>
                                        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 opacity-75">{summary}</p>
                                        {body && body !== summary && (
                                            <p className="mt-3 max-w-3xl whitespace-pre-line text-sm font-medium leading-6 opacity-65">{body}</p>
                                        )}
                                        {announcement.cta_label && announcement.cta_url && (
                                            <span className="mt-4 inline-flex rounded-xl bg-[#720101] px-4 py-2 text-xs font-black text-white">
                                                {announcement.cta_label}
                                            </span>
                                        )}
                                    </div>
                                    <span className="shrink-0 rounded-xl bg-white/70 px-4 py-2 text-xs font-black">Dismiss</span>
                                </div>
                            </article>
                        </div>
                    </div>

                    {/* Sidebar details */}
                    <aside className="h-fit rounded-3xl border border-[#720101]/10 bg-white p-5 shadow-sm">
                        <p className="text-xs font-black uppercase tracking-[.2em] text-[#9f6500]">Announcement details</p>
                        <dl className="mt-4 space-y-3">
                            {details.map(([key, value]) => (
                                <div key={key} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                                    <dt className="text-[11px] font-black uppercase tracking-widest text-slate-400">{key}</dt>
                                    <dd className="mt-1 text-sm font-black capitalize text-[#1a1a1a]">{value}</dd>
                                </div>
                            ))}
                        </dl>
                        <p className="mt-4 text-xs font-semibold leading-5 text-slate-500">
                            Drafts and scheduled announcements can be previewed here before customers can see them.
                        </p>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AnnouncementPreview;
