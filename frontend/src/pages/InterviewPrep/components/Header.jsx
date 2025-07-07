import React, { useContext, useState, useRef, useEffect } from 'react';
import { UserContext } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, UserCircle2, Menu, X, Bot } from 'lucide-react';

const Header = ({ onLoginClick }) => {
  const { user, setUser } = useContext(UserContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-gradient-to-r from-orange-500 to-amber-400 shadow-md px-4 py-3 sm:px-6 flex justify-between items-center">
      {/* Logo with AI Icon */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <Bot className="w-7 h-7 text-white drop-shadow-md" />
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
          Interview <span className="text-orange-100">AI</span>
        </h1>
      </div>

      {/* User/Profile Section */}
      {user ? (
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-3 cursor-pointer bg-white px-3 py-2 rounded-full shadow hover:bg-orange-50 transition"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <img
              src={user.photo || '/default-avatar.jpg'}
              alt="User"
              className="w-9 h-9 rounded-full object-cover border border-orange-300"
            />
            <div className="hidden sm:flex flex-col items-start max-w-[8rem] sm:max-w-[10rem]">
              <span className="text-sm font-semibold text-orange-600 truncate">
                {user.fullName}
              </span>
              <span className="text-xs text-gray-500 truncate">{user.email}</span>
            </div>
            {showDropdown ? (
              <X className="w-4 h-4 text-orange-500" />
            ) : (
              <Menu className="w-4 h-4 text-orange-500" />
            )}
          </div>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-[90vw] max-w-[18rem] bg-white rounded-xl shadow-xl z-50 p-4 space-y-2 animate-fade-in">
              <div className="flex items-center gap-3">
                <img
                  src={user.photo || '/default-avatar.jpg'}
                  className="w-10 h-10 rounded-full border object-cover"
                  alt="Profile"
                />
                <div className="flex flex-col max-w-[12rem]">
                  <p className="text-sm font-bold text-orange-600 truncate">{user.fullName}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <hr className="my-2" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium py-1"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={onLoginClick}
          className="bg-white text-orange-600 font-semibold px-4 sm:px-5 py-2 rounded-full hover:bg-orange-100 transition flex items-center gap-2"
        >
          <UserCircle2 className="w-5 h-5" />
          <span className="hidden sm:inline">Login / Sign Up</span>
        </button>
      )}
    </header>
  );
};

export default Header;
