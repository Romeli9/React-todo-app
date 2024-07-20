import { useState, useEffect } from 'react';
import { getTasks } from '../api/taskApi';
import useStore, { Task } from '../store';

const useFetchTasks = () => {
  const [totalPages, setTotalpages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const { setTasks } = useStore();

  const fetchTasks = async (page: number) => {
    const pageSize = 10;
    const { tasks: newTasks, totalPages } = await getTasks(page, pageSize);
    setTasks((prevTasks: Task[]) => {
      const taskIds = new Set(prevTasks.map(task => task.id));
      const uniqueTasks = newTasks.filter((task: Task) => !taskIds.has(task.id));
      return [...prevTasks, ...uniqueTasks];
    });
    setTotalpages(totalPages);
  };

  useEffect(() => {
    fetchTasks(1);
  }, []);

  const loadMoreTasks = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchTasks(nextPage);
    }
  };

  return { totalPages, currentPage, loadMoreTasks };
};

export default useFetchTasks;