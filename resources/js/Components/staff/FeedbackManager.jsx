import React, { useState, useMemo } from 'react';
import { Star, MessageSquareHeart, Utensils, Users, MessageCircle, DollarSign, Calendar, ChevronRight, Filter } from 'lucide-react';
import { formatDate } from '../../utils/dashboardUtils';
import useSmartRefresh from '../../hooks/useSmartRefresh';

const ScoreCard = ({ title, score, icon: Icon, colorClass, delay }) => (
    <div className={`animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md ${delay}`}>
        <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorClass} bg-opacity-10`}>
                <Icon className={`h-5 w-5 ${colorClass.replace('bg-', 'text-')}`} />
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">{score > 0 ? score.toFixed(1) : '-'}</span>
                    <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
                </div>
            </div>
        </div>
    </div>
);

const FeedbackCard = ({ feedback }) => {
    return (
        <div className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-[#f0aa0b]/30 hover:shadow-md">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-black text-slate-900">{feedback.client_name || 'Guest'}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {feedback.event_date ? formatDate(feedback.event_date) : 'Unknown Date'}
                        </span>
                        {feedback.event_type && (
                            <>
                                <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                <span className="uppercase tracking-wider text-slate-600">{feedback.event_type}</span>
                            </>
                        )}
                        {feedback.event_name && (
                            <>
                                <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                <span className="truncate max-w-[150px]">{feedback.event_name}</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#fffaf3] px-3 py-1 border border-[#f0aa0b]/20">
                    <Star className="h-4 w-4 fill-[#f0aa0b] text-[#f0aa0b]" />
                    <span className="text-sm font-black text-[#9f6500]">{feedback.rating}.0</span>
                </div>
            </div>

            {feedback.comments ? (
                <div className="mb-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                    "{feedback.comments}"
                </div>
            ) : (
                <div className="mb-4 italic text-sm text-slate-400">No additional comments provided.</div>
            )}

            <div className="mt-auto grid grid-cols-2 gap-y-2 sm:grid-cols-4 gap-x-4 border-t border-slate-100 pt-4">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Food</span>
                    <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
                        <Utensils className="h-3.5 w-3.5 text-slate-400" />
                        {feedback.food_rating ? `${feedback.food_rating}/5` : '-'}
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Service</span>
                    <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        {feedback.service_rating ? `${feedback.service_rating}/5` : '-'}
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Comm</span>
                    <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
                        <MessageCircle className="h-3.5 w-3.5 text-slate-400" />
                        {feedback.communication_rating ? `${feedback.communication_rating}/5` : '-'}
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Value</span>
                    <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
                        <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                        {feedback.value_rating ? `${feedback.value_rating}/5` : '-'}
                    </div>
                </div>
            </div>
            
            {(feedback.testimonial_permission || feedback.follow_up_required) && (
                <div className="mt-4 flex gap-2">
                     {feedback.testimonial_permission && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                            Testimonial Approved
                        </span>
                     )}
                     {feedback.follow_up_required && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
                            Needs Follow-up
                        </span>
                     )}
                </div>
            )}
        </div>
    );
};

export default function FeedbackManager() {
    const { data: rawData, isInitialLoading, isRefreshing } = useSmartRefresh('/api/marketing/feedback-responses?paginated=false', {
        interval: 60000,
        cacheKey: 'staff:feedbacks',
        staleTime: 300000,
    });

    const [filter, setFilter] = useState('all'); // all, testimonial, followup

    // Extract feedbacks array from paginated response
    const feedbacks = useMemo(() => {
        if (!rawData) return [];
        return Array.isArray(rawData) ? rawData : (rawData.data || []);
    }, [rawData]);

    const filteredFeedbacks = useMemo(() => {
        if (filter === 'testimonial') return feedbacks.filter(f => f.testimonial_permission);
        if (filter === 'followup') return feedbacks.filter(f => f.follow_up_required);
        return feedbacks;
    }, [feedbacks, filter]);

    const averages = useMemo(() => {
        if (!feedbacks.length) return { overall: 0, food: 0, service: 0, comms: 0, value: 0 };
        
        const sum = (key) => feedbacks.reduce((acc, curr) => acc + (curr[key] || 0), 0);
        const count = (key) => feedbacks.filter(f => f[key]).length;

        const avg = (key) => {
            const c = count(key);
            return c > 0 ? sum(key) / c : 0;
        };

        return {
            overall: avg('rating'),
            food: avg('food_rating'),
            service: avg('service_rating'),
            comms: avg('communication_rating'),
            value: avg('value_rating'),
        };
    }, [feedbacks]);

    if (isInitialLoading) {
        return (
            <div className="p-8">
                <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200 mb-8"></div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200"></div>
                    ))}
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-48 animate-pulse rounded-2xl bg-slate-200"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Customer Feedback</h1>
                    <p className="text-sm font-medium text-slate-500">Monitor client satisfaction and actionable insights.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-xl bg-slate-100 p-1">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-1.5 text-xs font-bold transition-all rounded-lg ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            All ({feedbacks.length})
                        </button>
                        <button
                            onClick={() => setFilter('testimonial')}
                            className={`px-4 py-1.5 text-xs font-bold transition-all rounded-lg ${filter === 'testimonial' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Testimonials
                        </button>
                        <button
                            onClick={() => setFilter('followup')}
                            className={`px-4 py-1.5 text-xs font-bold transition-all rounded-lg ${filter === 'followup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Needs Follow-up
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <ScoreCard title="Overall" score={averages.overall} icon={Star} colorClass="bg-yellow-500 text-yellow-600" delay="delay-0" />
                <ScoreCard title="Food" score={averages.food} icon={Utensils} colorClass="bg-emerald-500 text-emerald-600" delay="delay-75" />
                <ScoreCard title="Service" score={averages.service} icon={Users} colorClass="bg-blue-500 text-blue-600" delay="delay-100" />
                <ScoreCard title="Communication" score={averages.comms} icon={MessageCircle} colorClass="bg-purple-500 text-purple-600" delay="delay-150" />
                <ScoreCard title="Value" score={averages.value} icon={DollarSign} colorClass="bg-teal-500 text-teal-600" delay="delay-200" />
            </div>

            {filteredFeedbacks.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                        <MessageSquareHeart className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">No Feedback Found</h3>
                    <p className="mt-1 max-w-md text-sm font-medium text-slate-500">
                        There are no feedback submissions matching your current filter.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredFeedbacks.map(feedback => (
                        <FeedbackCard key={feedback.id} feedback={feedback} />
                    ))}
                </div>
            )}
        </div>
    );
}
