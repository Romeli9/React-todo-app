import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TaskCardComp } from './TaskCard';
import { Task } from './../../store';
import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';

const mockHandleToggleFavorite = jest.fn();
const mockHandleStatusUpdate = jest.fn();
const mockShowEditModal = jest.fn();
const mockHandleDeleteTask = jest.fn();
const mockFavoriteTasks = new Set<number>();

// Моки для хуков
jest.mock('./../../hooks/useTaskFunc', () => ({
    __esModule: true,
    default: () => ({
        handleStatusUpdate: mockHandleStatusUpdate,
        showEditModal: mockShowEditModal,
        handleDeleteTask: mockHandleDeleteTask,
        handleToggleFavorite: mockHandleToggleFavorite
    })
}));

jest.mock('./../../store', () => ({
    __esModule: true,
    default: () => ({
        favoriteTasks: mockFavoriteTasks
    })
}));

const task: Task = {
    id: 1,
    attributes: {
        title: 'Test Task',
        description: 'Test Description',
        status: 'notCompleted',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        favorite: false
    }
};

describe('<TaskCardComp />', () => {
    it('should render task details correctly', () => {
        const { getByText } = render(<TaskCardComp task={task} />);
        expect(getByText('Название: Test Task')).toBeInTheDocument();
        expect(getByText('Описание: Test Description')).toBeInTheDocument();
        expect(getByText('Статус: Не готово')).toBeInTheDocument();
    });

    it('should render favorite button with StarOutlined icon when not favorited', () => {
        const { container } = render(<TaskCardComp task={task} />);
        const button = container.querySelector('button');
        console.log(button);
        expect(button).toBeInTheDocument();
        expect(button?.querySelector('svg')).toHaveAttribute('data-icon', 'star'); 
    });

    it('should call handleToggleFavorite when favorite button is clicked', () => {
        const { container } = render(<TaskCardComp task={task} />);
        const button = container.querySelector('button');
        if (button) {
            fireEvent.click(button);
            const { handleToggleFavorite } = require('./../../hooks/useTaskFunc').default();
            expect(handleToggleFavorite).toHaveBeenCalledWith(task.id);
        } else {
            throw new Error('Button not found');
        }
    });

    it('should display dropdown menu with correct options', () => {
        const { getByRole } = render(<TaskCardComp task={task} />);
        const dropdown = getByRole('button', { name: /ellipsis/i });
        fireEvent.click(dropdown);
        // Проверяем наличие пунктов меню
        expect(getByRole('menuitem', { name: /Готово/i })).toBeInTheDocument();
        expect(getByRole('menuitem', { name: /Редактировать/i })).toBeInTheDocument();
        expect(getByRole('menuitem', { name: /Удалить/i })).toBeInTheDocument();
    });

    it('should call handleStatusUpdate when status menu item is clicked', () => {
        const { getByRole } = render(<TaskCardComp task={task} />);
        const dropdown = getByRole('button', { name: /ellipsis/i });
        fireEvent.click(dropdown);
        const statusItem = getByRole('menuitem', { name: /Готово/i });
        fireEvent.click(statusItem);
        // Проверяем, что функция была вызвана
        const { handleStatusUpdate } = require('./../../hooks/useTaskFunc').default();
        expect(handleStatusUpdate).toHaveBeenCalledWith(task.id, 'completed');
    });

    it('should call showEditModal when edit menu item is clicked', () => {
        const { getByRole } = render(<TaskCardComp task={task} />);
        const dropdown = getByRole('button', { name: /ellipsis/i });
        fireEvent.click(dropdown);
        const editItem = getByRole('menuitem', { name: /Редактировать/i });
        fireEvent.click(editItem);
        // Проверяем, что функция была вызвана
        const { showEditModal } = require('./../../hooks/useTaskFunc').default();
        expect(showEditModal).toHaveBeenCalledWith(task);
    });

    it('should call handleDeleteTask when delete menu item is clicked', () => {
        const { getByRole } = render(<TaskCardComp task={task} />);
        const dropdown = getByRole('button', { name: /ellipsis/i });
        fireEvent.click(dropdown);
        const deleteItem = getByRole('menuitem', { name: /Удалить/i });
        fireEvent.click(deleteItem);
        // Проверяем, что функция была вызвана
        const { handleDeleteTask } = require('./../../hooks/useTaskFunc').default();
        expect(handleDeleteTask).toHaveBeenCalledWith(task.id);
    });
});
