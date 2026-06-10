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
    const icon = typeIcons[announcement.type] || '📢';
    const summary = announcement.summary || announcement.body || 'Announcement summary will appear here.';
    const body = announcement.body || announcement.summary || '';
    const showHomepage = announcement.visibility === 'all_customers';
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
                        {/* Homepage preview — dark announcement board style */}
                        <div className="rounded-3xl overflow-hidden">
                            <div className="flex items-center justify-between border-b border-[#720101]/10 bg-white px-5 py-3">
                                <p className="text-xs font-black uppercase tracking-[.2em] text-[#720101]">Homepage placement</p>
                                {!showHomepage && (
                                    <span className="rounded-full bg-[#fff7e8] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#720101]">
                                        Targeted only
                                    </span>
                                )}
                            </div>

                            {showHomepage ? (
                                <section className="relative bg-[#15110f] py-14 overflow-hidden">
                                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
                                    <div className="absolute top-0 left-0 w-60 h-60 rounded-full bg-[#720101]/8 blur-[100px]" />
                                    <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#f0aa0b]/5 blur-[120px]" />

                                    <div className="relative px-8 md:px-12">
                                        <article className="py-8">
                                            {image ? (
                                                <div className="grid gap-8 lg:grid-cols-[1fr_0.5fr] lg:items-center">
                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-3 mb-5">
                                                            <span className="text-lg">{icon}</span>
                                                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#f0aa0b]">
                                                                {label}
                                                            </span>
                                                        </div>
                                                        <h3 className="font-display text-3xl font-extrabold leading-tight text-white md:text-4xl tracking-tight">
                                                            {announcement.title || 'Announcement title'}
                                                        </h3>
                                                        <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/55 md:text-lg">
                                                            {summary}
                                                        </p>
                                                        {body && body !== summary && (
                                                            <p className="mt-3 max-w-2xl whitespace-pre-line text-sm font-medium leading-relaxed text-white/35">
                                                                {body}
                                                            </p>
                                                        )}
                                                        {announcement.cta_label && announcement.cta_url && (
                                                            <a href={announcement.cta_url} className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#f0aa0b]/30 bg-[#f0aa0b]/10 px-6 py-3 text-xs font-black uppercase tracking-wider text-[#f0aa0b] transition-all hover:bg-[#f0aa0b]/20 hover:border-[#f0aa0b]/50">
                                                                {announcement.cta_label}
                                                                <span>→</span>
                                                            </a>
                                                        )}
                                                    </div>
                                                    <div className="relative overflow-hidden rounded-2xl bg-white/5">
                                                        <SmartImage src={image} alt="" aspectRatio="4 / 3" containerClassName="h-full min-h-[14rem]" />
                                                        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-3 mb-5">
                                                        <span className="text-xl">{icon}</span>
                                                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#f0aa0b]">
                                                            {label}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-display text-3xl font-extrabold leading-tight text-white md:text-4xl lg:text-5xl tracking-tight">
                                                        {announcement.title || 'Announcement title'}
                                                    </h3>
                                                    <p className="mt-5 max-w-3xl text-base font-medium leading-relaxed text-white/55 md:text-lg">
                                                        {summary}
                                                    </p>
                                                    {body && body !== summary && (
                                                        <p className="mt-3 max-w-2xl whitespace-pre-line text-sm font-medium leading-relaxed text-white/35">
                                                            {body}
                                                        </p>
                                                    )}
                                                    {announcement.cta_label && announcement.cta_url && (
                                                        <a href={announcement.cta_url} className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#f0aa0b]/30 bg-[#f0aa0b]/10 px-6 py-3 text-xs font-black uppercase tracking-wider text-[#f0aa0b] transition-all hover:bg-[#f0aa0b]/20 hover:border-[#f0aa0b]/50">
                                                            {announcement.cta_label}
                                                            <span>→</span>
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </article>
                                    </div>
                                </section>
                            ) : (
                                <div className="bg-slate-50 border border-slate-100 p-6">
                                    <p className="text-sm font-semibold leading-6 text-slate-500">
                                        This audience setting keeps the announcement inside customer dashboard announcement areas instead of the public homepage.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Dashboard card preview */}
                        <div className="rounded-3xl border border-[#720101]/10 bg-white p-5 shadow-sm">
                            <p className="text-xs font-black uppercase tracking-[.2em] text-[#720101]">Customer dashboard placement</p>
                            <article className={`mt-4 rounded-2xl border p-5 shadow-sm ${
                                announcement.type === 'urgent' ? 'border-red-200 bg-red-50 text-red-900' :
                                announcement.type === 'promo' ? 'border-yellow-200 bg-yellow-50 text-yellow-900' :
                                announcement.type === 'service_notice' ? 'border-blue-200 bg-blue-50 text-blue-900' :
                                announcement.type === 'holiday_advisory' ? 'border-amber-200 bg-amber-50 text-amber-900' :
                                announcement.type === 'menu_update' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' :
                                'border-[#720101]/15 bg-white text-[#1a1a1a]'
                            }`}>
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span>{icon}</span>
                                            <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-black uppercase tracking-widest">
                                                {label}
                                            </span>
                                        </div>
                                        <h2 className="mt-3 font-display text-xl font-bold">{announcement.title || 'Announcement title'}</h2>
                                        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 opacity-75">{summary}</p>
                                        {body && body !== summary && (
                                            <p className="mt-3 max-w-3xl whitespace-pre-line text-sm font-medium leading-6 opacity-65">{body}</p>
                                        )}
                                        {announcement.cta_label && announcement.cta_url && (
                                            <a href={announcement.cta_url} className="mt-4 inline-flex rounded-xl bg-[#720101] px-4 py-2 text-xs font-black text-white">
                                                {announcement.cta_label}
                                            </a>
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
