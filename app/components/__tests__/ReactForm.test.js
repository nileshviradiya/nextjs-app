import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReactForm from '../ReactForm';

// Mock the fetch function
global.fetch = jest.fn();

// Mock the AddressField component since we're only testing ReactForm
jest.mock('../AddressField', () => {
  return function MockAddressField({ register }) {
    return (
      <div data-testid="address-field">
        <input {...register('street')} />
        <input {...register('city')} />
        <input {...register('state')} />
        <input {...register('zip')} />
      </div>
    );
  };
});

describe('ReactForm', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders form fields correctly', () => {
    render(<ReactForm />);
    
    expect(screen.getByLabelText(/name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message:/i)).toBeInTheDocument();
    expect(screen.getByTestId('address-field')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<ReactForm />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Message is required')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(<ReactForm />);
    
    const emailInput = screen.getByLabelText(/email:/i);
    await userEvent.type(emailInput, 'invalid-email');
    
    expect(await screen.findByText('Invalid email format')).toBeInTheDocument();
  });

  it('submits form data successfully', async () => {
    const mockResponse = { success: true, message: 'Form submitted successfully' };
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    render(<ReactForm />);
    
    await userEvent.type(screen.getByLabelText(/name:/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email:/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/message:/i), 'Test message');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message',
        }),
      });
    });
  });

  it('pre-fills form with edit data', () => {
    const editData = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message',
    };

    render(<ReactForm editData={editData} />);
    
    expect(screen.getByLabelText(/name:/i)).toHaveValue(editData.name);
    expect(screen.getByLabelText(/email:/i)).toHaveValue(editData.email);
    expect(screen.getByLabelText(/message:/i)).toHaveValue(editData.message);
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
  });

  it('calls onEditComplete after successful update', async () => {
    const editData = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message',
    };

    const mockResponse = { success: true, message: 'Form updated successfully' };
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    const onEditComplete = jest.fn();
    render(<ReactForm editData={editData} onEditComplete={onEditComplete} />);

    const submitButton = screen.getByRole('button', { name: /update/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(onEditComplete).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(`/api/form-data/${editData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
    });
  });
});