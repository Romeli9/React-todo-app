import {create} from 'zustand';

export interface TaskAttributes {
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
}

export interface Task {
  id: number;
  attributes: TaskAttributes;
}

interface StoreState {
  tasks: Task[];
  favoriteTasks: Set<number>;
  setTasks: (updater: (prevTasks: Task[]) => Task[]) => void;
  toggleFavorite: (taskId: number) => void;
}

const saveFavoritesToLocalStorage = (favorites: Set<number>) => {
  localStorage.setItem('favoriteTasks', JSON.stringify(Array.from(favorites)));
};

const loadFavoritesFromLocalStorage = (): Set<number> => {
  const favorites = localStorage.getItem('favoriteTasks');
  if (favorites) {
    const parsedFavorites = JSON.parse(favorites);
    return new Set<number>(parsedFavorites.map((id: unknown) => Number(id)));
  }
  return new Set<number>();
};

const useStore = create<StoreState>((set, get) => ({
  tasks: [],
  favoriteTasks: loadFavoritesFromLocalStorage(),
  setTasks: (updater) => set((state) => ({ tasks: updater(state.tasks) })),
  toggleFavorite: (taskId) => {
    const { favoriteTasks } = get();
    const updatedFavorites = new Set(favoriteTasks);
    if (updatedFavorites.has(taskId)) {
      updatedFavorites.delete(taskId);
    } else {
      updatedFavorites.add(taskId);
    }
    saveFavoritesToLocalStorage(updatedFavorites);
    set({ favoriteTasks: updatedFavorites });
  }
}));


export default useStore;
