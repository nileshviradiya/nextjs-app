"use client";
import React, { useState } from 'react';
import ReactForm from './components/ReactForm';
import List from './components/List';

export default function HomePage() {
  const [editingData, setEditingData] = useState(null);

  const handleEdit = (data) => {
    setEditingData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditComplete = () => {
    setEditingData(null);
    // You might want to refresh the list here
  };

  return (
    <div>
      <main style={{ padding: '2rem' }}>
        <h1 className="text-2xl font-bold mb-4">
          {editingData ? 'Edit Form Submission' : 'React Hook Form Example'}
        </h1>
        <ReactForm 
          editData={editingData} 
          onEditComplete={handleEditComplete}
        />
        <div className="mt-8">
          <List onEdit={handleEdit} />
        </div>
      </main>
    </div>
  );
}