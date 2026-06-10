import React, { useState, useEffect } from 'react';
import { X, Loader2, Upload, Image as ImageIcon } from 'lucide-react';

const csrfToken = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

const typeOptions = [
    { value: 'general', label: '📢 General Announcement' },
    { value: 'promo', label: '🎉 Special Offer' },
    { value: 'event_reminder', label: '📅 Event Reminder' },
    { value: 'holiday_advisory', label: '🏖️ Holiday Advisory' },
    { value: 'menu_update', label: '🍽️ Menu Update' },
    { value: 'service_notice', label: '⚙️ Service Notice' },
    { value: 'urgent', label: '🚨 Urgent / Important Notice' },
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
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [statusMessage, setStatusMessage] = useState('');

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
        setImagePreview(URL.createObjectURL(file));
        setErrors((prev) => {
            const copy = { ...prev };
            delete copy[image_file];
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

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] border border-[#720101]/10 bg-[#fffaf3] p-6 shadow-2xl md:p-8 animate-scaleIn">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#720101]/8 pb-4">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#720101]">Live Editor</span>
                        <h3 className="mt-1 font-display text-2xl font-black text-[#1a1a1a]">Edit Announcement</h3>
                    </div>
                    <button 
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="mt-6 space-y-5">
                    {statusMessage && (
                        <div className={`rounded-xl px-4 py-3 text-xs font-bold text-center ${statusMessage.includes('success') ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                            {statusMessage}
                        </div>
                    )}

                    <div className="grid gap-5 md:grid-cols-2">
                        {/* Title */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-500">Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleTextChange}
                                required
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1a1a1a] shadow-sm focus:border-[#720101] focus:ring-1 focus:ring-[#720101]"
                                placeholder="E.g. Welcome to Eloquente"
                            />
                            {errors.title && <span className="text-[11px] font-semibold text-red-500">{errors.title}</span>}
                        </div>

                        {/* Category */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-500">Category <span className="text-red-500">*</span></label>
                            <select
                                name="type"
                                value={form.type}
                                onChange={handleTextChange}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1a1a1a] shadow-sm focus:border-[#720101] focus:ring-1 focus:ring-[#720101]"
                            >
                                {typeOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-500">Short Summary</label>
                        <textarea
                            name="summary"
                            value={form.summary}
                            onChange={handleTextChange}
                            rows={2}
                            maxLength={500}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1a1a1a] shadow-sm focus:border-[#720101] focus:ring-1 focus:ring-[#720101]"
                            placeholder="A brief preview shown on cards..."
                        />
                        {errors.summary && <span className="text-[11px] font-semibold text-red-500">{errors.summary}</span>}
                    </div>

                    {/* Body */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-500">Full Content / Body</label>
                        <textarea
                            name="body"
                            value={form.body}
                            onChange={handleTextChange}
                            rows={4}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1a1a1a] shadow-sm focus:border-[#720101] focus:ring-1 focus:ring-[#720101]"
                            placeholder="Full details of the announcement..."
                        />
                    </div>

                    {/* Image Upload & Fit */}
                    <div className="grid gap-5 md:grid-cols-2">
                        {/* Image file */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-500">Announcement Image</label>
                            <div className="flex items-center gap-3">
                                {imagePreview ? (
                                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                                        <ImageIcon size={20} />
                                    </div>
                                )}
                                <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm">
                                    <Upload size={14} />
                                    Choose New Image
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            </div>
                            {errors.image_file && <span className="text-[11px] font-semibold text-red-500">{errors.image_file}</span>}
                        </div>

                        {/* Image fit */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-500">Image Fit Behavior</label>
                            <select
                                name="image_fit"
                                value={form.image_fit}
                                onChange={handleTextChange}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-[#1a1a1a] shadow-sm focus:border-[#720101] focus:ring-1 focus:ring-[#720101]"
                            >
                                <option value="fit_text">Text Focus — Cover image background (Sized by text)</option>
                                <option value="fit_image">Image Focus — Show full image (Text below)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {/* CTA Label */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-500">CTA Button Label</label>
                            <input
                                type="text"
                                name="cta_label"
                                value={form.cta_label}
                                onChange={handleTextChange}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1a1a1a] shadow-sm focus:border-[#720101] focus:ring-1 focus:ring-[#720101]"
                                placeholder="E.g. View Details"
                            />
                        </div>

                        {/* CTA URL */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-500">CTA Button URL</label>
                            <input
                                type="text"
                                name="cta_url"
                                value={form.cta_url}
                                onChange={handleTextChange}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1a1a1a] shadow-sm focus:border-[#720101] focus:ring-1 focus:ring-[#720101]"
                                placeholder="E.g. /menu or https://..."
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 border-t border-[#720101]/8 pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-slate-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#720101] px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-[#5a0101] transition shadow-md disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default AnnouncementEditModal;
