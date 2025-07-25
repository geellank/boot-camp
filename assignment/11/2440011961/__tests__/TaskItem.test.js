// __tests__/TaskItem.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '../src/components/TaskItem'; // Adjust path if not in src
import '@testing-library/jest-dom'; // Ensure this is imported for matchers

describe('TaskItem', () => {
  const mockTask = { id: '1', title: 'Buy groceries', completed: false };
  const mockCompletedTask = { id: '2', title: 'Finish report', completed: true };
  const mockOnToggleComplete = jest.fn();
  const mockOnDelete = jest.fn();

  // Clear mocks before each test to ensure isolation
  beforeEach(() => {
    mockOnToggleComplete.mockClear();
    mockOnDelete.mockClear();
  });

  it('renders the task title correctly', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('renders completed task with line-through style and checked checkbox', () => {
    render(
      <TaskItem
        task={mockCompletedTask}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );
    const taskTitle = screen.getByText('Finish report');
    expect(taskTitle).toBeInTheDocument();
    // Check for inline style or class that applies line-through
    // For inline style:
    expect(taskTitle).toHaveStyle('text-decoration: line-through');
    // For checkbox:
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls onToggleComplete with correct arguments when checkbox is clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockOnToggleComplete).toHaveBeenCalledTimes(1);
    expect(mockOnToggleComplete).toHaveBeenCalledWith('1', true); // Expecting to toggle to true
  });

  it('calls onToggleComplete with correct arguments when text is clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );
    fireEvent.click(screen.getByText('Buy groceries'));
    expect(mockOnToggleComplete).toHaveBeenCalledTimes(1);
    expect(mockOnToggleComplete).toHaveBeenCalledWith('1', true); // Expecting to toggle to true
  });


  it('calls onDelete with correct arguments when delete button is clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });
});