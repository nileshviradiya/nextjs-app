"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import AddressField from './AddressField';

export default function ReactForm({ editData, onEditComplete }) {
  const {
    register,
    handleSubmit,
    getValues,
    control,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: editData || {} // Pre-fill form with edit data if available
  });

  React.useEffect(() => {
    if (editData) {
      reset(editData); // Update form when editData changes
    }
  }, [editData, reset]);

  const onSubmit = async data => {
    try {
      const url = editData 
        ? `/api/form-data/${editData.id}`
        : '/api/submit';
      
      const response = await fetch(url, {
        method: editData ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      console.log(result);
      
      if (editData && onEditComplete) {
        onEditComplete(); // Notify parent that edit is complete
      }
      
      reset(); // Clear form after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Address save handler triggered by the AddressField component.
  const handleSaveAddress = (addressData) => {
    console.log("Address saved:", addressData);
    // Implement additional save logic, e.g. calling an API endpoint, etc.
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div>
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
          Name:
        </label>
        <input
          id="name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && (
          <p className="text-red-500 text-xs italic">{errors.name.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
          Email:
        </label>
        <input
          id="email"
          type="email"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email format',
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-xs italic">{errors.email.message}</p>
        )}
      </div>
      
      {/* Pass control in addition to other props to handle address specific dirty & valid check */}
      <AddressField
        register={register}
        getValues={getValues}
        onSaveAddress={handleSaveAddress}
        error={{
          street: errors.street,
          city: errors.city,
          state: errors.state,
          zip: errors.zip,
        }}
        control={control}
      />

      <div>
        <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
          Message:
        </label>
        <textarea
          id="message"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          {...register('message', { required: 'Message is required' })}
        />
        {errors.message && (
          <p className="text-red-500 text-xs italic">{errors.message.message}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={!isDirty || !isValid}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          (!isDirty || !isValid) && "opacity-50 cursor-not-allowed"
        }`}
      >
        {editData ? 'Update' : 'Submit'}
      </button>
    </form>
  );
}