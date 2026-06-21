export const ADMIN_WORKSPACES = [
    { id: 'admin', label: 'Admin', description: 'Owner controls, reports, accounts, audit, and settings.' },
    { id: 'customer', label: 'Customer', description: 'Customer-side modules reviewed through admin support access.' },
    { id: 'marketing', label: 'Marketing', description: 'Marketing staff modules with admin monitoring and override actions.' },
    { id: 'accounting', label: 'Accounting', description: 'Accounting staff modules with admin monitoring and override actions.' },
];

export const ADMIN_WORKSPACE_NAV_GROUPS = [
    {
        label: 'Admin',
        items: [
            { id: 'today', label: 'Command Center', description: 'Review operational priorities and owner-level shortcuts.', aliases: ['dashboard', 'overview', 'home', 'command'] },
            { id: 'accounts', label: 'Accounts', description: 'Manage staff and customer account access.', aliases: ['users', 'people', 'staff', 'customers'] },
            { id: 'analytics-overview', label: 'Analytics Overview', description: 'Review decision summary, current read, and analytics shortcuts.', aliases: ['analytics overview', 'decision summary', 'business state', 'current read'] },
            { id: 'analytics', label: 'Analytics', description: 'Review core forecast methods and performance insights.', aliases: ['insights', 'core analytics', 'forecast', 'forecast methods', 'simple linear regression', 'moving average'] },
            { id: 'analytics-supporting', label: 'Supporting Charts', description: 'Review descriptive dashboard charts and demand breakdowns.', aliases: ['supporting charts', 'charts', 'descriptive charts', 'payment breakdown', 'menu demand'] },
            { id: 'reports', label: 'Reports', description: 'Build exports and formal summaries for admin review.', aliases: ['exports', 'report builder', 'pdf'] },
            { id: 'feedbacks', label: 'Customer Feedbacks', description: 'Review customer satisfaction scores and feedback.', aliases: ['feedbacks', 'reviews', 'testimonials'] },
            { id: 'system-audit', label: 'System & Audit', description: 'Monitor system health, delivery, sessions, and activity logs.', aliases: ['audit', 'logs', 'system'] },
            { id: 'action-logs', label: 'Activity Logs', description: 'Monitor staff actions and undo dangerous operations.', aliases: ['undo', 'action logs', 'history'] },
            { id: 'settings', label: 'Settings', description: 'Control admin preferences, business profile, and payment rules.', aliases: ['configuration', 'preferences', 'payment rules'] },
        ],
    },
];

export const CUSTOMER_WORKSPACE_NAV_GROUPS = [
    {
        label: 'Customer',
        items: [
            { id: 'lookup', label: 'Customer Lookup', description: 'Find and select a customer before reviewing customer modules.', aliases: ['client lookup', 'find customer', 'customer accounts'] },
            { id: 'dashboard', label: 'Dashboard', requiresCustomer: true, description: 'Review bookings, event details, and assisted booking actions for the selected customer.', aliases: ['client dashboard', 'overview', 'journey', 'book now', 'booking wizard', 'create booking', 'assisted booking', 'event details', 'event', 'date', 'pax', 'venue'] },
            { id: 'menu', label: 'Menu', requiresCustomer: true, description: 'Review menu selections connected to customer bookings.', aliases: ['menu selection', 'dishes', 'package'] },
            { id: 'payments', label: 'Payments', requiresCustomer: true, description: 'Review customer payments and checkout support context.', aliases: ['checkout', 'balance', 'receipts'] },
            { id: 'history', label: 'History', requiresCustomer: true, description: 'Review completed and cancelled customer events.', aliases: ['event history', 'past events'] },
            { id: 'messages', label: 'Messages', requiresCustomer: true, description: 'Monitor customer conversations and take over only when needed.', aliases: ['chat', 'conversation', 'support'] },
            { id: 'feedback', label: 'Feedback Request', requiresCustomer: true, description: 'Review customer feedback follow-up context.', aliases: ['feedback', 'testimonial', 'rating'] },
            { id: 'announcements', label: 'Announcements', requiresCustomer: true, description: 'Review customer-facing announcements context.', aliases: ['updates', 'customer notices'] },
            { id: 'account-status', label: 'Account Status', requiresCustomer: true, description: 'Review customer account status and access actions.', aliases: ['reactivate', 'deactivate', 'profile'] },
        ],
    },
];

