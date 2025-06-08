import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    portfolios: 0,
    testimonials: 0,
    teamMembers: 0,
    contacts: 0,
    services: 0,
    careers: 0
  });
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        portfolioRes,
        testimonialsRes,
        teamRes,
        contactsRes,
        servicesRes,
        careersRes
      ] = await Promise.all([
        api.get('/portfolio'),
        api.get('/testimonials'),
        api.get('/team'),
        api.get('/contacts'),
        api.get('/service/services'),
        api.get('/careers')
      ]);

      setStats({
        portfolios: portfolioRes.data.count,
        testimonials: testimonialsRes.data.count,
        teamMembers: teamRes.data.count,
        contacts: contactsRes.data.count,
        services: servicesRes.data.count,
        careers: careersRes.data.count
      });

      // Get recent contacts (last 5)
      setRecentContacts(contactsRes.data.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, count, icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{count}</p>
        </div>
        <div className="text-3xl" style={{ color }}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Portfolio Projects"
          count={stats.portfolios}
          icon="📁"
          color="#3B82F6"
        />
        <StatCard
          title="Team Members"
          count={stats.teamMembers}
          icon="👥"
          color="#10B981"
        />
        <StatCard
          title="Services"
          count={stats.services}
          icon="⚙️"
          color="#8B5CF6"
        />
        <StatCard
          title="Testimonials"
          count={stats.testimonials}
          icon="⭐"
          color="#F59E0B"
        />
        <StatCard
          title="Career Openings"
          count={stats.careers}
          icon="💼"
          color="#EF4444"
        />
        <StatCard
          title="Contact Messages"
          count={stats.contacts}
          icon="📧"
          color="#06B6D4"
        />
      </div>

      {/* Recent Contacts */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Contact Messages</h2>
        </div>
        <div className="p-6">
          {recentContacts.length > 0 ? (
            <div className="space-y-4">
              {recentContacts.map((contact) => (
                <div key={contact._id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {contact.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(contact.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                    {contact.company && (
                      <p className="text-xs text-gray-500">{contact.company}</p>
                    )}
                    <p className="text-sm text-gray-700 mt-1 truncate">
                      {contact.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent contact messages</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors">
            <div className="text-2xl mb-2">➕</div>
            <p className="text-sm font-medium text-gray-900">Add Portfolio</p>
          </button>
          <button className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors">
            <div className="text-2xl mb-2">👤</div>
            <p className="text-sm font-medium text-gray-900">Add Team Member</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors">
            <div className="text-2xl mb-2">🛠️</div>
            <p className="text-sm font-medium text-gray-900">Add Service</p>
          </button>
          <button className="p-4 bg-yellow-50 rounded-lg text-center hover:bg-yellow-100 transition-colors">
            <div className="text-2xl mb-2">💼</div>
            <p className="text-sm font-medium text-gray-900">Post Job</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;