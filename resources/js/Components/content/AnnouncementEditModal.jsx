import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Upload, Image as ImageIcon, ChevronDown } from 'lucide-react';

const csrfToken = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

const typeOptions = [
    { value: 'general', label: 'General Announcement' },
    { value: 'promo', label: 'Special Offer' },
    { value: 'event_reminder', label: 'Event Reminder' },
    { value: 'holiday_advisory', label: 'Holiday Advisory' },
    { value: 'menu_update', label: 'Menu Update' },
    { value: 'service_notice', label: 'Service Notice' },
    { value: 'urgent', label: 'Urgent / Important Notice' },
];

const fitOptions = [
    { value: 'fit_text', label: 'Cover Background' },
    { value: 'fit_image', label: 'Show Full Image' },
];

const AnnouncementEditModal = ({ isOpen, onClose, announcement, onSave }) => {
    if (!isOpen) return null;

    const [form, setForm] = useState({
        title: '',
        type: 'general',
        summary: '',
        body: '',
        cta_label: '',
        cta_url: '',
        image_fit: 'fit_text',
        image_overlay_enabled: true,
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [statusMessage, setStatusMessage] = useState('');
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [imageFitOpen, setImageFitOpen] = useState(false);

    useEffect(() => {
        if (announcement) {
            setForm({
                title: announcement.title || '',
                type: announcement.type || 'general',
                summary: announcement.summary || '',
                body: announcement.body || '',
                cta_label: announcement.cta_label || '',
                cta_url: announcement.cta_url || '',
                image_fit: announcement.image_fit || 'fit_text',
                image_overlay_enabled: announcement.image_overlay_enabled !== false,
            });
            setImageFile(null);
            
            const path = announcement.image_url || announcement.image_path;
            if (path) {
                const url = (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) 
                    ? path 
                    : `/storage/${path.replace(/^\/+/, '')}`;
                setImagePreview(url);
            } else {
                setImagePreview('');
            }
            setErrors({});
            setStatusMessage('');
        }
    }, [announcement]);

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const copy = { ...prev };
                delete copy[name];
                return copy;
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2048 * 1024) {
            setErrors((prev) => ({ ...prev, image_file: 'Image size must not exceed 2MB' }));
            return;
        }

        setImageFile(file);
        setForm((prev) => ({ ...prev, image_fit: 'fit_text', image_overlay_enabled: true }));
        setImagePreview(URL.createObjectURL(file));
        setErrors((prev) => {
            const copy = { ...prev };
            delete copy.image_file;
            return copy;
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setStatusMessage('');

        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('title', form.title);
        formData.append('type', form.type);
        formData.append('summary', form.summary || '');
        formData.append('body', form.body || '');
        formData.append('cta_label', form.cta_label || '');
        formData.append('cta_url', form.cta_url || '');
        formData.append('image_fit', form.image_fit);
        formData.append('image_overlay_enabled', form.image_overlay_enabled !== false ? '1' : '0');
        
        // Include required fields to satisfy server validation
        formData.append('visibility', announcement.visibility || 'all_customers');
        if (announcement.visibility_roles) {
            announcement.visibility_roles.forEach((r) => formData.append('visibility_roles[]', r));
        } else {
            formData.append('visibility_roles[]', 'Client');
        }
        if (announcement.specific_user_ids) {
            announcement.specific_user_ids.forEach((id) => formData.append('specific_user_ids[]', id));
        }
        if (announcement.starts_at) formData.append('starts_at', announcement.starts_at);
        if (announcement.ends_at) formData.append('ends_at', announcement.ends_at);
        formData.append('send_email', announcement.send_email ? '1' : '0');

        if (imageFile) {
            formData.append('image_file', imageFile);
        } else if (announcement.image_path) {
            formData.append('image_path', announcement.image_path);
        }

        try {
            const response = await fetch(`/api/admin/announcements/${announcement.id}`, {
                method: 'POST', // Laravel uses POST with _method=PATCH for multipart/form-data support
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken(),
                },
                body: formData,
            });

            const payload = await response.json();

            if (!response.ok) {
                if (payload.errors) {
                    setErrors(payload.errors);
                    throw new Error('Please fix the validation errors.');
                }
                throw new Error(payload.message || 'Unable to update announcement.');
            }

            setStatusMessage('Announcement updated successfully!');
            setTimeout(() => {
                onSave(payload);
                onClose();
            }, 800);

        } catch (error) {
            setStatusMessage(error.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-lg max-h-[95vh] overflow-y-auto rounded-[1.5rem] border border-[#720101]/10 bg-[#fffaf3] p-4 shadow-2xl md:p-5 animate-scaleIn">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#720101]/8 pb-2">
                    <h3 className="font-display text-lg font-black text-[#1a1a1a]">Edit Announcement</h3>
                    <button 
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 bg-white p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="mt-3 space-y-3">
                    {statusMessage && (
                        <div className={`rounded-xl px-4 py-2 text-xs font-bold text-center ${statusMessage.includes('success') ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                            {statusMessage}
                        </div>
                    )}

                    <div className="grid gap-3 md:grid-cols-2">
                        {/* Title */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleTextChange}
                                required
                                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#1a1a1a] shadow-sm focus:border-[#720101] focus:ring-1 focus:ring-[#720101]"
                                placeholder="E.g. Welcome to Eloquente"
                            />
                            {errors.title && <span className="text-[10px] font-semibold text-red-500">{errors.title}</span>}
                        </div>

                        {/* Category */}
                        <div className="relative flex flex-col gap-1">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Category <span className="text-red-500">*</span></label>
                            <button
                                type="button"
                                onClick={() => setCategoryOpen(!categoryOpen)}
                                className="flex items-center justify-between w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#1a1a1a] shadow-sm hover:border-slate-300 focus:outline-none focus:border-[#720101] focus:ring-1 focus:ring-[#720101] transition text-left"
                            >
                                <span>{typeOptions.find(o => o.value === form.type)?.label || 'Select Category'}</span>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${categoryOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {categoryOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setCategoryOpen(false)} />
                                    <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-full rounded-xl border border-slate-200 bg-white py-1 shadow-lg max-h-60 overflow-y-auto animate-scaleIn">
                                        {typeOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => {
                                                    setForm(prev => ({ ...prev, type: opt.value }));
                                                    setCategoryOpen(false);
                                                }}
                                                className={`flex items-center w-full text-left px-3 py-1.5 text-sm transition-colors ${form.type === opt.value ? 'bg-[#720101]/8 text-[#720101] font-bold' : 'text-[#1a1a1a] hover:bg-slate-50'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Short Summary</label>
                        <textarea
                            name="summary"
                            value={form.summary}
                            onChange={handleTextChange}
                            rows="2"
                            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#1a1a1a] shadow-sm focus:border-[#720101] focus:ring-1 focus:ring-[#720101] resize-none"
                            placeholder="One or two lines customers can scan quickly."
                        />
                    </div>

                    {/* Body */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Full Message</label>
                        <textarea
                            name="body"
                            value={form.body}
                            onChange={handleTextChange}
                            rows="4"
                            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#1a1a1a] shadow-sm focus:border-[#720101] focus:ring-1 focus:ring-[#720101] resize-none"
                            placeholder="Add the full update, advisory, promo, or reminder."
                        />
                    </div>

                    {/* Image Upload & Fit */}
                    <div className="grid gap-3 md:grid-cols-2">
                        {/* Image file */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Announcement Image</label>
                            <div className="flex items-center gap-3">
                                {imagePreview ? (
                                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                                        <ImageIcon size={16} />
                                    </div>
                                )}
                                <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm">
                                    <Upload size={12} />
                                    Choose Image
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            </div>
                            {errors.image_file && <span className="text-[10px] font-semibold text-red-500">{errors.image_file}</span>}
                        </div>

                        {/* Image fit */}
                        <div className="relative flex flex-col gap-1">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Image Fit Behavior</label>
                            <button
                                type="button"
                                onClick={() => setImageFitOpen(!imageFitOpen)}
                                className="flex items-center justify-between w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#1a1a1a] shadow-sm hover:border-slate-300 focus:outline-none focus:border-[#720101] focus:ring-1 focus:ring-[#720101] transition text-left"
                            >
                                <span>{fitOptions.find(o => o.value === form.image_fit)?.label || 'Select fit behavior'}</span>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${imageFitOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {imageFitOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setImageFitOpen(false)} />
                                    <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-full rounded-xl border border-slate-200 bg-white py-1 shadow-lg animate-scaleIn">
                                        {fitOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => {
                                                    setForm(prev => ({ ...prev, image_fit: opt.value }));
                                                    setImageFitOpen(false);
                                                }}
                                                className={`flex items-center w-full text-left px-3 py-1.5 text-sm transition-colors ${form.image_fit === opt.value ? 'bg-[#720101]/8 text-[#720101] font-bold' : 'text-[#1a1a1a] hover:bg-slate-50'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {imagePreview && form.image_fit === 'fit_text' && (
                        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 border border-slate-200">
                            <div className="flex-1">
                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">Apply Dark Overlay</p>
                                <p className="text-xs text-slate-500">Makes text readable over the background image.</p>
                            </div>
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    checked={form.image_overlay_enabled}
                                    onChange={(e) => setForm(prev => ({ ...prev, image_overlay_enabled: e.target.checked }))}
                                    className="peer sr-only"
                                />
                                <div className="peer h-5 w-9 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#720101] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                            </label>
                        </div>
                    )}

                    <div className="grid gap-3 md:grid-cols-2">
                        {/* CTA Label */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">CTA Button Label</label>
                            <input
                                type="text"
                                name="cta_label"
                                value={form.cta_label}
                                onChange={handleTextChange}
                                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#1a1a1a] shadow-sm focus:border-[#720101] focus:ring-1 focus:ring-[#720101]"
                                placeholder="E.g. View Details"
                            />
                        </div>

                        {/* CTA URL */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">CTA Button URL</label>
                            <input
                                type="text"
                                name="cta_url"
                                value={form.cta_url}
                                onChange={handleTextChange}
                                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#1a1a1a] shadow-sm focus:border-[#720101] focus:ring-1 focus:ring-[#720101]"
                                placeholder="E.g. /menu or https://..."
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-2 border-t border-[#720101]/8 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-slate-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#720101] px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-[#5a0101] transition shadow-md disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={13} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AnnouncementEditModal;
