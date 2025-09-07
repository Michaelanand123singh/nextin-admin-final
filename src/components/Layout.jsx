import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, FolderOpen, Users, Star, Mail, Settings, LogOut, Menu, X,
  Briefcase, Grid3x3, Clipboard
} from 'lucide-react';
import apiService from '../utils/api';

const Layout = ({ children, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Projects', icon: Clipboard, path: '/projects' },
    { name: 'Portfolio', icon: FolderOpen, path: '/portfolio' },
    { name: 'Team', icon: Users, path: '/team' },
    { name: 'Services', icon: Grid3x3, path: '/services' },
    { name: 'Testimonials', icon: Star, path: '/testimonials' },
    { name: 'Contacts', icon: Mail, path: '/contacts' },
    { name: 'Careers', icon: Briefcase, path: '/careers' },
  ];

  const handleLogout = () => {
    apiService.logout();
    onLogout();
  };

  const handleNavClick = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const currentPage = navigation.find(nav => nav.path === location.pathname)?.name || 'Dashboard';

  // Navigation Item Component
  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    
    return (
      <button
        onClick={() => handleNavClick(item.path)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-200' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <Icon size={20} />
        {item.name}
      </button>
    );
  };

  // User Profile Component
  const UserProfile = () => (
    <div className="border-t border-gray-100 p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
          <span className="text-white font-semibold text-sm">
            {user?.name?.charAt(0) || 'U'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {user?.name || 'User'}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user?.email || 'user@example.com'}
          </p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 hover:text-red-700 transition-colors"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  );

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-out md:translate-x-0 md:static md:shadow-lg`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-white font-bold text-lg">NextIn Vision</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* User Profile */}
        <UserProfile />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur border-b border-gray-200/60 shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={22} />
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {currentPage}
              </h1>
            </div>
            
            <div className="text-sm text-gray-500 font-medium">
              Welcome back, <span className="text-gray-700">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;