export const MARKETING_WORKSPACE_NAV_GROUPS = [
    {
        label: 'Daily work',
        items: [
            { id: 'today', label: 'To-Dos', description: 'Review the highest-priority customer work assigned to you or ready to claim.', aliases: ['marketing today', 'daily work', 'tasks', 'to dos', 'todos'] },
            { id: 'bookings', label: 'Bookings', description: 'Monitor booking review and takeover booking work when needed.', aliases: ['booking review', 'intake', 'reservations'] },
            { id: 'tastings', label: 'Food Tastings', description: 'Monitor food tasting requests and outcomes.', aliases: ['tasting', 'sampling'] },
            { id: 'messages', label: 'Messages', description: 'Monitor customer conversations and join only when escalation is needed.', aliases: ['chat', 'support'] },
            { id: 'calendar', label: 'Calendar', description: 'Review confirmed event dates and schedule context.', aliases: ['schedule', 'events'] },
            { id: 'leads', label: 'Guest Inquiries', description: 'Review guest inquiries and customer communication queues.', aliases: ['inquiries', 'leads', 'contact inquiries'] },
        ],
    },
    {
        label: 'Operations',
        items: [
            { id: 'public-content', label: 'Public Content', description: 'Manage customer-facing catalog and announcements.', aliases: ['announcements', 'packages', 'event types', 'menu items'] },
            { id: 'availability', label: 'Availability', description: 'Review availability, date capacity, and closed dates.', aliases: ['slots', 'capacity', 'closed dates'] },
            { id: 'feedbacks', label: 'Customer Feedbacks', description: 'Review customer satisfaction scores and feedback.', aliases: ['feedbacks', 'reviews', 'testimonials'] },
            { id: 'settings', label: 'Settings', description: 'Control marketing workspace preferences and role settings.', aliases: ['preferences', 'workspace settings'] },
            { id: 'history', label: 'Event History', description: 'Review completed event history and post-event context.', aliases: ['completed events', 'post-event'] },
        ],
    },
];

export const ACCOUNTING_WORKSPACE_NAV_GROUPS = [
    {
        label: 'Daily work',
        items: [
            { id: 'today', label: 'To-Dos', description: 'Review the highest-priority finance work for today.', aliases: ['accounting today', 'daily work', 'tasks', 'to dos', 'todos'] },
            { id: 'payments', label: 'Payments', description: 'Monitor pending proofs, overdue terms, and exceptions.', aliases: ['payment verification', 'billing', 'checkout'] },
            { id: 'reconciliation', label: 'Reconciliation', description: 'Review payment exceptions and reconciliation work.', aliases: ['exceptions', 'matching', 'issues'] },
            { id: 'refunds', label: 'Refunds', description: 'Review refundable cancellations and refund processing.', aliases: ['refund queue', 'cancellations'] },
            { id: 'ledger', label: 'Ledger & Receipts', description: 'Review ledger records, receipts, and payment history.', aliases: ['ledger', 'receipts', 'records'] },
            { id: 'settings', label: 'Settings', description: 'Control accounting workspace preferences and finance role settings.', aliases: ['preferences', 'workspace settings'] },
            { id: 'history', label: 'Event History', description: 'Review event history with finance context.', aliases: ['completed events', 'past events'] },
        ],
    },
];

export const cloneNavGroups = (groups) => groups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
        ...item,
        children: Array.isArray(item.children) ? item.children.map((child) => ({ ...child })) : undefined,
    })),
}));

export const withNavCounts = (groups, counts = {}) => cloneNavGroups(groups).map((group) => ({
    ...group,
    items: group.items.map((item) => ({
        ...item,
        count: counts[item.id],
        children: Array.isArray(item.children)
            ? item.children.map((child) => ({ ...child, count: counts[child.id] }))
            : item.children,
    })),
}));
