import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, Search, ChevronDown } from 'lucide-react';

const countries = [
    { name: "Global", code: "GL", flag: "🌐" },
    { name: "Afghanistan", code: "AF", flag: "🇦🇫" },
    { name: "Albania", code: "AL", flag: "🇦🇱" },
    { name: "Algeria", code: "DZ", flag: "🇩🇿" },
    { name: "Andorra", code: "AD", flag: "🇦🇩" },
    { name: "Angola", code: "AO", flag: "🇦🇴" },
    { name: "Antigua and Barbuda", code: "AG", flag: "🇦🇬" },
    { name: "Argentina", code: "AR", flag: "🇦🇷" },
    { name: "Armenia", code: "AM", flag: "🇦🇲" },
    { name: "Australia", code: "AU", flag: "🇦🇺" },
    { name: "Austria", code: "AT", flag: "🇦🇹" },
    { name: "Azerbaijan", code: "AZ", flag: "🇦🇿" },
    { name: "Bahamas", code: "BS", flag: "🇧🇸" },
    { name: "Bahrain", code: "BH", flag: "🇧🇭" },
    { name: "Bangladesh", code: "BD", flag: "🇧🇩" },
    { name: "Barbados", code: "BB", flag: "🇧🇧" },
    { name: "Belarus", code: "BY", flag: "🇧🇾" },
    { name: "Belgium", code: "BE", flag: "🇧🇪" },
    { name: "Belize", code: "BZ", flag: "🇧🇿" },
    { name: "Benin", code: "BJ", flag: "🇧🇯" },
    { name: "Bhutan", code: "BT", flag: "🇧🇹" },
    { name: "Bolivia", code: "BO", flag: "🇧🇴" },
    { name: "Bosnia and Herzegovina", code: "BA", flag: "🇧🇦" },
    { name: "Botswana", code: "BW", flag: "🇧🇼" },
    { name: "Brazil", code: "BR", flag: "🇧🇷" },
    { name: "Brunei", code: "BN", flag: "🇧🇳" },
    { name: "Bulgaria", code: "BG", flag: "🇧🇬" },
    { name: "Burkina Faso", code: "BF", flag: "🇧🇫" },
    { name: "Burundi", code: "BI", flag: "🇧🇮" },
    { name: "Cambodia", code: "KH", flag: "🇰🇭" },
    { name: "Cameroon", code: "CM", flag: "🇨🇲" },
    { name: "Canada", code: "CA", flag: "🇨🇦" },
    { name: "Central African Republic", code: "CF", flag: "🇨🇫" },
    { name: "Chad", code: "TD", flag: "🇹🇩" },
    { name: "Chile", code: "CL", flag: "🇨🇱" },
    { name: "China", code: "CN", flag: "🇨🇳" },
    { name: "Colombia", code: "CO", flag: "🇨🇴" },
    { name: "Comoros", code: "KM", flag: "🇰🇲" },
    { name: "Congo (Brazzaville)", code: "CG", flag: "🇨🇬" },
    { name: "Congo (Kinshasa)", code: "CD", flag: "🇨🇩" },
    { name: "Costa Rica", code: "CR", flag: "🇨🇷" },
    { name: "Croatia", code: "HR", flag: "🇭🇷" },
    { name: "Cuba", code: "CU", flag: "🇨🇺" },
    { name: "Cyprus", code: "CY", flag: "🇨🇾" },
    { name: "Czech Republic", code: "CZ", flag: "🇨🇿" },
    { name: "Denmark", code: "DK", flag: "🇩🇰" },
    { name: "Djibouti", code: "DJ", flag: "🇩🇯" },
    { name: "Dominica", code: "DM", flag: "🇩🇲" },
    { name: "Dominican Republic", code: "DO", flag: "🇩🇴" },
    { name: "Ecuador", code: "EC", flag: "🇪🇨" },
    { name: "Egypt", code: "EG", flag: "🇪🇬" },
    { name: "El Salvador", code: "SV", flag: "🇸🇻" },
    { name: "Equatorial Guinea", code: "GQ", flag: "🇬🇶" },
    { name: "Eritrea", code: "ER", flag: "🇪🇷" },
    { name: "Estonia", code: "EE", flag: "🇪🇪" },
    { name: "Ethiopia", code: "ET", flag: "🇪🇹" },
    { name: "Fiji", code: "FJ", flag: "🇫🇯" },
    { name: "Finland", code: "FI", flag: "🇫🇮" },
    { name: "France", code: "FR", flag: "🇫🇷" },
    { name: "Gabon", code: "GA", flag: "🇬🇦" },
    { name: "Gambia", code: "GM", flag: "🇬🇲" },
    { name: "Georgia", code: "GE", flag: "🇬🇪" },
    { name: "Germany", code: "DE", flag: "🇩🇪" },
    { name: "Ghana", code: "GH", flag: "🇬🇭" },
    { name: "Greece", code: "GR", flag: "🇬🇷" },
    { name: "Grenada", code: "GD", flag: "🇬🇩" },
    { name: "Guatemala", code: "GT", flag: "🇬🇹" },
    { name: "Guinea", code: "GN", flag: "🇬🇳" },
    { name: "Guinea-Bissau", code: "GW", flag: "🇬🇼" },
    { name: "Guyana", code: "GY", flag: "🇬🇾" },
    { name: "Haiti", code: "HT", flag: "🇭🇹" },
    { name: "Honduras", code: "HN", flag: "🇭🇳" },
    { name: "Hungary", code: "HU", flag: "🇭🇺" },
    { name: "Iceland", code: "IS", flag: "🇮🇸" },
    { name: "India", code: "IN", flag: "🇮🇳" },
    { name: "Indonesia", code: "ID", flag: "🇮🇩" },
    { name: "Iran", code: "IR", flag: "🇮🇷" },
    { name: "Iraq", code: "IQ", flag: "🇮🇶" },
    { name: "Ireland", code: "IE", flag: "🇮🇪" },
    { name: "Israel", code: "IL", flag: "🇮🇱" },
    { name: "Italy", code: "IT", flag: "🇮🇹" },
    { name: "Jamaica", code: "JM", flag: "🇯🇲" },
    { name: "Japan", code: "JP", flag: "🇯🇵" },
    { name: "Jordan", code: "JO", flag: "🇯🇴" },
    { name: "Kazakhstan", code: "KZ", flag: "🇰🇿" },
    { name: "Kenya", code: "KE", flag: "🇰🇪" },
    { name: "Kiribati", code: "KI", flag: "🇰🇮" },
    { name: "Kuwait", code: "KW", flag: "🇰🇼" },
    { name: "Kyrgyzstan", code: "KG", flag: "🇰🇬" },
    { name: "Laos", code: "LA", flag: "🇱🇦" },
    { name: "Latvia", code: "LV", flag: "🇱🇻" },
    { name: "Lebanon", code: "LB", flag: "🇱🇧" },
    { name: "Lesotho", code: "LS", flag: "🇱🇸" },
    { name: "Liberia", code: "LR", flag: "🇱🇷" },
    { name: "Libya", code: "LY", flag: "🇱🇾" },
    { name: "Liechtenstein", code: "LI", flag: "🇱🇮" },
    { name: "Lithuania", code: "LT", flag: "🇱🇹" },
    { name: "Luxembourg", code: "LU", flag: "🇱🇺" },
    { name: "Madagascar", code: "MG", flag: "🇲🇬" },
    { name: "Malawi", code: "MW", flag: "🇲🇼" },
    { name: "Malaysia", code: "MY", flag: "🇲🇾" },
    { name: "Maldives", code: "MV", flag: "🇲🇻" },
    { name: "Mali", code: "ML", flag: "🇲🇱" },
    { name: "Malta", code: "MT", flag: "🇲🇹" },
    { name: "Marshall Islands", code: "MH", flag: "🇲🇭" },
    { name: "Mauritania", code: "MR", flag: "🇲🇷" },
    { name: "Mauritius", code: "MU", flag: "🇲🇺" },
    { name: "Mexico", code: "MX", flag: "🇲🇽" },
    { name: "Micronesia", code: "FM", flag: "🇫🇲" },
    { name: "Moldova", code: "MD", flag: "🇲🇩" },
    { name: "Monaco", code: "MC", flag: "🇲🇨" },
    { name: "Mongolia", code: "MN", flag: "🇲🇳" },
    { name: "Montenegro", code: "ME", flag: "🇲🇪" },
    { name: "Morocco", code: "MA", flag: "🇲🇦" },
    { name: "Mozambique", code: "MZ", flag: "🇲🇿" },
    { name: "Myanmar", code: "MM", flag: "🇲🇲" },
    { name: "Namibia", code: "NA", flag: "🇳🇦" },
    { name: "Nauru", code: "NR", flag: "🇳🇷" },
    { name: "Nepal", code: "NP", flag: "🇳🇵" },
    { name: "Netherlands", code: "NL", flag: "🇳🇱" },
    { name: "New Zealand", code: "NZ", flag: "🇳🇿" },
    { name: "Nicaragua", code: "NI", flag: "🇳🇮" },
    { name: "Niger", code: "NE", flag: "🇳🇪" },
    { name: "Nigeria", code: "NG", flag: "🇳🇬" },
    { name: "North Korea", code: "KP", flag: "🇰🇵" },
    { name: "North Macedonia", code: "MK", flag: "🇲🇰" },
    { name: "Norway", code: "NO", flag: "🇳🇴" },
    { name: "Oman", code: "OM", flag: "🇴🇲" },
    { name: "Pakistan", code: "PK", flag: "🇵🇰" },
    { name: "Palau", code: "PW", flag: "🇵🇼" },
    { name: "Palestine", code: "PS", flag: "🇵🇸" },
    { name: "Panama", code: "PA", flag: "🇵🇦" },
    { name: "Papua New Guinea", code: "PG", flag: "🇵🇬" },
    { name: "Paraguay", code: "PY", flag: "🇵🇾" },
    { name: "Peru", code: "PE", flag: "🇵🇪" },
    { name: "Philippines", code: "PH", flag: "🇵🇭" },
    { name: "Poland", code: "PL", flag: "🇵🇱" },
    { name: "Portugal", code: "PT", flag: "🇵🇹" },
    { name: "Qatar", code: "QA", flag: "🇶🇦" },
    { name: "Romania", code: "RO", flag: "🇷🇴" },
    { name: "Russia", code: "RU", flag: "🇷🇺" },
    { name: "Rwanda", code: "RW", flag: "🇷🇼" },
    { name: "Samoa", code: "WS", flag: "🇼🇸" },
    { name: "San Marino", code: "SM", flag: "🇸🇲" },
    { name: "Saudi Arabia", code: "SA", flag: "🇸🇦" },
    { name: "Senegal", code: "SN", flag: "🇸🇳" },
    { name: "Serbia", code: "RS", flag: "🇷🇸" },
    { name: "Seychelles", code: "SC", flag: "🇸🇨" },
    { name: "Sierra Leone", code: "SL", flag: "🇸🇱" },
    { name: "Singapore", code: "SG", flag: "🇸🇬" },
    { name: "Slovakia", code: "SK", flag: "🇸🇰" },
    { name: "Slovenia", code: "SI", flag: "🇸🇮" },
    { name: "Solomon Islands", code: "SB", flag: "🇸🇧" },
    { name: "Somalia", code: "SO", flag: "🇸🇴" },
    { name: "South Africa", code: "ZA", flag: "🇿🇦" },
    { name: "South Korea", code: "KR", flag: "🇰🇷" },
    { name: "South Sudan", code: "SS", flag: "🇸🇸" },
    { name: "Spain", code: "ES", flag: "🇪🇸" },
    { name: "Sri Lanka", code: "LK", flag: "🇱🇰" },
    { name: "Sudan", code: "SD", flag: "🇸🇩" },
    { name: "Suriname", code: "SR", flag: "🇸🇷" },
    { name: "Sweden", code: "SE", flag: "🇸🇪" },
    { name: "Switzerland", code: "CH", flag: "🇨🇭" },
    { name: "Syria", code: "SY", flag: "🇸🇾" },
    { name: "Taiwan", code: "TW", flag: "🇹🇼" },
    { name: "Tajikistan", code: "TJ", flag: "🇹🇯" },
    { name: "Tanzania", code: "TZ", flag: "🇹🇿" },
    { name: "Thailand", code: "TH", flag: "🇹🇭" },
    { name: "Timor-Leste", code: "TL", flag: "🇹🇱" },
    { name: "Togo", code: "TG", flag: "🇹🇬" },
    { name: "Tonga", code: "TO", flag: "🇹🇴" },
    { name: "Trinidad and Tobago", code: "TT", flag: "🇹🇹" },
    { name: "Tunisia", code: "TN", flag: "🇹🇳" },
    { name: "Turkey", code: "TR", flag: "🇹🇷" },
    { name: "Turkmenistan", code: "TM", flag: "🇹🇲" },
    { name: "Tuvalu", code: "TV", flag: "🇹🇻" },
    { name: "Uganda", code: "UG", flag: "🇺🇬" },
    { name: "Ukraine", code: "UA", flag: "🇺🇦" },
    { name: "United Arab Emirates", code: "AE", flag: "🇦🇪" },
    { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
    { name: "United States", code: "US", flag: "🇺🇸" },
    { name: "Uruguay", code: "UY", flag: "🇺🇾" },
    { name: "Uzbekistan", code: "UZ", flag: "🇺🇿" },
    { name: "Vatican City", code: "VA", flag: "🇻🇦" },
    { name: "Venezuela", code: "VE", flag: "🇻🇪" },
    { name: "Vietnam", code: "VN", flag: "🇻🇳" },
    { name: "Yemen", code: "YE", flag: "🇾🇪" },
    { name: "Zambia", code: "ZM", flag: "🇿🇲" },
    { name: "Zimbabwe", code: "ZW", flag: "🇿🇼" }
];

export default function CountrySelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(countries[74]); // Default to India
    const dropdownRef = useRef(null);

    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-3xl border border-white/10 rounded-xl px-4 py-2 text-white transition-all group"
            >
                <img
                    src={`https://flagcdn.com/w40/${selected.code.toLowerCase()}.png`}
                    alt={selected.name}
                    className="w-5 h-auto rounded-sm shadow-sm"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                    }}
                />
                <span className="hidden text-xs font-bold uppercase tracking-widest">🌐</span>
                <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">
                    {selected.code}
                </span>
                <ChevronDown size={14} className={`transition-transform duration-300 opacity-50 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full mt-3 right-0 w-[280px] bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-4 shadow-2xl z-[100] backdrop-blur-3xl"
                    >
                        {/* Search Input */}
                        <div className="relative mb-4">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                            <input
                                type="text"
                                placeholder="Search country..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white/[0.05] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-lh-purple focus:bg-white/[0.08] transition-all"
                                autoFocus
                            />
                        </div>

                        {/* List */}
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-1 pr-1">
                            {filteredCountries.length > 0 ? (
                                filteredCountries.map((country) => (
                                    <button
                                        key={country.code}
                                        onClick={() => {
                                            setSelected(country);
                                            setIsOpen(false);
                                            setSearch("");
                                        }}
                                        className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${selected.code === country.code
                                            ? 'bg-lh-purple text-white'
                                            : 'text-white/70 hover:bg-white/[0.05] hover:text-white'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                                                alt={country.name}
                                                className="w-5 h-auto rounded-sm shadow-sm"
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                            <span className="text-xs font-bold uppercase tracking-widest">{country.name}</span>
                                        </div>
                                        {selected.code === country.code && <Check size={14} className="text-white" />}
                                    </button>
                                ))
                            ) : (
                                <div className="text-center py-6 text-white/40 text-xs font-bold uppercase tracking-widest">
                                    No countries found
                                </div>
                            )}
                        </div>

                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-[2rem] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
