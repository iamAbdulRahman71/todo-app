import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import api from '../../api';
import AuthContext from '../../context/AuthContext';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

// Mock the API module
jest.mock('../../api');

describe('Login Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form with username and password fields and a login button', () => {
    render(
      <AuthContext.Provider value={{ setToken: jest.fn() }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('successful login calls api and navigates to dashboard', async () => {
    const fakeToken = 'fake-jwt-token';
    // Mock successful login response
    api.post.mockResolvedValueOnce({ data: { token: fakeToken } });

    const setToken = jest.fn();
    const history = createMemoryHistory();

    render(
      <AuthContext.Provider value={{ setToken }}>
        <Router history={history}>
          <Login />
        </Router>
      </AuthContext.Provider>
    );

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit the form by clicking the login button
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for the API call to be made with correct arguments
    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        username: 'testuser',
        password: 'password123',
      })
    );

    // Ensure setToken is called with the returned token
    await waitFor(() => expect(setToken).toHaveBeenCalledWith(fakeToken));

    // Verify that history has navigated to '/dashboard'
    expect(history.location.pathname).toBe('/dashboard');
  });

  test('failed login displays an error message', async () => {
    // Arrange: simulate API error response with a custom message
    const errorMessage = 'Invalid credentials';
    api.post.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    render(
      <AuthContext.Provider value={{ setToken: jest.fn() }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Fill in form with incorrect credentials
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'wronguser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for the error message to appear
    await waitFor(() =>
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    );
  });
});
