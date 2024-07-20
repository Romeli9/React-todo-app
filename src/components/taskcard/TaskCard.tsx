import { EllipsisOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu } from "antd";
import React from "react";
import useTaskFunc from './../../hooks/useTaskFunc';
import useStore, { Task } from './../../store';
import { TaskButtonFavoriteWrapper, TaskCard, TaskCard__text } from "./taskCardStyles";

interface TaskCardCompProps {
    task: Task;
}

export const TaskCardComp: React.FC<TaskCardCompProps> = ({ task }) => {

    const { handleStatusUpdate, showEditModal, handleDeleteTask, handleToggleFavorite } = useTaskFunc();
    const { favoriteTasks } = useStore();

    const menu = (task: Task) => (
        <Menu>
            {task.attributes.status === 'completed' ? (
                <Menu.Item onClick={() => handleStatusUpdate(task.id, 'notCompleted')}>Не готово</Menu.Item>
            ) : (
                <Menu.Item onClick={() => handleStatusUpdate(task.id, 'completed')}>Готово</Menu.Item>
            )}
            <Menu.Item onClick={() => showEditModal(task)}>Редактировать</Menu.Item>
            <Menu.Item onClick={() => handleDeleteTask(task.id)}>Удалить</Menu.Item>
        </Menu>
    );

    return (
        <TaskCard key={task.id}>
            <TaskCard__text>Название: {task.attributes.title}</TaskCard__text>
            <TaskCard__text>Описание: {task.attributes.description}</TaskCard__text>
            <TaskCard__text>Статус: {task.attributes.status === 'completed' ? 'Готово' : 'Не готово'}</TaskCard__text>
            <TaskCard__text>Время создания: {new Date(task.attributes.createdAt).toLocaleString()}</TaskCard__text>
            <TaskButtonFavoriteWrapper>
                <Button
                    shape="circle"
                    onClick={() => handleToggleFavorite(task.id)}
                    icon={favoriteTasks.has(task.id) ? <StarFilled style={{ color: 'blue' }} /> : <StarOutlined />}
                />

            </TaskButtonFavoriteWrapper>
            <Dropdown overlay={menu(task)} trigger={['click']}>
                <Button style={{ marginLeft: 8, marginTop: 10 }} shape="circle" icon={<EllipsisOutlined />} />
            </Dropdown>
        </TaskCard>
    );
}


