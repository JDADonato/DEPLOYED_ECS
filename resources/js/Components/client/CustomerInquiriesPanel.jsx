import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function CustomerInquiriesPanel() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/customer/my-inquiries');
            if (res.ok) {
                const result = await res.json();
                setInquiries(result.data || []);
            }
        } catch (err) {
            console.error('Failed to load inquiries', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto"></div>
            </div>
        );
    }

    if (inquiries.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-[#fffaf3] text-[#9f6500] rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900">No inquiries yet</h3>
                <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">Your questions from the contact page will appear here along with our replies.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {!selectedInquiry ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-black text-slate-900">My Inquiries</h2>
                        <p className="text-sm font-semibold text-slate-500 mt-1">Review your past messages and responses from our staff.</p>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {inquiries.map(inquiry => (
                            <button
                                key={inquiry.id}
                                onClick={() => setSelectedInquiry(inquiry)}
                                className="w-full text-left p-6 hover:bg-gray-50 transition-colors flex items-center gap-4"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-black uppercase tracking-wider ${inquiry.status === 'Resolved' || inquiry.status === 'Closed' ? 'bg-emerald-100 text-emerald-800' : inquiry.status === 'New' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {inquiry.status}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400">{format(new Date(inquiry.created_at), 'MMM d, yyyy')}</span>
                                    </div>
                                    <h4 className="text-base font-black text-slate-900 truncate">{inquiry.subject}</h4>
                                    <p className="text-sm font-semibold text-slate-500 truncate mt-1">{inquiry.message}</p>
                                </div>
                                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <button
                            onClick={() => setSelectedInquiry(null)}
                            className="flex items-center gap-2 text-sm font-black text-slate-600 hover:text-slate-900"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to Inquiries
                        </button>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-black uppercase tracking-wider ${selectedInquiry.status === 'Resolved' || selectedInquiry.status === 'Closed' ? 'bg-emerald-100 text-emerald-800' : selectedInquiry.status === 'New' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                            {selectedInquiry.status}
                        </span>
                    </div>
                    
                    <div className="p-6">
                        <div className="mb-8">
                            <h3 className="text-xl font-black text-slate-900 mb-2">{selectedInquiry.subject}</h3>
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-black text-slate-700">You</span>
                                    <span className="text-xs font-bold text-slate-400">{format(new Date(selectedInquiry.created_at), 'MMM d, yyyy h:mm a')}</span>
                                </div>
                                <p className="text-sm font-semibold text-slate-600 whitespace-pre-wrap">{selectedInquiry.message}</p>
                            </div>
                        </div>

                        {selectedInquiry.replies?.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-gray-100 pb-2">Staff Responses</h4>
                                {selectedInquiry.replies.map(reply => (
                                    <div key={reply.id} className="bg-[#fffaf3] rounded-xl p-5 border border-[#f0aa0b]/20">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-black text-[#9f6500]">{reply.user?.full_name || 'Staff Support'}</span>
                                            <span className="text-xs font-bold text-[#9f6500]/60">{format(new Date(reply.created_at), 'MMM d, yyyy h:mm a')}</span>
                                        </div>
                                        <div className="text-sm font-semibold text-slate-700 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: reply.reply_body }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
