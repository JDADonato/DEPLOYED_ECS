import { useEffect, useState } from 'react';


const CITY_OPTIONS = [
    { value: 'caloocan', label: 'Caloocan', zone: 'metro-manila', fee: 0 },
    { value: 'las-pinas', label: 'Las Pinas', zone: 'metro-manila', fee: 0 },
    { value: 'makati', label: 'Makati', zone: 'metro-manila', fee: 0 },
    { value: 'malabon', label: 'Malabon', zone: 'metro-manila', fee: 0 },
    { value: 'mandaluyong', label: 'Mandaluyong', zone: 'metro-manila', fee: 0 },
    { value: 'manila', label: 'Manila', zone: 'metro-manila', fee: 0 },
    { value: 'marikina', label: 'Marikina', zone: 'metro-manila', fee: 0 },
    { value: 'muntinlupa', label: 'Muntinlupa', zone: 'metro-manila', fee: 0 },
    { value: 'navotas', label: 'Navotas', zone: 'metro-manila', fee: 0 },
    { value: 'paranaque', label: 'Paranaque', zone: 'metro-manila', fee: 0 },
    { value: 'pasay', label: 'Pasay', zone: 'metro-manila', fee: 0 },
    { value: 'pasig', label: 'Pasig', zone: 'metro-manila', fee: 0 },
    { value: 'pateros', label: 'Pateros', zone: 'metro-manila', fee: 0 },
    { value: 'quezon-city', label: 'Quezon City', zone: 'metro-manila', fee: 0 },
    { value: 'san-juan', label: 'San Juan', zone: 'metro-manila', fee: 0 },
    { value: 'taguig', label: 'Taguig', zone: 'metro-manila', fee: 0 },
    { value: 'valenzuela', label: 'Valenzuela', zone: 'metro-manila', fee: 0 },
    { value: 'antipolo', label: 'Antipolo', zone: 'outside-16-30', fee: 1500 },
    { value: 'bacoor', label: 'Bacoor', zone: 'outside-16-30', fee: 1500 },
    { value: 'binan', label: 'Binan', zone: 'outside-16-30', fee: 1500 },
    { value: 'cainta', label: 'Cainta', zone: 'outside-16-30', fee: 1500 },
    { value: 'dasmarinas', label: 'Dasmarinas', zone: 'outside-16-30', fee: 1500 },
    { value: 'imus', label: 'Imus', zone: 'outside-16-30', fee: 1500 },
    { value: 'meycauayan', label: 'Meycauayan', zone: 'outside-16-30', fee: 1500 },
    { value: 'san-pedro', label: 'San Pedro', zone: 'outside-16-30', fee: 1500 },
    { value: 'taytay', label: 'Taytay', zone: 'outside-16-30', fee: 1500 },
    { value: 'rodriguez', label: 'Rodriguez (Montalban)', zone: 'outside-16-30', fee: 1500 },
    { value: 'angono', label: 'Angono', zone: 'outside-31-50', fee: 3000 },
    { value: 'binangonan', label: 'Binangonan', zone: 'outside-31-50', fee: 3000 },
    { value: 'cabuyao', label: 'Cabuyao', zone: 'outside-31-50', fee: 3000 },
    { value: 'carmona', label: 'Carmona', zone: 'outside-31-50', fee: 3000 },
    { value: 'general-trias', label: 'General Trias', zone: 'outside-31-50', fee: 3000 },
    { value: 'santa-rosa', label: 'Santa Rosa', zone: 'outside-31-50', fee: 3000 },
    { value: 'silang', label: 'Silang', zone: 'outside-31-50', fee: 3000 },
    { value: 'san-mateo', label: 'San Mateo', zone: 'outside-31-50', fee: 3000 },
    { value: 'norzagaray', label: 'Norzagaray', zone: 'outside-31-50', fee: 3000 },
    { value: 'teresa', label: 'Teresa', zone: 'outside-31-50', fee: 3000 },
];

