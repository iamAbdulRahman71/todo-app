import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TodoLists from './TodoLists';
import api from '../../api';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the API module
jest.mock('../../api');

describe('TodoLists Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and displays lists on mount', async () => {
    // Arrange: set up fake data for API.get
    const fakeLists = [
      { _id: '1', name: 'List One' },
      { _id: '2', name: 'List Two' }
    ];
    api.get.mockResolvedValue({ data: fakeLists });
    
    // Act: render the component within a Router
    render(
      <Router>
        <TodoLists />
      </Router>
    );
    
    // Assert: wait for each list name to appear on the screen
    for (const list of fakeLists) {
      await waitFor(() => expect(screen.getByText(list.name)).toBeInTheDocument());
    }
  });

  test('displays error message if fetching lists fails', async () => {
    // Arrange: simulate API failure
    api.get.mockRejectedValue(new Error('API error'));
    
    // Act: render the component
    render(
      <Router>
        <TodoLists />
      </Router>
    );
    
    // Assert: verify the error message is displayed
    await waitFor(() => expect(screen.getByText('Failed to fetch lists')).toBeInTheDocument());
  });

  test('adds a new list when form is submitted', async () => {
    // Arrange: initially return one list
    const initialLists = [{ _id: '1', name: 'List One' }];
    api.get.mockResolvedValue({ data: initialLists });
    
    render(
      <Router>
        <TodoLists />
      </Router>
    );

    // Wait for initial list to load
    await waitFor(() => expect(screen.getByText('List One')).toBeInTheDocument());

    // Open the modal by clicking "Add New List" button
    fireEvent.click(screen.getByText('Add New List'));

    // Enter a new list name into the input field
    const input = screen.getByPlaceholderText('Enter list name');
    fireEvent.change(input, { target: { value: 'New List' } });
    
    // Arrange: mock the post API to return the new list
    const newList = { _id: '2', name: 'New List' };
    api.post.mockResolvedValue({ data: newList });
    
    // Act: click the "Add List" button
    fireEvent.click(screen.getByText('Add List'));
    
    // Assert: wait for the new list to appear on the screen
    await waitFor(() => expect(screen.getByText('New List')).toBeInTheDocument());
  });

  test('deletes a list when delete button is clicked', async () => {
    // Arrange: set up a list to delete
    const fakeLists = [{ _id: '1', name: 'List One' }];
    api.get.mockResolvedValue({ data: fakeLists });
    
    render(
      <Router>
        <TodoLists />
      </Router>
    );

    // Wait for the list to load
    await waitFor(() => expect(screen.getByText('List One')).toBeInTheDocument());
    
    // Arrange: mock the delete API call to resolve successfully
    api.delete.mockResolvedValue({});
    
    // Act: click the "Delete" button for the list
    fireEvent.click(screen.getByText('Delete'));
    
    // Assert: wait until the list is removed from the DOM
    await waitFor(() => expect(screen.queryByText('List One')).not.toBeInTheDocument());
  });
});
