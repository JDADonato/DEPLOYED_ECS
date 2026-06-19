import React, { useState, useEffect, useMemo } from 'react';
import { fetchMenuItemsFromAPI } from '../../utils/menuUtils';

const MenuPickerModal = ({ isOpen, onClose, onSelect, initialSelections = [], maxSelections = 5 }) => {
    const [menuItems, setMenuItems] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(initialSelections);

    useEffect(() => {
        if (isOpen && !menuItems) {
            fetchMenuItems();
        }
    }, [isOpen]);

    useEffect(() => {
        setSelected(initialSelections);
    }, [initialSelections, isOpen]);

    const fetchMenuItems = async () => {
        setLoading(true);
        try {
            const organizedData = await fetchMenuItemsFromAPI();
            setMenuItems(organizedData);
        } catch (error) {
            console.error('Failed to fetch menu items', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelection = (item) => {
        const isSelected = selected.some(s => s.id === item.id);
        if (isSelected) {
            setSelected(selected.filter(s => s.id !== item.id));
        } else {
            if (selected.length >= maxSelections) return;
            setSelected([...selected, { id: item.id, name: item.name }]);
        }
    };

    const handleConfirm = () => {
        onSelect(selected);
        onClose();
    };

    const filteredItems = useMemo(() => {
        if (!menuItems) return null;
        
        const filtered = {};
        let hasItems = false;
        
        Object.keys(menuItems).forEach(category => {
            const items = menuItems[category];
            const filteredCategoryItems = items.filter(item => 
                !search || item.name.toLowerCase().includes(search.toLowerCase())
            );
            
            if (filteredCategoryItems.length > 0) {
                filtered[category] = filteredCategoryItems;
                hasItems = true;
            }
        });
        
        return hasItems ? filtered : null;
    }, [menuItems, search]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-4xl overflow-hidden rounded-[1.75rem] border border-[#720101]/10 bg-white shadow-2xl transform transition-all scale-100 animate-scaleIn">
                <div className="p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black font-display text-slate-900">Request Dishes to Taste</h3>
                            <p className="mt-1 text-sm font-medium text-slate-500">
                                Select up to {maxSelections} dishes you'd like to sample. ({selected.length}/{maxSelections} selected)
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="mb-4 relative">
                        <svg className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input 
                            type="text" 
                            placeholder="Search menu items..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)} 
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#720101]/20 text-sm font-medium placeholder-slate-400"
                        />
                    </div>

                    <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar mb-6">
                        {loading || !filteredItems ? (
                            <div className="flex justify-center py-8">
                                <div className="w-6 h-6 border-2 border-[#720101] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : Object.keys(filteredItems).length > 0 ? (
                            Object.keys(filteredItems).map(category => (
                                <div key={category} className="mb-6 last:mb-0">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3 px-1">{category}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {filteredItems[category].map(item => {
                                            const isSelected = selected.some(s => s.id === item.id);
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => toggleSelection(item)}
                                                    disabled={!isSelected && selected.length >= maxSelections}
                                                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${isSelected ? 'border-[#720101] bg-[#720101]/5 ring-1 ring-[#720101]' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'}`}
                                                >
                                                    <div className="flex-1 min-w-0 pr-2">
                                                        <p className={`font-bold text-sm truncate ${isSelected ? 'text-[#720101]' : 'text-slate-900 group-hover:text-[#720101]'}`}>{item.name}</p>
                                                    </div>
                                                    <div className={`shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-[#720101] border-[#720101]' : 'border-slate-300'}`}>
                                                        {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-500 text-sm font-medium">No menu items found.</div>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                        <button onClick={handleConfirm} className="px-6 py-2.5 text-sm font-bold text-white bg-[#720101] rounded-xl hover:bg-[#5a0101] transition-colors shadow-lg shadow-[#720101]/20">Confirm Selection</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuPickerModal;