const EventSurcharges = ({ bookingData, businessRules = {}, updateBooking, onNext, onBack, user, requireEmail = true }) => {
    const [formData, setFormData] = useState({
        client_full_name: bookingData.client_full_name || '',
        client_email: bookingData.client_email || user?.email || '',
        client_phone: bookingData.client_phone || user?.phone || '',
        venue_address_line: bookingData.venue_address_line || '',
        venue_street: bookingData.venue_street || '',
        venue_city: bookingData.venue_city || '',
    });
    const [isHighRise, setIsHighRise] = useState(bookingData.isHighRise || false);
    const [citySearch, setCitySearch] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                client_email: prev.client_email || user.email || '',
                client_phone: prev.client_phone || user.phone || '',
            }));
        }
    }, [user]);

    const selectedCity = CITY_OPTIONS.find(city => city.value === formData.venue_city);
    const venueDistance = selectedCity?.zone || 'metro-manila';
    const locationSurcharge = venueDistance !== 'metro-manila'
        ? Math.round((bookingData.totalCost || 0) * (bookingData.package_location_surcharge_rate || 0.20))
        : 0;

    const filteredCities = CITY_OPTIONS.filter(city => city.label.toLowerCase().includes(citySearch.toLowerCase()));
    const metroCities = filteredCities.filter(city => city.zone === 'metro-manila');
    const nearCities = filteredCities.filter(city => city.zone === 'outside-16-30');
    const farCities = filteredCities.filter(city => city.zone === 'outside-31-50');

    const handleChange = (event) => {
        const updated = { ...formData, [event.target.name]: event.target.value };
        setFormData(updated);

        if (errors[event.target.name]) {
            setErrors(prev => ({ ...prev, [event.target.name]: '' }));
        }

        if (event.target.name === 'venue_city') {
            const city = CITY_OPTIONS.find(option => option.value === event.target.value);
            updateBooking({ ...updated, venueDistance: city?.zone || 'metro-manila' });
            return;
        }

        updateBooking(updated);
    };

    const handleSelectCity = (city) => {
        handleChange({ target: { name: 'venue_city', value: city.value } });
        setIsDropdownOpen(false);
        setCitySearch('');
    };

    const handleHighRiseChange = (checked) => {
        setIsHighRise(checked);
        updateBooking({ isHighRise: checked });
    };

    const handleConfirm = () => {
        const newErrors = {};
        const nameRegex = /^[a-zA-Z\s\-.]{2,}$/;
        const name = formData.client_full_name.trim();
        if (!name || name.length < 2 || !nameRegex.test(name)) {
            newErrors.client_full_name = 'Please enter a valid full name (at least 2 characters, letters only).';
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (requireEmail && (!formData.client_email.trim() || !emailRegex.test(formData.client_email.trim()))) {
            newErrors.client_email = 'Please enter a valid email address with at least 3 characters before the @ symbol.';
        }

        const phoneRegex = /^(09|\+639)\d{9}$/;
        if (!formData.client_phone.trim() || !phoneRegex.test(formData.client_phone.trim())) {
            newErrors.client_phone = 'Please enter a valid 11-digit Philippine mobile number (e.g., 09123456789).';
        }

        if (!formData.venue_address_line.trim() || formData.venue_address_line.trim().length < 3) {
            newErrors.venue_address_line = 'Please enter a detailed venue address (minimum 3 characters).';
        }

        if (!formData.venue_street.trim() || formData.venue_street.trim().length < 3) {
            newErrors.venue_street = 'Please enter a valid street name (minimum 3 characters).';
        }

        if (!formData.venue_city) {
            newErrors.venue_city = 'Please select a city or municipality from the dropdown list.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        updateBooking({ ...formData, venueDistance, isHighRise });
        onNext(true);
    };

    return (
        <div className="booking-step animate-fadeIn">


            <div className="booking-step-grid">
                <section className="booking-step-panel">
                    <p className="booking-step-kicker">Contact and venue</p>
                    <h2>Where is your event?</h2>
                    <p className="booking-step-copy">
                        Add the contact person and venue address so the team can confirm logistics and any location fees.
                    </p>

                    <div className="booking-detail-summary">
                        <div>
                            <span>Location fee</span>
                            <strong>{locationSurcharge > 0 ? `PHP ${locationSurcharge.toLocaleString()}` : 'Included'}</strong>
                        </div>
                        <div>
                            <span>Venue access</span>
                            <strong>{isHighRise ? 'High-rise' : 'Standard'}</strong>
                        </div>
                    </div>
                </section>

                <section className="booking-choice-area">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <label className="md:col-span-2">
                            <span className="booking-field-label">Full name</span>
                            <input type="text" name="client_full_name" placeholder="Enter your full name" minLength="2" pattern="^[a-zA-Z\s\-.]{2,}$" value={formData.client_full_name} onChange={handleChange} className={`booking-input ${errors.client_full_name ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : ''}`} />
                            {errors.client_full_name && <p className="mt-1 text-xs font-semibold text-red-600">{errors.client_full_name}</p>}
                        </label>
                        <label>
                            <span className="booking-field-label">Email address</span>
                            <input type="email" name="client_email" placeholder="your@email.com" minLength="7" pattern="^[a-zA-Z0-9._%+\-]{3,}@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$" value={formData.client_email} onChange={handleChange} className={`booking-input ${errors.client_email ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : ''}`} />
                            {errors.client_email && <p className="mt-1 text-xs font-semibold text-red-600">{errors.client_email}</p>}
                        </label>
                        <label>
                            <span className="booking-field-label">Mobile number</span>
                            <input type="tel" name="client_phone" placeholder="Mobile number" minLength="11" maxLength="13" value={formData.client_phone} onChange={handleChange} className={`booking-input ${errors.client_phone ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : ''}`} pattern="^(09|\+639)\d{9}$" title="Please enter a valid Philippine mobile number (e.g., 09123456789 or +639123456789)" />
                            {errors.client_phone && <p className="mt-1 text-xs font-semibold text-red-600">{errors.client_phone}</p>}
                        </label>
                        <label className="md:col-span-2">
                            <span className="booking-field-label">Venue address</span>
                            <input type="text" name="venue_address_line" placeholder="Building, block, lot, unit, or venue name" minLength="3" value={formData.venue_address_line} onChange={handleChange} className={`booking-input ${errors.venue_address_line ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : ''}`} />
                            {errors.venue_address_line && <p className="mt-1 text-xs font-semibold text-red-600">{errors.venue_address_line}</p>}
                        </label>
                        <label>
                            <span className="booking-field-label">Street</span>
                            <input type="text" name="venue_street" placeholder="Street name" minLength="3" value={formData.venue_street} onChange={handleChange} className={`booking-input ${errors.venue_street ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : ''}`} />
                            {errors.venue_street && <p className="mt-1 text-xs font-semibold text-red-600">{errors.venue_street}</p>}
                        </label>
                        <div>
                            <span className="booking-field-label">City or municipality</span>
                            <div className="relative">
                                <button type="button" onClick={() => setIsDropdownOpen(true)} className={`booking-input flex items-center justify-between text-left ${errors.venue_city ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : ''}`}>
                                    <span className={selectedCity ? 'text-gray-900' : 'text-gray-400'}>
                                        {selectedCity ? selectedCity.label : 'Search or select a city'}
                                    </span>
                                    <span className="text-gray-400">v</span>
                                </button>
                                {errors.venue_city && <p className="mt-1 text-xs font-semibold text-red-600">{errors.venue_city}</p>}

                                {isDropdownOpen && (
                                    <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                                        <div className="border-b border-gray-100 p-3">
                                            <input type="text" className="booking-input py-3 text-sm" placeholder="Search city" value={citySearch} onChange={(event) => setCitySearch(event.target.value)} autoFocus />
                                        </div>
                                        <div className="max-h-64 overflow-y-auto py-2" onClick={(event) => event.stopPropagation()}>
                                            {filteredCities.length === 0 ? (
                                                <div className="px-4 py-3 text-sm font-medium text-gray-500">No cities found.</div>
                                            ) : (
                                                <>
                                                    {metroCities.length > 0 && <CityGroup title="Metro Manila" feeLabel="Included" cities={metroCities} selectedValue={formData.venue_city} onSelect={handleSelectCity} />}
                                                    {nearCities.length > 0 && <CityGroup title="Nearby areas" feeLabel={`+${Math.round((businessRules?.location_surcharge_rate !== undefined ? businessRules.location_surcharge_rate : 0.20) * 100)}%`} cities={nearCities} selectedValue={formData.venue_city} onSelect={handleSelectCity} />}
                                                    {farCities.length > 0 && <CityGroup title="Extended service area" feeLabel={`+${Math.round((businessRules?.location_surcharge_rate !== undefined ? businessRules.location_surcharge_rate : 0.20) * 100)}%`} cities={farCities} selectedValue={formData.venue_city} onSelect={handleSelectCity} />}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {isDropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />}
                        </div>

                        <label className="md:col-span-2 flex cursor-pointer items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-[#720101]/30">
                            <input type="checkbox" checked={isHighRise} onChange={(event) => handleHighRiseChange(event.target.checked)} className="mt-1 h-5 w-5 rounded border-gray-300 text-[#720101] focus:ring-[#720101]" />
                            <span>
                                <span className="block font-bold text-gray-900">High-rise venue</span>
                                <span className="mt-1 block text-sm font-medium leading-relaxed text-gray-500">
                                    Select this for basement venues, the 2nd floor and above, or locations that require additional carrying and setup.
                                </span>
                            </span>
                        </label>

                            {isHighRise && (
                                <div className="md:col-span-2 booking-inline-error border-[#f0aa0b]/40 bg-[#f0aa0b]/10 text-[#6f4a05]">
                                    A {Math.round((bookingData.package_floor_surcharge_rate ?? businessRules?.floor_surcharge_rate ?? 0.03) * 100)}% floor service charge is added for basement or upper-floor logistics.
                                </div>
                            )}
                    </div>
                </section>
            </div>

            <div className="booking-step-actions">
                <button onClick={onBack} className="booking-secondary-btn">Back</button>
                <button onClick={handleConfirm} className="booking-primary-btn">Continue</button>
            </div>
        </div>
    );
};

const CityGroup = ({ title, feeLabel, cities, selectedValue, onSelect }) => (
    <div className="py-1">
        <div className="flex items-center justify-between px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
            <span>{title}</span>
            <span>{feeLabel}</span>
        </div>
        {cities.map(city => (
            <button
                key={city.value}
                type="button"
                onClick={() => onSelect(city)}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold transition ${selectedValue === city.value ? 'bg-[#fff8ea] text-[#720101]' : 'text-gray-700 hover:bg-gray-50'}`}
            >
                <span>{city.label}</span>
                {selectedValue === city.value && <span className="text-[#f0aa0b]">Selected</span>}
            </button>
        ))}
    </div>
);

export default EventSurcharges;
