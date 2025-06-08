import { useState, useEffect } from 'react';
import api from '../utils/api';
import Table from '../components/Table';
import { Trash2, Eye, Mail, Building, Calendar } from 'lucide-react';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contacts');
      if (response.data.success) {
        setContacts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      alert('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        const response = await api.delete(`/contacts/${id}`);
        if (response.data.success) {
          setContacts(contacts.filter(contact => contact._id !== id));
          alert('Contact deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Failed to delete contact');
      }
    }
  };

  const handleView = async (id) => {
    try {
      const response = await api.get(`/contacts/${id}`);
      if (response.data.success) {
        setSelectedContact(response.data.data);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching contact details:', error);
      alert('Failed to fetch contact details');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (contact) => (
        <div className="font-medium text-gray-900">{contact.name}</div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      render: (contact) => (
        <div className="flex items-center text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          {contact.email}
        </div>
      )
    },
    {
      key: 'company',
      label: 'Company',
      render: (contact) => (
        <div className="flex items-center text-gray-600">
          <Building className="w-4 h-4 mr-2" />
          {contact.company || 'N/A'}
        </div>
      )
    },
    {
      key: 'submittedAt',
      label: 'Submitted',
      render: (contact) => (
        <div className="flex items-center text-gray-500 text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          {formatDate(contact.submittedAt)}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (contact) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleView(contact._id)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(contact._id)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
        <div className="text-sm text-gray-500">
          Total: {contacts.length} messages
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <Table
          data={contacts}
          columns={columns}
          loading={loading}
          emptyMessage="No contact messages found"
        />
      </div>

      {/* Contact Details Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Contact Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <div className="text-gray-900 font-medium">{selectedContact.name}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="text-gray-900">{selectedContact.email}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <div className="text-gray-900">{selectedContact.company || 'Not provided'}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Submitted At
                    </label>
                    <div className="text-gray-900">{formatDate(selectedContact.submittedAt)}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}