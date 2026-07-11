import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ConfirmModal from '../common/ConfirmModal';

const ACCREDITED_VENUES = [
    { 
        id: 'av1', 
        name: 'The Grand Pavilion', 
        address_line: 'Building A, 1st Avenue', 
        street: 'Sample Street Alpha', 
        city: 'quezon-city', 
        isHighRise: false,
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
        capacity: '50 - 200 pax',
        type: 'Indoor / Garden',
        amenities: ['Parking', 'Air conditioning', 'Bridal Suite', 'Catering area'],
        description: 'A luxurious indoor pavilion with an adjacent lush garden, perfect for elegant weddings and corporate galas. Natural light fills the hall during the day, transforming into a romantic softly-lit venue at night.'
    },
    { 
        id: 'av2', 
        name: 'Skyline Penthouse', 
        address_line: 'Tower B, 2nd Level', 
        street: 'Sample Street Beta', 
        city: 'makati', 
        isHighRise: true,
        image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800',
        capacity: '30 - 100 pax',
        type: 'High-rise Indoor',
        amenities: ['Valet Parking', 'Air conditioning', 'City View', 'Lounge'],
        description: 'Experience the breathtaking city skyline in this premium penthouse venue. Ideal for intimate gatherings, exclusive parties, and modern celebrations. Features floor-to-ceiling windows and a stylish lounge.'
    },
    { 
        id: 'av3', 
        name: 'Heritage Grand Hall', 
        address_line: 'Grand Hall, Ground Floor', 
        street: 'Sample Street Gamma', 
        city: 'taguig', 
        isHighRise: false,
        image: 'https://images.unsplash.com/photo-1505368586598-876ce526f633?auto=format&fit=crop&q=80&w=800',
        capacity: '100 - 500 pax',
        type: 'Indoor Banquet',
        amenities: ['Ample Parking', 'Air conditioning', 'High Ceiling', 'Stage'],
        description: 'A classic and spacious banquet hall designed for grand celebrations. With its high ceilings, stunning chandeliers, and built-in stage, it is the ultimate venue for large-scale events and lavish weddings.'
    },
];

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
    const [venueMode, setVenueMode] = useState(bookingData.venueMode || 'own');
    const [formData, setFormData] = useState({
        client_full_name: bookingData.client_full_name || '',
        client_email: bookingData.client_email || user?.email || '',
        client_phone: bookingData.client_phone || user?.phone || '',
        venue_address_line: bookingData.venue_address_line || '',
        venue_street: bookingData.venue_street || '',
        venue_city: bookingData.venue_city || '',
        accredited_venue_id: bookingData.accredited_venue_id || '',
    });
    const [isHighRise, setIsHighRise] = useState(bookingData.isHighRise || false);
    
    // Modal state
    const [selectedVenueDetails, setSelectedVenueDetails] = useState(null);
    
    // City Dropdown state
    const [citySearch, setCitySearch] = useState('');
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
    
    // Autocomplete state
    const [autocompleteQuery, setAutocompleteQuery] = useState(bookingData.venue_address_line || '');
    const [autocompleteResults, setAutocompleteResults] = useState([]);
    const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
    const [autocompleteLoading, setAutocompleteLoading] = useState(false);
    
    // Modal confirmation for city change
    const [cityChangeConfirmModal, setCityChangeConfirmModal] = useState({ isOpen: false, pendingCity: null });
    
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

    // Autocomplete Fetching (Photon API)
    const justSelectedRef = useState({ current: false })[0];
    
    useEffect(() => {
        if (!autocompleteQuery || autocompleteQuery.trim().length < 3 || venueMode === 'accredited') {
            setAutocompleteResults([]);
            return undefined;
        }
        
        // Skip fetch if user just selected a result from the dropdown
        if (justSelectedRef.current) {
            justSelectedRef.current = false;
            return undefined;
        }
        
        const timeoutId = setTimeout(async () => {
            setAutocompleteLoading(true);
            try {
                const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(autocompleteQuery)}&limit=5`);
                const data = await res.json();
                
                const mappedResults = (data.features || []).map(feature => {
                    const p = feature.properties;
                    const display_name = [p.name, p.street, p.city, p.state, p.country].filter(Boolean).join(', ');
                    return {
                        place_id: p.osm_id || Math.random().toString(),
                        display_name: display_name,
                        rawCity: p.city || p.county || p.town || p.district
                    };
                });
                
                const filteredMappedResults = mappedResults.filter(result => {
                    const parts = result.display_name.split(',').map(s => s.trim().toLowerCase());
                    let matchedCity = null;
                    for (const part of parts) {
                        matchedCity = CITY_OPTIONS.find(c => c.label.toLowerCase() === part || part === c.label.toLowerCase() + ' city' || part.includes(c.label.toLowerCase()));
                        if (matchedCity) break;
                    }
                    if (!matchedCity && result.rawCity) {
                        const raw = result.rawCity.toLowerCase();
                        matchedCity = CITY_OPTIONS.find(c => c.label.toLowerCase() === raw || raw === c.label.toLowerCase() + ' city');
                    }
                    return !!matchedCity;
                });
                
                if (mappedResults.length > 0 && filteredMappedResults.length === 0) {
                    setAutocompleteResults([{ outOfScope: true }]);
                } else {
                    setAutocompleteResults(filteredMappedResults);
                }
            } catch (err) {
                console.error("Geocoding error", err);
            } finally {
                setAutocompleteLoading(false);
            }
        }, 500);
        
        return () => clearTimeout(timeoutId);
    }, [autocompleteQuery, venueMode]);

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
            updateBooking({ ...updated, venueDistance: city?.zone || 'metro-manila', venueMode });
            return;
        }

        updateBooking({ ...updated, venueMode });
    };

    const handleSelectCity = (city) => {
        if (formData.venue_address_line && formData.venue_address_line.trim().length > 0) {
            setCityChangeConfirmModal({ isOpen: true, pendingCity: city });
            return;
        }
        executeCityChange(city);
    };

    const executeCityChange = (city) => {
        handleChange({ target: { name: 'venue_city', value: city.value } });
        setIsCityDropdownOpen(false);
        setCitySearch('');
    };

    const handleHighRiseChange = (checked) => {
        setIsHighRise(checked);
        updateBooking({ isHighRise: checked });
    };
    
    const handleSelectAccredited = (venue) => {
        const updated = {
            ...formData,
            accredited_venue_id: venue.id,
            venue_address_line: `${venue.name}, ${venue.address_line}`,
            venue_street: venue.street,
            venue_city: venue.city,
        };
        setFormData(updated);
        setIsHighRise(venue.isHighRise);
        setErrors(prev => ({ ...prev, accredited_venue_id: '' }));
        
        const city = CITY_OPTIONS.find(option => option.value === venue.city);
        updateBooking({ ...updated, venueMode: 'accredited', venueDistance: city?.zone || 'metro-manila', isHighRise: venue.isHighRise });
    };
    
    const handleVenueAddressChange = (e) => {
        setAutocompleteQuery(e.target.value);
        setIsAutocompleteOpen(true);
        handleChange(e);
    };

    const handleAutocompleteSelect = (result) => {
        justSelectedRef.current = true;
        setAutocompleteQuery(result.display_name);
        setIsAutocompleteOpen(false);
        setAutocompleteResults([]);
        
        const updates = { venue_address_line: result.display_name };
        
        const parts = result.display_name.split(',').map(s => s.trim().toLowerCase());
        let matchedCity = null;
        for (const part of parts) {
            matchedCity = CITY_OPTIONS.find(c => c.label.toLowerCase() === part || part === c.label.toLowerCase() + ' city');
            if (matchedCity) break;
        }
        
        if (!matchedCity && result.rawCity) {
            const raw = result.rawCity.toLowerCase();
            matchedCity = CITY_OPTIONS.find(c => c.label.toLowerCase() === raw || raw === c.label.toLowerCase() + ' city');
        }
        
        if (matchedCity) {
            updates.venue_city = matchedCity.value;
        }
        
        Object.entries(updates).forEach(([name, value]) => {
            handleChange({ target: { name, value } });
        });
    };

    const renderAutocompleteResult = (result) => {
        const parts = result.display_name.split(',');
        const title = parts[0];
        const subtitle = parts.slice(1).join(',').trim();
        return (
            <button 
                key={result.place_id} 
                type="button" 
                onClick={() => handleAutocompleteSelect(result)}
                className="flex w-full items-start gap-3 border-b border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50 last:border-0"
            >
                <div className="mt-0.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                </div>
                <div>
                    <div className="font-semibold text-gray-900">{title}</div>
                    <div className="text-xs text-gray-500">{subtitle}</div>
                </div>
            </button>
        );
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

        if (venueMode === 'own') {
            if (!formData.venue_city) {
                newErrors.venue_city = 'Please select a city or municipality from the dropdown list.';
            }
            if (!formData.venue_street.trim() || formData.venue_street.trim().length < 3) {
                newErrors.venue_street = 'Please enter a valid street name (minimum 3 characters).';
            }
            if (!formData.venue_address_line.trim() || formData.venue_address_line.trim().length < 3) {
                newErrors.venue_address_line = 'Please enter a detailed venue address (minimum 3 characters).';
            }
        } else {
            if (!formData.accredited_venue_id) {
                newErrors.accredited_venue_id = 'Please select an accredited venue.';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        updateBooking({ ...formData, venueDistance, isHighRise, venueMode });
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
                        
                        <div className="relative mb-2 mt-4 grid grid-cols-2 rounded-xl border border-[#720101]/10 bg-gray-50 p-1 md:col-span-2">
                            <div className="absolute inset-1 pointer-events-none">
                                <div className={`h-full w-1/2 rounded-lg bg-[#720101] shadow-sm transition-transform duration-300 ease-in-out ${venueMode === 'accredited' ? 'translate-x-full' : 'translate-x-0'}`} />
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setVenueMode('own');
                                    updateBooking({ venueMode: 'own' });
                                }}
                                className={`relative z-10 rounded-lg py-2.5 text-sm font-bold transition-colors duration-300 ${venueMode === 'own' ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Enter my own venue
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setVenueMode('accredited');
                                    updateBooking({ venueMode: 'accredited' });
                                }}
                                className={`relative z-10 rounded-lg py-2.5 text-sm font-bold transition-colors duration-300 ${venueMode === 'accredited' ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Select accredited venue
                            </button>
                        </div>
                        
                        {venueMode === 'accredited' ? (
                            <div className="md:col-span-2">
                                <span className="booking-field-label">Accredited Venue</span>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {ACCREDITED_VENUES.map(venue => (
                                        <div 
                                            key={venue.id}
                                            className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border transition-all ${
                                                formData.accredited_venue_id === venue.id
                                                    ? 'border-[#720101] ring-2 ring-[#720101]'
                                                    : 'border-gray-200 bg-white hover:border-[#720101]/30 hover:shadow-md'
                                            }`}
                                            onClick={() => handleSelectAccredited(venue)}
                                        >
                                            <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                                                <img src={venue.image} alt={venue.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                                            </div>
                                            <div className="flex flex-1 flex-col p-4">
                                                <h3 className="mb-1 font-bold leading-tight text-gray-900">{venue.name}</h3>
                                                <p className="mb-4 text-xs text-gray-500">{CITY_OPTIONS.find(c => c.value === venue.city)?.label}</p>
                                                
                                                <div className="mt-auto flex items-center justify-between gap-2">
                                                    <button 
                                                        type="button" 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedVenueDetails(venue);
                                                        }} 
                                                        className="text-xs font-semibold text-[#720101] hover:underline"
                                                    >
                                                        View details
                                                    </button>
                                                    <div className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                                                            formData.accredited_venue_id === venue.id
                                                                ? 'bg-[#720101] text-white'
                                                                : 'bg-gray-100 text-gray-700'
                                                        }`}
                                                    >
                                                        {formData.accredited_venue_id === venue.id ? 'Selected' : 'Select'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {errors.accredited_venue_id && <p className="mt-2 text-xs font-semibold text-red-600">{errors.accredited_venue_id}</p>}
                            </div>
                        ) : (
                            <>
                                <div>
                                    <span className="booking-field-label">City or municipality</span>
                                    <div className="relative">
                                        <button type="button" onClick={() => setIsCityDropdownOpen(true)} className={`booking-input flex items-center justify-between text-left ${errors.venue_city ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : ''}`}>
                                            <span className={selectedCity ? 'text-gray-900' : 'text-gray-400'}>
                                                {selectedCity ? selectedCity.label : 'Search or select a city'}
                                            </span>
                                            <ChevronDown className="h-5 w-5 text-gray-400" />
                                        </button>
                                        {errors.venue_city && <p className="mt-1 text-xs font-semibold text-red-600">{errors.venue_city}</p>}

                                        {isCityDropdownOpen && (
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
                                    {isCityDropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setIsCityDropdownOpen(false)} />}
                                </div>
                                <label>
                                    <span className="booking-field-label">Street</span>
                                    <input type="text" name="venue_street" placeholder="Street name" minLength="3" value={formData.venue_street} onChange={handleChange} className={`booking-input ${errors.venue_street ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : ''}`} />
                                    {errors.venue_street && <p className="mt-1 text-xs font-semibold text-red-600">{errors.venue_street}</p>}
                                </label>
                                <div className="relative md:col-span-2">
                                    <span className="booking-field-label">Venue address</span>
                                    <input type="text" name="venue_address_line" placeholder="Search for a landmark, building, or event place" minLength="3" value={autocompleteQuery} onChange={handleVenueAddressChange} onFocus={() => setIsAutocompleteOpen(true)} autoComplete="off" className={`booking-input ${errors.venue_address_line ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : ''}`} />
                                    
                                    {isAutocompleteOpen && autocompleteQuery.trim().length >= 3 && (
                                        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                                            {autocompleteLoading ? (
                                                <div className="p-4 text-center text-sm font-medium text-gray-500">Searching landmarks...</div>
                                            ) : autocompleteResults.length > 0 ? (
                                                autocompleteResults[0].outOfScope ? (
                                                    <div className="p-4 text-center text-sm font-semibold text-red-500">The inputted venue is not within our scope of serviced cities.</div>
                                                ) : (
                                                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                                        {autocompleteResults.map(renderAutocompleteResult)}
                                                    </div>
                                                )
                                            ) : (
                                                <div className="p-4 text-center text-sm text-gray-500">No landmarks found. Try another search.</div>
                                            )}
                                        </div>
                                    )}
                                    {isAutocompleteOpen && <div className="fixed inset-0 z-40" onClick={() => setIsAutocompleteOpen(false)} />}
                                    {errors.venue_address_line && <p className="mt-1 text-xs font-semibold text-red-600">{errors.venue_address_line}</p>}
                                </div>
                                <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-[#720101]/30 md:col-span-2">
                                    <input type="checkbox" checked={isHighRise} onChange={(event) => handleHighRiseChange(event.target.checked)} className="mt-1 h-5 w-5 rounded border-gray-300 text-[#720101] focus:ring-[#720101]" />
                                    <span>
                                        <span className="block font-bold text-gray-900">High-rise venue</span>
                                        <span className="mt-1 block text-sm font-medium leading-relaxed text-gray-500">
                                            Select this for basement venues, the 2nd floor and above, or locations that require additional carrying and setup.
                                        </span>
                                    </span>
                                </label>

                                {isHighRise && (
                                    <div className="booking-inline-error border-[#f0aa0b]/40 bg-[#f0aa0b]/10 text-[#6f4a05] md:col-span-2">
                                        A {Math.round((bookingData.package_floor_surcharge_rate ?? businessRules?.floor_surcharge_rate ?? 0.03) * 100)}% floor service charge is added for basement or upper-floor logistics.
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>

            <div className="booking-step-actions">
                <button onClick={onBack} className="booking-secondary-btn">Back</button>
                <button onClick={handleConfirm} className="booking-primary-btn">Continue</button>
            </div>

            {/* Venue Details Modal */}
            {selectedVenueDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
                    <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <button 
                            type="button"
                            onClick={() => setSelectedVenueDetails(null)}
                            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                        >
                            ✕
                        </button>
                        <div className="aspect-[21/9] w-full bg-gray-100">
                            <img src={selectedVenueDetails.image} alt={selectedVenueDetails.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="p-6 md:p-8">
                            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">{selectedVenueDetails.name}</h2>
                                    <p className="text-sm text-gray-500">{selectedVenueDetails.address_line}, {selectedVenueDetails.street}, {CITY_OPTIONS.find(c => c.value === selectedVenueDetails.city)?.label}</p>
                                </div>
                                <div className="shrink-0 rounded-xl bg-[#720101]/5 px-4 py-2 text-center text-[#720101]">
                                    <div className="text-[10px] font-bold uppercase tracking-wider">Capacity</div>
                                    <div className="font-semibold">{selectedVenueDetails.capacity}</div>
                                </div>
                            </div>
                            
                            <div className="mb-6 grid gap-6 md:grid-cols-2">
                                <div>
                                    <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">About the venue</h4>
                                    <p className="text-sm leading-relaxed text-gray-700">{selectedVenueDetails.description}</p>
                                </div>
                                <div>
                                    <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Amenities & Details</h4>
                                    <ul className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                                        <li className="flex items-center gap-2">
                                            <span className="text-[#f0aa0b]">✓</span> {selectedVenueDetails.type}
                                        </li>
                                        {selectedVenueDetails.amenities.map((amenity, idx) => (
                                            <li key={idx} className="flex items-center gap-2">
                                                <span className="text-[#f0aa0b]">✓</span> {amenity}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
                                <button type="button" onClick={() => setSelectedVenueDetails(null)} className="rounded-xl px-6 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-100">
                                    Close
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        handleSelectAccredited(selectedVenueDetails);
                                        setSelectedVenueDetails(null);
                                    }} 
                                    className="rounded-xl bg-[#720101] px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#720101]/30 transition hover:bg-[#5a0000]"
                                >
                                    {formData.accredited_venue_id === selectedVenueDetails.id ? 'Selected' : 'Select this venue'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <ConfirmModal
                isOpen={cityChangeConfirmModal.isOpen}
                title="Change City?"
                message="Warning: Your venue address is already set. If you change the city manually, please ensure it still matches your venue address to avoid logistics issues. Proceed?"
                confirmText="Proceed"
                onConfirm={() => {
                    if (cityChangeConfirmModal.pendingCity) {
                        executeCityChange(cityChangeConfirmModal.pendingCity);
                    }
                    setCityChangeConfirmModal({ isOpen: false, pendingCity: null });
                }}
                onCancel={() => setCityChangeConfirmModal({ isOpen: false, pendingCity: null })}
            />
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
