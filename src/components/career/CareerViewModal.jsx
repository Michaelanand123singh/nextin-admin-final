import React from 'react';
import { X, Star } from 'lucide-react';

const CareerViewModal = ({ career, onClose }) => {
  const InfoSection = ({ title, children }) => (
    <div>
      <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      {children}
    </div>
  );

  const InfoRow = ({ label, value, isLink = false }) => (
    <p className="text-gray-600">
      <strong>{label}:</strong>{' '}
      {isLink ? (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View Application
        </a>
      ) : (
        value
      )}
    </p>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Career Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {career.title}
                </h3>
                <div className="space-y-2">
                  <InfoRow label="Department" value={career.department} />
                  <InfoRow label="Location" value={career.location} />
                  <InfoRow label="Type" value={career.type} />
                  <InfoRow label="Experience" value={career.experience} />
                  <InfoRow label="Salary" value={career.salary} />
                  <InfoRow label="Posted" value={career.posted} />
                </div>
              </div>
              <div>
                <div className="space-y-2">
                  <InfoRow label="Job ID" value={`#${career.id}`} />
                  <InfoRow label="Apply Link" value={career.applyLink} isLink />
                  {career.featured && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      <Star className="w-3 h-3 mr-1" />
                      Featured Job
                    </span>
                  )}
                </div>
              </div>
            </div>

            <InfoSection title="Description">
              <p className="text-gray-700 whitespace-pre-wrap">{career.description}</p>
            </InfoSection>

            {career.requirements?.length > 0 && (
              <InfoSection title="Requirements">
                <ul className="list-disc list-inside space-y-1">
                  {career.requirements.map((req, index) => (
                    <li key={index} className="text-gray-700">{req}</li>
                  ))}
                </ul>
              </InfoSection>
            )}

            {career.skills?.length > 0 && (
              <InfoSection title="Skills">
                <div className="flex flex-wrap gap-2">
                  {career.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </InfoSection>
            )}

            {career.benefits?.length > 0 && (
              <InfoSection title="Benefits">
                <ul className="list-disc list-inside space-y-1">
                  {career.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-700">{benefit}</li>
                  ))}
                </ul>
              </InfoSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerViewModal;