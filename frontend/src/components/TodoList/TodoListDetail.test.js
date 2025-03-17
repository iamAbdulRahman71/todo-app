import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TodoListDetail from './TodoListDetail';
import api from '../../api';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

// Mock the API module
jest.mock('../../api');

// Fake list for tests
const fakeList = {
  _id: '1',
  name: 'Test List',
  items: [
    {
      _id: 'item1',
      title: 'Item 1',
      detail: 'Detail 1',
      dateAdded: new Date().toISOString(),
    },
    {
      _id: 'item2',
      title: 'Item 2',
      detail: 'Detail 2',
      dateAdded: new Date().toISOString(),
    },
  ],
};

// Helper to render component with route context
const renderWithRouter = (ui, { route = '/list/1' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Route path="/list/:id">{ui}</Route>
    </MemoryRouter>
  );
};

describe('TodoListDetail Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and displays list details on mount', async () => {
    // Arrange: api.get returns an array containing fakeList
    api.get.mockResolvedValue({ data: [fakeList] });
    
    renderWithRouter(<TodoListDetail />);
    
    // Assert: Wait for the list name and items to appear
    await waitFor(() => expect(screen.getByText(fakeList.name)).toBeInTheDocument());
    fakeList.items.forEach(item => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  test('displays error when list not found', async () => {
    // Arrange: api.get returns an empty array so that no list is found
    api.get.mockResolvedValue({ data: [] });
    
    renderWithRouter(<TodoListDetail />);
    
    // Assert: "List not found" error is displayed
    await waitFor(() => expect(screen.getByText('List not found')).toBeInTheDocument());
  });

  test('displays error when fetch fails', async () => {
    // Arrange: simulate API failure
    api.get.mockRejectedValue(new Error('Network error'));
    
    renderWithRouter(<TodoListDetail />);
    
    // Assert: "Failed to fetch list details" error is displayed
    await waitFor(() => expect(screen.getByText('Failed to fetch list details')).toBeInTheDocument());
  });

  test('adds a new item', async () => {
    // Arrange: load fakeList
    api.get.mockResolvedValue({ data: [fakeList] });
    
    renderWithRouter(<TodoListDetail />);
    
    // Wait for list details to load
    await waitFor(() => expect(screen.getByText(fakeList.name)).toBeInTheDocument());

    // Input new item details
    const titleInput = screen.getByPlaceholderText('Enter item title');
    const detailInput = screen.getByPlaceholderText('Enter item detail');
    fireEvent.change(titleInput, { target: { value: 'New Item' } });
    fireEvent.change(detailInput, { target: { value: 'New Detail' } });
    
    // Arrange: mock the post call to return a new item
    const newItem = {
      _id: 'item3',
      title: 'New Item',
      detail: 'New Detail',
      dateAdded: new Date().toISOString(),
    };
    api.post.mockResolvedValue({ data: newItem });
    
    // Act: click "Add Item" button
    fireEvent.click(screen.getByText('Add Item'));
    
    // Assert: wait for the new item to appear on the screen
    await waitFor(() => expect(screen.getByText('New Item')).toBeInTheDocument());
  });

  test('edits list name', async () => {
    // Arrange: load fakeList
    api.get.mockResolvedValue({ data: [fakeList] });
    
    renderWithRouter(<TodoListDetail />);
    
    // Wait for list details to load
    await waitFor(() => expect(screen.getByText(fakeList.name)).toBeInTheDocument());
    
    // Act: click "Edit List Name" button to open modal
    fireEvent.click(screen.getByText('Edit List Name'));
    
    // The modal input should have the current list name
    const modalInput = screen.getByDisplayValue(fakeList.name);
    // Change the list name
    fireEvent.change(modalInput, { target: { value: 'Updated List Name' } });
    
    // Arrange: mock api.put to return the updated list name
    api.put.mockResolvedValue({ data: { name: 'Updated List Name' } });
    
    // Act: click "Save Changes"
    fireEvent.click(screen.getByText('Save Changes'));
    
    // Assert: wait for the updated list name to appear
    await waitFor(() => expect(screen.getByText('Updated List Name')).toBeInTheDocument());
  });

  test('deletes an item', async () => {
    // Arrange: load fakeList
    api.get.mockResolvedValue({ data: [fakeList] });
    
    renderWithRouter(<TodoListDetail />);
    
    // Wait for list details to load
    await waitFor(() => expect(screen.getByText(fakeList.name)).toBeInTheDocument());
    
    // Ensure the first item is present
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    
    // Arrange: mock the delete API call to resolve successfully
    api.delete.mockResolvedValue({});
    
    // Act: click the "Delete" button for the first item
    fireEvent.click(screen.getAllByText('Delete')[0]);
    
    // Assert: wait until the first item is removed from the DOM
    await waitFor(() => expect(screen.queryByText('Item 1')).not.toBeInTheDocument());
  });

  test('navigates back to dashboard when "Back to Dashboard" is clicked', async () => {
    // Arrange: load fakeList and create memory history for navigation
    api.get.mockResolvedValue({ data: [fakeList] });
    const history = createMemoryHistory({ initialEntries: ['/list/1'] });
    
    render(
      <Router history={history}>
        <Route path="/list/:id">
          <TodoListDetail />
        </Route>
      </Router>
    );
    
    // Wait for list details to load
    await waitFor(() => expect(screen.getByText(fakeList.name)).toBeInTheDocument());
    
    // Act: click the "Back to Dashboard" button
    fireEvent.click(screen.getByText('Back to Dashboard'));
    
    // Assert: history should navigate to "/dashboard"
    expect(history.location.pathname).toBe('/dashboard');
  });
});
