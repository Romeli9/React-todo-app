import axios from "axios";

export async function getTasks(page: number, pageSize: number) {
    try {
        const response = await axios.get('https://cms.dev-land.host/api/tasks', {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                'pagination[withCount]': true,
                'pagination[page]': page,
                'pagination[pageSize]': pageSize,
            }
        });
        return {
            tasks: response.data.data,
            totalPages: response.data.meta.pagination.pageCount,
        };
    } catch (error) {
        throw error;
    }
}

export async function newTask(title: string, description: string) {
    try {
        const response = await axios.post('https://cms.dev-land.host/api/tasks', {
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                title: title,
                description: description,
                status: 'notCompleted',
            },
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteTask(id: number, onSuccess: () => void) {
    try {
        const response = await axios.delete(`https://cms.dev-land.host/api/tasks/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        onSuccess();
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateStatus(id: number, updateStatus: string) {
    try {
        const response = await axios.put(
            `https://cms.dev-land.host/api/tasks/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    status: updateStatus,
                },
            }
        );
        return response.data.data;
    } catch (error) {
        console.error('Ошибка при обновлении статуса:', error);
    }
}

export async function updateTask(id: number, updatetTitle: string, updatetDesc: string) {
    try {
        const response = await axios.put(
            `https://cms.dev-land.host/api/tasks/${id}`,
            {
                data: {
                    title: updatetTitle,
                    description: updatetDesc,
                },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.data;
    } catch (error) {
        console.error('Ошибка при обновлении задачи:', error);
    }
}