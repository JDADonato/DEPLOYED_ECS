import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';

export default function PasswordConfirmModal({
    isOpen,
    title = 'Security Verification',
    message = 'Please confirm your password to proceed with this action.',
    confirmText = 'Verify & Proceed',
    cancelText = 'Cancel',
    onCancel,
    onConfirm,
    busy = false,
}) {
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(password);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-amber-500/20 bg-[#fffaf3] shadow-2xl">
                <form onSubmit={handleSubmit}>
                    <div className="px-7 pt-7 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl ring-1 bg-amber-50 text-amber-600 ring-amber-100">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                        <h3 className="font-display text-xl font-bold text-slate-950">{title}</h3>
                        <p className="mt-3 text-sm font-medium leading-6 text-slate-500">{message}</p>
                        
                        <div className="mt-5 text-left">
                            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                                Your Password
                            </label>
                            <input 
                                type="password" 
                                required 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm font-medium"
                                placeholder="Enter your password"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 p-6">
                        <button
                            type="button"
                            onClick={() => { setPassword(''); onCancel(); }}
                            disabled={busy}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-black text-slate-600 transition hover:bg-gray-50 disabled:opacity-60"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="submit"
                            disabled={busy || !password}
                            className="rounded-xl px-4 py-3 text-sm font-black text-white transition disabled:opacity-60 bg-amber-600 hover:bg-amber-700"
                        >
                            {busy ? 'Verifying...' : confirmText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
