"use client";
import React from 'react';
import { useWatch } from 'react-hook-form';

export default function AddressField({ register, error, getValues, onSaveAddress, control }) {
  // Watch the address fields so we can compute local dirty/valid status
  const addressValues = useWatch({
    control,
    name: ['street', 'city', 'state', 'zip'],
    defaultValue: ['', '', '', ''],
  });

  // Determine if at least one address field has been modified
  const addressDirty = addressValues.some(val => val && val.trim() !== '');

  // Determine if the address fields have no validation errors
  const addressValid = !error?.street && !error?.city && !error?.state && !error?.zip;

  const handleSave = e => {
    e.preventDefault();
    const addressData = {
      street: getValues('street'),
      city: getValues('city'),
      state: getValues('state'),
      zip: getValues('zip'),
    };
    onSaveAddress(addressData);
  };

  return (
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
      <div className="mb-2">
        <input
          id="street"
          placeholder="Street"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-1"
          {...register('street', { required: 'Street is required' })}
        />
        {error?.street && <p className="text-red-500 text-xs italic">{error.street.message}</p>}
      </div>
      <div className="mb-2">
        <input
          id="city"
          placeholder="City"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-1"
          {...register('city', { required: 'City is required' })}
        />
        {error?.city && <p className="text-red-500 text-xs italic">{error.city.message}</p>}
      </div>
      <div className="mb-2">
        <input
          id="state"
          placeholder="State"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-1"
          {...register('state', { required: 'State is required' })}
        />
        {error?.state && <p className="text-red-500 text-xs italic">{error.state.message}</p>}
      </div>
      <div className="mb-2">
        <input
          id="zip"
          placeholder="ZIP Code"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          {...register('zip', { required: 'ZIP Code is required' })}
        />
        {error?.zip && <p className="text-red-500 text-xs italic">{error.zip.message}</p>}
      </div>
      <button
        type="button"
        onClick={handleSave}
        disabled={!addressDirty || !addressValid}
        className={`bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline ${
          (!addressDirty || !addressValid) && "opacity-50 cursor-not-allowed"
        }`}
      >
        Save Address
      </button>
    </div>
  );
}