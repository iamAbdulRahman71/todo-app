import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import AuthContext from '../../context/AuthContext';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

describe('Header Component', () => {
  test('renders brand and navigation links when token is present', () => {
    const setToken = jest.fn();
    const history = createMemoryHistory();
    render(
      <AuthContext.Provider value={{ token: 'fake-token', setToken }}>
        <Router history={history}>
          <Header />
        </Router>
      </AuthContext.Provider>
    );

    // Verify the brand link is rendered.
    expect(screen.getByText('To Do App')).toBeInTheDocument();
    // Dashboard link should be present.
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    // Logout button should be present.
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  test('does not render navigation links when token is null', () => {
    const setToken = jest.fn();
    const history = createMemoryHistory();
    render(
      <AuthContext.Provider value={{ token: null, setToken }}>
        <Router history={history}>
          <Header />
        </Router>
      </AuthContext.Provider>
    );

    // Verify the brand link is rendered.
    expect(screen.getByText('To Do App')).toBeInTheDocument();
    // Dashboard link and Logout button should not be rendered.
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
  });

  test('logout button calls setToken and navigates to /login', () => {
    const setToken = jest.fn();
    // Start at a dashboard route so we can observe the redirection.
    const history = createMemoryHistory({ initialEntries: ['/dashboard'] });
    render(
      <AuthContext.Provider value={{ token: 'fake-token', setToken }}>
        <Router history={history}>
          <Header />
        </Router>
      </AuthContext.Provider>
    );

    // Find and click the Logout button.
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    // Verify setToken was called with null.
    expect(setToken).toHaveBeenCalledWith(null);
    // Verify navigation to '/login'.
    expect(history.location.pathname).toBe('/login');
  });
});
