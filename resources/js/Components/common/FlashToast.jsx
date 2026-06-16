import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { useToast } from '../../context/ToastContext';

const FlashToast = () => {
    const { flash } = usePage().props;
    const { toasts, removeToast } = useToast();
    const [flashVisible, setFlashVisible] = useState(false);
    const [flashMessage, setFlashMessage] = useState('');
    const [flashType, setFlashType] = useState('success');
    const [flashExiting, setFlashExiting] = useState(false);

    useEffect(() => {
        if (flash?.message) {
            setFlashMessage(flash.message);
            setFlashType('success');
            setFlashVisible(true);
            setFlashExiting(false);
        } else if (flash?.error) {
            setFlashMessage(flash.error);
            setFlashType('error');
            setFlashVisible(true);
            setFlashExiting(false);
        }
    }, [flash?.message, flash?.error]);

    useEffect(() => {
        if (!flashVisible) return undefined;

        const timer = setTimeout(() => {
            setFlashExiting(true);
            setTimeout(() => {
                setFlashVisible(false);
                setFlashExiting(false);
            }, 220);
        }, 3500);

        return () => clearTimeout(timer);
    }, [flashVisible, flashMessage]);

    const dismissFlash = () => {
        setFlashExiting(true);
        setTimeout(() => {
            setFlashVisible(false);
            setFlashExiting(false);
        }, 220);
    };

    const renderToast = (toastObj, onDismiss, key) => {
        const { message, type, exiting, action } = toastObj;
        const isError = type === 'error';

        return (
            <div
                key={key}
                className={`pointer-events-auto flex w-[min(360px,calc(100vw-2rem))] items-start justify-between gap-3 rounded-xl bg-[#fffaf3] px-4 py-3 text-sm shadow-[0_10px_30px_rgba(50,35,20,0.18)] transition-all duration-200 ${exiting ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'}`}
            >
                <p className={`min-w-0 flex-1 font-semibold leading-5 mt-0.5 ${isError ? 'text-[#8b0000]' : 'text-[#374151]'}`}>{message}</p>
                <div className="flex items-center gap-1 shrink-0">
                    {action && (
                        <button
                            type="button"
                            onClick={() => {
                                action.onClick();
                                onDismiss();
                            }}
                            className="text-xs font-black uppercase tracking-wider text-[#720101] hover:text-[#4a0101] px-2 py-1 rounded hover:bg-[#f5eadb] transition"
                        >
                            {action.label || 'UNDO'}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onDismiss}
                        className="-mr-1 rounded-md p-1 text-[#8a6a46] transition hover:bg-[#f5eadb] hover:text-[#720101]"
                        aria-label="Dismiss notification"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="pointer-events-none fixed bottom-5 right-5 z-[99999] flex max-w-[calc(100vw-2rem)] flex-col-reverse items-end gap-2">
            {flashVisible && renderToast({ message: flashMessage, type: flashType, exiting: flashExiting }, dismissFlash, 'flash-toast')}
            {toasts.map((toast) => (
                renderToast(toast, () => removeToast(toast.id), `toast-${toast.id}`)
            ))}
        </div>
    );
};

export default FlashToast;
