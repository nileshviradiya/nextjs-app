"use client";
import React, { useEffect, useState } from 'react';

export default function FormDataList({ onEdit }) {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch('/api/form-data');
        if (!response.ok) throw new Error('Failed to fetch form data');
        const data = await response.json();
        setFormData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, []);

  const handleEdit = (entry) => {
    onEdit(entry); // Pass the entire entry object to the parent
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const response = await fetch(`/api/form-data/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete entry');
        setFormData(formData.filter(entry => entry.id !== id));
      } catch (err) {
        console.error('Error deleting entry:', err);
      }
    }
  };

  if (loading) return <div className="flex justify-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Form Submissions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {formData.map((entry) => (
          <div 
            key={entry.id} 
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="font-semibold text-lg text-gray-800">{entry.name}</h2>
                <p className="text-gray-600">{entry.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(entry)} // Pass entire entry
                  className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <span className="material-icons text-sm">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-1 text-red-500 hover:text-red-700 transition-colors"
                >
                  <span className="material-icons text-sm">delete</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="border-t pt-2">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Address</h3>
                <p className="text-gray-600">{entry.street}</p>
                <p className="text-gray-600">
                  {entry.city}, {entry.state} {entry.zip}
                </p>
              </div>
              
              <div className="border-t pt-2">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Message</h3>
                <p className="text-gray-600 line-clamp-3">{entry.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {formData.length === 0 && (
        <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg">
          <p>No submissions yet</p>
        </div>
      )}
    </div>
  );
}