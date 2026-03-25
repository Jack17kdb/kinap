import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaSearch, FaBars, FaTimes, FaArrowLeft, FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { MessageCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { useItemStore } from '../store/itemStore.js';
import { useChatStore } from '../store/chatStore.js';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { logout, authUser } = useAuthStore();
  const { searchItems } = useItemStore();
  const { conversations, getRecentChats } = useChatStore();
  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);

  const navLinkStyles = ({ isActive }) =>
    `text-md font-medium transition-colors flex items-center h-full ${isActive ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`;

  useEffect(() => { getRecentChats(); }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchItems(searchQuery);
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchMode(false);
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm h-13 flex items-center">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 h-full">
        {!searchMode ? (
          <>
            {/* Logo Section */}
            <div className="flex items-center">
              <h2 className="text-lg font-semibold cursor-pointer" onClick={() => navigate('/home')}>Kinap</h2>
            </div>

            {/* Centered Navigation Links - Flex-1 and justify-center centers this block */}
            <div className="hidden flex-1 justify-center gap-9 md:flex items-center h-full">
              <NavLink to="/home" className={navLinkStyles}>Home</NavLink>
              
              {/* Lost Dropdown - h-full ensures vertical alignment with sibling links */}
              <div className="group relative cursor-pointer flex items-center h-full">
                <span className="text-md font-medium text-gray-700 group-hover:text-orange-500 flex items-center gap-1">
                  lost items <FaChevronDown className="text-[10px]" />
                </span>
                {/* top-full ensures it starts exactly at the bottom of the 64px nav */}
                <div className="absolute hidden group-hover:block w-40 bg-white shadow-lg rounded-md border border-gray-100 top-full left-0 py-2 z-[60]">
                  <NavLink to="/lost" className="block px-4 py-2 text-sm text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded">View Lost</NavLink>
                  <NavLink to="/report-lost" className="block px-4 py-2 text-sm text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded">Report Lost</NavLink>
                </div>
              </div>

              {/* Found Dropdown */}
              <div className="group relative cursor-pointer flex items-center h-full">
                <span className="text-md font-medium text-gray-700 group-hover:text-orange-500 flex items-center gap-1">
                  found items <FaChevronDown className="text-[10px]" />
                </span>
                <div className="absolute hidden group-hover:block w-40 bg-white shadow-lg rounded-md border border-gray-100 top-full left-0 py-2 z-[60]">
                  <NavLink to="/found" className="block px-4 py-2 text-sm text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded">View Found</NavLink>
                  <NavLink to="/report-found" className="block px-4 py-2 text-sm text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded">Report Found</NavLink>
                </div>
              </div>

              <NavLink to="/reviews" className={navLinkStyles}>Reviews</NavLink>
            </div>

            {/* Right Icons Section */}
            <div className="flex items-center gap-5 justify-end">
              <button onClick={() => setSearchMode(true)} className="md:hidden text-gray-500 hover:text-black">
                <FaSearch className="text-lg cursor-pointer" />
              </button>

              <div className="hidden md:flex">
                <form onSubmit={handleSearch} className="flex items-center rounded-full bg-gray-100 px-4 py-1.5 focus-within:bg-white">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-32 bg-transparent text-sm outline-none md:w-48"
                  />
                  <button type="submit">
                    <FaSearch className="text-sm text-gray-400 hover:text-orange-500" />
                  </button>
                </form>
              </div>

              <NavLink to="/chat" className="relative">
                <MessageCircle className="cursor-pointer text-gray-500 transition hover:text-black" />
                {totalUnread > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {totalUnread > 9 ? '9+' : totalUnread}
                  </span>
                )}
              </NavLink>

              <div ref={profileDropdownRef} className="relative">
                <img
                  src={authUser.profilePic || "/default.jpeg"}
                  className="h-8 w-8 cursor-pointer rounded-full object-cover"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                />
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <NavLink
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <FaUser /> Profile
                      </NavLink>
                      <button
                        onClick={() => { logout(); setProfileDropdownOpen(false); }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => setOpen(!open)} className="md:hidden text-gray-700 cursor-pointer">
                {open ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </>
        ) : (
          <div className="flex w-full items-center gap-3 h-full px-2">
            <button onClick={() => setSearchMode(false)} className="text-gray-600 hover:text-black">
              <FaArrowLeft />
            </button>
            <form onSubmit={handleSearch} className="flex flex-1 items-center rounded-full bg-gray-100 px-4 py-1.5">
              <input
                type="text"
                autoFocus
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              />
              <button type="submit">
                <FaSearch className="text-sm text-gray-400" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {open && !searchMode && (
        <div className="absolute top-16 left-0 w-full bg-white flex flex-col gap-4 px-4 py-4 md:hidden shadow-md">
          <NavLink to="/home" className="text-md font-medium text-gray-700" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/lost" className="text-md font-medium text-gray-700" onClick={() => setOpen(false)}>lost items</NavLink>
          <NavLink to="/found" className="text-md font-medium text-gray-700" onClick={() => setOpen(false)}>found items</NavLink>
          <NavLink to="/report-lost" className="text-md font-medium text-gray-700" onClick={() => setOpen(false)}>report lost</NavLink>
          <NavLink to="/report-found" className="text-md font-medium text-gray-700" onClick={() => setOpen(false)}>report found</NavLink>
          <NavLink to="/reviews" className="text-md font-medium text-gray-700" onClick={() => setOpen(false)}>Reviews</NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;