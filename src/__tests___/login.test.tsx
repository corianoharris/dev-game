import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoginPage from '@/app/(auth)/login/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('LoginPage', () => {
  const user = userEvent.setup();
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
  });

  const fillAndSubmitForm = async (
    email = 'test@test.com',
    password = 'password123'
  ) => {
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /Sign in/i });

    await user.clear(emailInput);
    await user.clear(passwordInput);
    await user.type(emailInput, email);
    await user.type(passwordInput, password);
    await user.click(submitButton);
  };

  test('renders login form with all elements', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });


  test('handles successful login', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(<LoginPage />);
    await fillAndSubmitForm();

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@test.com',
        password: 'password123',
        redirect: false,
        callbackUrl: '/dashboard',
      });
      expect(toast.success).toHaveBeenCalledWith('Logged in successfully!', {
        position: 'top-left',
      });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  test('handles login error from signIn', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ error: 'Invalid credentials' });

    render(<LoginPage />);
    await fillAndSubmitForm();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Invalid email or password. Please try again!',
        { position: 'top-left' }
      );
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  test('handles unexpected error during login', async () => {
    (signIn as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<LoginPage />);
    await fillAndSubmitForm();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to log in. Please try again!',
        { position: 'top-left' }
      );
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  test('validates required fields', async () => {
    render(<LoginPage />);
    
    // Clear default values
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    await user.clear(emailInput);
    await user.clear(passwordInput);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    expect(emailInput).toBeInvalid();
    expect(passwordInput).toBeInvalid();
    expect(signIn).not.toHaveBeenCalled();
  });

  test('validates email format', async () => {
    render(<LoginPage />);
    
    await fillAndSubmitForm('invalid-email');

    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toBeInvalid();
    expect(signIn).not.toHaveBeenCalled();
  });
});