import { useState } from 'react';
import useStore, { Task } from '../store';
import { newTask, deleteTask, updateStatus, updateTask } from '../api/taskApi';

const useTaskFunc = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');

  const { tasks, setTasks, toggleFavorite, favoriteTasks } = useStore();

  const showModal = () => setIsModalOpen(true);

  const handleOk = async () => {
    try {
      const createdTask: Task = await newTask(title, description);
      setTasks((prevTasks: Task[]) => [...prevTasks, createdTask]);
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Ошибка при создании:', error);
    }
  };

  const handleCancel = () => setIsModalOpen(false);

  const handleDeleteTask = (id: number) => {
    deleteTask(id, () => {
      setTasks((prevTasks: Task[]) => prevTasks.filter((task) => task.id !== id));
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value);

  const handleToggleFavorite = (taskId: number) => {
    toggleFavorite(taskId);
  };

  const handleStatusUpdate = async (taskId: number, newStatus: string) => {
    const updatedTask = await updateStatus(taskId, newStatus);
    setTasks((prevTasks: Task[]) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, attributes: { ...task.attributes, status: updatedTask.attributes.status } } : task
      )
    );
  };

  const showEditModal = (task: Task) => {
    setCurrentTaskId(task.id);
    setEditTitle(task.attributes.title);
    setEditDescription(task.attributes.description);
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setCurrentTaskId(null);
  };

  const handleEditOk = async () => {
    if (currentTaskId !== null) {
      try {
        const updatedTask: Task = await updateTask(currentTaskId, editTitle, editDescription);
        setTasks((prevTasks: Task[]) =>
          prevTasks.map((task) =>
            task.id === currentTaskId ? { ...task, attributes: { ...task.attributes, title: updatedTask.attributes.title, description: updatedTask.attributes.description } } : task
          )
        );
        setIsEditModalOpen(false);
        setCurrentTaskId(null);
      } catch (error) {
        console.error('Ошибка при обновлении задачи:', error);
      }
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.attributes.status === 'completed';
    if (filter === 'notCompleted') return task.attributes.status === 'notCompleted';
    if (filter === 'favorite') return favoriteTasks.has(task.id);
    return true;
  });

  return {
    isModalOpen,
    title,
    description,
    isEditModalOpen,
    editTitle,
    editDescription,
    filter,
    filteredTasks,
    showModal,
    handleOk,
    handleCancel,
    handleDeleteTask,
    handleTitleChange,
    handleDescriptionChange,
    handleToggleFavorite,
    handleStatusUpdate,
    showEditModal,
    handleEditCancel,
    handleEditOk,
    setFilter,
    setEditTitle,
    setEditDescription
  };
};

export default useTaskFunc;