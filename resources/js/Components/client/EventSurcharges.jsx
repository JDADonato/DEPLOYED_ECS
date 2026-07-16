import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ConfirmModal from '../common/ConfirmModal';

const ACCREDITED_VENUES = [
    // QUEZON CITY
    { 
        id: 'v1', 
        name: 'Light of Love Events Place', 
        address_line: 'Santol St', 
        street: 'Santol St, Quezon City', 
        city: 'quezon-city', 
        isHighRise: false,
        image: '/images/venues/garden_wedding_venue_1783865968868.png',
        capacity: '150 - 500 pax',
        type: 'Garden / Mansion',
        amenities: ['Parking', 'Air conditioning', 'Bridal Suite', 'Lush Gardens', 'Catering area'],
        description: 'A beautiful secret garden and mansion in the heart of Quezon City, offering a romantic and serene atmosphere surrounded by century-old trees and lush landscapes.',
        lat: 14.6067, lng: 121.0116
    },
    { 
        id: 'v2', 
        name: 'UP Balay Kalinaw', 
        address_line: 'UP Diliman Campus', 
        street: 'Guerrero St, UP Diliman', 
        city: 'quezon-city', 
        isHighRise: false,
        image: '/images/venues/classic_mansion_venue_1783865988202.png',
        capacity: '100 - 200 pax',
        type: 'Indoor / Cultural Hall',
        amenities: ['Parking', 'Air conditioning', 'Cultural Ambiance', 'Accessible'],
        description: 'Located inside the quiet UP Diliman campus, Balay Kalinaw provides a classic, peaceful, and intimate setting perfect for weddings and academic events.',
        lat: 14.6599, lng: 121.0729
    },
    { 
        id: 'v3', 
        name: 'UP Bahay ng Alumni', 
        address_line: 'UP Diliman Campus', 
        street: 'Magsaysay Ave, UP Diliman', 
        city: 'quezon-city', 
        isHighRise: false,
        image: '/images/venues/large_event_tent_1783865997801.png',
        capacity: '300 - 1000 pax',
        type: 'Large Indoor Hall',
        amenities: ['Ample Parking', 'High Ceiling', 'Stage', 'Spacious'],
        description: 'A massive, iconic events hall in UP Diliman capable of hosting very large guest counts, ideal for grand weddings, conventions, and major celebrations.',
        lat: 14.6565, lng: 121.0645
    },
    { 
        id: 'v4', 
        name: 'Obispado de Cubao', 
        address_line: 'Lantana St', 
        street: 'Lantana St, Cubao', 
        city: 'quezon-city', 
        isHighRise: false,
        image: '/images/venues/classic_mansion_venue_1783865988202.png',
        capacity: '100 - 200 pax',
        type: 'Indoor Function Hall',
        amenities: ['Air conditioning', 'Secure Parking', 'Elegant Interiors'],
        description: 'Situated within the quiet compounds of the Diocese of Cubao, this venue offers elegant, classic interiors suitable for intimate and medium-sized formal events.',
        lat: 14.6218, lng: 121.0569
    },
    { 
        id: 'v5', 
        name: 'Elements at Centris', 
        address_line: 'Eton Centris', 
        street: 'EDSA cor Quezon Ave', 
        city: 'quezon-city', 
        isHighRise: false,
        image: '/images/venues/large_event_tent_1783865997801.png',
        capacity: '300 - 500 pax',
        type: 'Modern Tent / Hall',
        amenities: ['Air conditioning', 'Ample Parking', 'High Ceiling', 'Modern Architecture'],
        description: 'A fully air-conditioned modern event tent located perfectly along EDSA. It features stunning geometric ceiling designs and is highly accessible.',
        lat: 14.6411, lng: 121.0411
    },
    { 
        id: 'v6', 
        name: 'Gazebo Royale', 
        address_line: 'Visayas Ave', 
        street: 'Visayas Avenue, Project 6', 
        city: 'quezon-city', 
        isHighRise: false,
        image: '/images/venues/garden_wedding_venue_1783865968868.png',
        capacity: '100 - 400 pax',
        type: 'Glass / Garden',
        amenities: ['Air conditioning', 'Pond & Water Features', 'Lush Landscaping', 'Parking'],
        description: 'A sprawling special events venue featuring glass walls, indoor gardens, and water features, bringing the beauty of the outdoors into a comfortable air-conditioned space.',
        lat: 14.6700, lng: 121.0442
    },
    { 
        id: 'v7', 
        name: 'Matrix Creation Events Venue', 
        address_line: 'Malakas St', 
        street: '11 Malakas St, Diliman', 
        city: 'quezon-city', 
        isHighRise: false,
        image: '/images/venues/modern_indoor_hall_1783865978463.png',
        capacity: '100 - 200 pax',
        type: 'Modern Indoor',
        amenities: ['Air conditioning', 'Modern Lighting', 'Stage', 'Parking'],
        description: 'A stylish, contemporary venue in the heart of Diliman, offering customizable LED lighting and modern aesthetics for chic celebrations.',
        lat: 14.6400, lng: 121.0500
    },
    { 
        id: 'v8', 
        name: 'Felicidad Mansions', 
        address_line: 'Roosevelt Ave', 
        street: '2 Baler St cor Roosevelt Ave', 
        city: 'quezon-city', 
        isHighRise: false,
        image: '/images/venues/classic_mansion_venue_1783865988202.png',
        capacity: '100 - 300 pax',
        type: 'Classic Mansion / Indoor',
        amenities: ['Air conditioning', 'Grand Staircase', 'Vintage Architecture', 'Parking'],
        description: 'An elegant, vintage-inspired mansion venue boasting a majestic grand staircase and intricate ceiling designs, perfect for fairytale weddings.',
        lat: 14.6447, lng: 121.0175
    },
    { 
        id: 'v9', 
        name: 'Philam Clubhouse', 
        address_line: 'Philam Life Village', 
        street: 'Philam Homes', 
        city: 'quezon-city', 
        isHighRise: false,
        image: '/images/venues/classic_mansion_venue_1783865988202.png',
        capacity: '50 - 150 pax',
        type: 'Clubhouse / Hall',
        amenities: ['Air conditioning', 'Exclusive Village Security', 'Parking', 'Poolside View'],
        description: 'A cozy and private clubhouse venue nestled inside the highly secure Philam Homes village, ideal for intimate family milestones and small weddings.',
        lat: 14.6320, lng: 121.0480
    },

    // RIZAL AREA
    { 
        id: 'v10', 
        name: '9 Waves Waterpark & Events Place', 
        address_line: 'Guitnang Bayan 1', 
        street: 'San Mateo, Rizal', 
        city: 'san-mateo', 
        isHighRise: false,
        image: '/images/venues/waterpark_event_hall_1783866017708.png',
        capacity: '100 - 300 pax',
        type: 'Resort / Event Hall',
        amenities: ['Air conditioning', 'Resort Access', 'Spacious Parking', 'Scenic Views'],
        description: 'A versatile event hall situated within a waterpark resort in San Mateo, offering a refreshing out-of-town ambiance just outside Metro Manila.',
        lat: 14.6836, lng: 121.1125
    },

    // TAGUIG
    { 
        id: 'v11', 
        name: 'Tent at Acacia Estates', 
        address_line: 'Acacia Estates', 
        street: 'Town Center, Acacia Estates', 
        city: 'taguig', 
        isHighRise: false,
        image: '/images/venues/large_event_tent_1783865997801.png',
        capacity: '300 - 500 pax',
        type: 'Large Tent / Indoor',
        amenities: ['Air conditioning', 'Massive Space', 'High Ceiling', 'Ample Parking'],
        description: 'A massive, fully air-conditioned premier event tent located in the heart of Taguig, capable of housing grand receptions and large corporate events.',
        lat: 14.5214, lng: 121.0650
    },
    { 
        id: 'v12', 
        name: 'The Q Enclave', 
        address_line: 'Calzada-Tipas', 
        street: 'F. Manalo Street', 
        city: 'taguig', 
        isHighRise: false,
        image: '/images/venues/modern_indoor_hall_1783865978463.png',
        capacity: '100 - 300 pax',
        type: 'Modern Events Place',
        amenities: ['Air conditioning', 'Modern Architecture', 'Elegant Lighting', 'Parking'],
        description: 'A highly elegant and modern events venue tucked in Taguig. Featuring stylish architecture and premium interiors perfect for sophisticated celebrations.',
        lat: 14.5306, lng: 121.0764
    },
    { 
        id: 'v13', 
        name: 'DMCI Clubhouse (Casa Real)', 
        address_line: 'Acacia Estates', 
        street: 'Town Center, Acacia Estates', 
        city: 'taguig', 
        isHighRise: true,
        image: '/images/venues/heritage_spanish_venue_1783866008556.png',
        capacity: '70 - 130 pax',
        type: 'Colonial Mansion / Halls',
        amenities: ['Air conditioning', 'Tuason Heritage Design', 'Balconies', 'Exclusive Parking'],
        description: 'A stunning three-storey colonial-inspired venue designed as an homage to the original Tuason residence on Sampaloc Avenue. Perfect for intimate and heritage-themed weddings.',
        lat: 14.5214, lng: 121.0650
    },

    // MANILA
    { 
        id: 'v14', 
        name: 'La Castellana', 
        address_line: 'Intramuros', 
        street: 'Cabildo Street, Intramuros', 
        city: 'manila', 
        isHighRise: false,
        image: '/images/venues/heritage_spanish_venue_1783866008556.png',
        capacity: '150 - 300 pax',
        type: 'Spanish Heritage / Indoor',
        amenities: ['Air conditioning', 'Courtyard', 'Crystal Chandeliers', 'Bridal Suite'],
        description: 'Set within the historic walled city of Intramuros, La Castellana exudes classic Spanish elegance with its breathtaking courtyard and opulent crystal chandeliers.',
        lat: 14.5914, lng: 120.9745
    },
    { 
        id: 'v15', 
        name: 'The Pergola', 
        address_line: 'CCP Complex', 
        street: 'Boom na Boom Compound, Pasay', 
        city: 'pasay', 
        isHighRise: false,
        image: '/images/venues/waterpark_event_hall_1783866017708.png',
        capacity: '150 - 250 pax',
        type: 'Octagonal Hall / Terrace',
        amenities: ['Air conditioning', 'Al Fresco Terrace', 'Panoramic Windows', 'Parking'],
        description: 'An iconic octagonal-shaped venue featuring panoramic windows and a beautiful terrace. Though technically in Pasay, it borders Manila and provides excellent accessibility.',
        lat: 14.5550, lng: 120.9830
    },
    { 
        id: 'v16', 
        name: 'Le Pavillon', 
        address_line: 'Metropolitan Park', 
        street: 'Metrobank Ave, Pasay', 
        city: 'pasay', 
        isHighRise: false,
        image: '/images/venues/large_event_tent_1783865997801.png',
        capacity: '500 - 1000+ pax',
        type: 'Massive Tent / Exhibition Hall',
        amenities: ['Air conditioning', 'Vast Floor Area', 'High Ceiling', 'Huge Parking'],
        description: 'A premium, massively spacious tent venue in the Metropolitan Park area. Highly sought after for monumental weddings, trade shows, and corporate galas.',
        lat: 14.5411, lng: 120.9908
    },
    { 
        id: 'v17', 
        name: 'Le Parc', 
        address_line: 'Metropolitan Park', 
        street: 'Metrobank Ave, Pasay', 
        city: 'pasay', 
        isHighRise: false,
        image: '/images/venues/modern_indoor_hall_1783865978463.png',
        capacity: '200 - 300 pax',
        type: 'Modern Indoor Hall',
        amenities: ['Air conditioning', 'Modern Interiors', 'Glass Walls', 'Ample Parking'],
        description: 'Adjacent to Le Pavillon, Le Parc offers a more modern, sleek, and intimate indoor setting characterized by elegant wood and glass elements.',
        lat: 14.5415, lng: 120.9912
    }
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
        const nameRegex = /^[\p{L}\s\-.]{2,}$/u;
        const name = formData.client_full_name.trim();
        if (!name || name.length < 2 || !nameRegex.test(name)) {
            newErrors.client_full_name = 'Please enter a valid full name (at least 2 characters, letters only).';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (requireEmail && (!formData.client_email.trim() || !emailRegex.test(formData.client_email.trim()))) {
            newErrors.client_email = 'Please enter a valid email address.';
        }

        const phoneRegex = /^(09|\+639)\d{9}$/;
        if (!formData.client_phone.trim() || !phoneRegex.test(formData.client_phone.trim())) {
            newErrors.client_phone = 'Please enter a valid 11-digit Philippine mobile number (e.g., 09123456789).';
        }

        if (venueMode === 'own') {
            if (!formData.venue_city) {
                newErrors.venue_city = 'Please select a city or municipality from the dropdown list.';
            }
            if (formData.venue_address_line.trim() && formData.venue_address_line.trim().length < 3) {
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
                            <input type="text" name="client_full_name" placeholder="Enter your full name" minLength="2" value={formData.client_full_name} onChange={handleChange} className={`booking-input ${errors.client_full_name ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : ''}`} />
                            {errors.client_full_name && <p className="mt-1 text-xs font-semibold text-red-600">{errors.client_full_name}</p>}
                        </label>
                        <label>
                            <span className="booking-field-label">Email address</span>
                            <input type="email" name="client_email" placeholder="your@email.com" minLength="7" value={formData.client_email} onChange={handleChange} className={`booking-input ${errors.client_email ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : ''}`} />
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
                                    <input type="text" name="venue_street" placeholder="Street name (Optional)" value={formData.venue_street} onChange={handleChange} className={`booking-input ${errors.venue_street ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : ''}`} />
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
                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-hidden rounded-3xl bg-white shadow-2xl custom-scrollbar">
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

                            {selectedVenueDetails.lat && selectedVenueDetails.lng && (
                                <div className="mb-5">
                                    <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Location</h4>
                                    <div className="flex gap-3 items-stretch">
                                        <div className="flex-1 overflow-hidden rounded-xl border border-gray-200">
                                            <iframe
                                                title={`Map of ${selectedVenueDetails.name}`}
                                                width="100%"
                                                height="140"
                                                style={{ border: 0, display: 'block' }}
                                                loading="lazy"
                                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedVenueDetails.lng - 0.006}%2C${selectedVenueDetails.lat - 0.004}%2C${selectedVenueDetails.lng + 0.006}%2C${selectedVenueDetails.lat + 0.004}&layer=mapnik&marker=${selectedVenueDetails.lat}%2C${selectedVenueDetails.lng}`}
                                            />
                                        </div>
                                        <div className="flex shrink-0 flex-col items-end justify-between py-1">
                                            <p className="max-w-[140px] text-right text-[11px] leading-snug text-gray-500">{selectedVenueDetails.address_line}, {selectedVenueDetails.street}</p>
                                            <a
                                                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedVenueDetails.lat},${selectedVenueDetails.lng}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#720101] bg-[#720101]/5 px-4 py-1.5 text-xs font-bold text-[#720101] transition hover:bg-[#720101] hover:text-white"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                                Get Directions
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
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
