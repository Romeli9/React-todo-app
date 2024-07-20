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
    it('Рендер задачи', () => {
        const { getByText } = render(<TaskCardComp task={task} />);
        expect(getByText('Название: Test Task')).toBeInTheDocument();
        expect(getByText('Описание: Test Description')).toBeInTheDocument();
        expect(getByText('Статус: Не готово')).toBeInTheDocument();
    });

    it('Рендер избранного', () => {
        const { container } = render(<TaskCardComp task={task} />);
        const button = container.querySelector('button');
        console.log(button);
        expect(button).toBeInTheDocument();
        expect(button?.querySelector('svg')).toHaveAttribute('data-icon', 'star'); 
    });

    it('Клик в избранное', () => {
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

    it('Выпадающее меню рендер', () => {
        const { getByRole } = render(<TaskCardComp task={task} />);
        const dropdown = getByRole('button', { name: /ellipsis/i });
        fireEvent.click(dropdown);
        expect(getByRole('menuitem', { name: /Готово/i })).toBeInTheDocument();
        expect(getByRole('menuitem', { name: /Редактировать/i })).toBeInTheDocument();
        expect(getByRole('menuitem', { name: /Удалить/i })).toBeInTheDocument();
    });

    it('Обновление статуса задачи', () => {
        const { getByRole } = render(<TaskCardComp task={task} />);
        const dropdown = getByRole('button', { name: /ellipsis/i });
        fireEvent.click(dropdown);
        const statusItem = getByRole('menuitem', { name: /Готово/i });
        fireEvent.click(statusItem);
        const { handleStatusUpdate } = require('./../../hooks/useTaskFunc').default();
        expect(handleStatusUpdate).toHaveBeenCalledWith(task.id, 'completed');
    });

    it('Модальное окно открывается', () => {
        const { getByRole } = render(<TaskCardComp task={task} />);
        const dropdown = getByRole('button', { name: /ellipsis/i });
        fireEvent.click(dropdown);
        const editItem = getByRole('menuitem', { name: /Редактировать/i });
        fireEvent.click(editItem);
        const { showEditModal } = require('./../../hooks/useTaskFunc').default();
        expect(showEditModal).toHaveBeenCalledWith(task);
    });

    it('Задача удаляется', () => {
        const { getByRole } = render(<TaskCardComp task={task} />);
        const dropdown = getByRole('button', { name: /ellipsis/i });
        fireEvent.click(dropdown);
        const deleteItem = getByRole('menuitem', { name: /Удалить/i });
        fireEvent.click(deleteItem);
        const { handleDeleteTask } = require('./../../hooks/useTaskFunc').default();
        expect(handleDeleteTask).toHaveBeenCalledWith(task.id);
    });
});
