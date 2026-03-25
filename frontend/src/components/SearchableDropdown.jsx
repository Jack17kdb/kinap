import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

const SearchableDropdown = ({
    options = [],
    value = '',
    onChange,
    placeholder = 'Select...',
    label,
    disabled = false,
}) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef(null);

    const normalize = (opt) => typeof opt === 'string' ? { _id: opt, name: opt } : opt;
    const normalized = options.map(normalize);

    const filtered = normalized.filter((o) =>
        o.name.toLowerCase().includes(search.toLowerCase())
    );

    const selected = normalized.find((o) => o.name === value || o._id === value);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (opt) => {
        onChange(opt.name);
        setSearch('');
        setOpen(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange('');
        setSearch('');
    };

    return (
        <div ref={ref} className="relative w-full">
            {label && <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>}

            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-left focus:outline-none focus:border-orange-400 transition disabled:opacity-50"
            >
                <span className={selected ? 'text-gray-800' : 'text-gray-400'}>
                    {selected ? selected.name : placeholder}
                </span>
                <div className="flex items-center gap-1">
                    {value && (
                        <span onClick={handleClear} className="text-gray-400 hover:text-red-500 transition">
                            <X size={14} />
                        </span>
                    )}
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                    {/* Search inside dropdown */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                        <Search size={14} className="text-gray-400 shrink-0" />
                        <input
                            autoFocus
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full text-sm outline-none"
                        />
                    </div>

                    <ul className="max-h-52 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <li className="px-4 py-3 text-sm text-gray-400 text-center">No results</li>
                        ) : (
                            filtered.map((opt) => (
                                <li
                                    key={opt._id}
                                    onClick={() => handleSelect(opt)}
                                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-orange-50 transition ${
                                        opt.name === value ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                                    }`}
                                >
                                    {opt.name}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchableDropdown;
