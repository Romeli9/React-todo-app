import { Button, Modal, Input, Radio, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import useStore from './store';
import useFetchTasks from './hooks/useFetchTasks';
import useTaskFunc from './hooks/useTaskFunc'
import {TaskCardComp} from './components/taskcard/TaskCard'
import { TodoList } from './AppStyles';
import React from 'react';


function App() {

  const { tasks } = useStore();

  const { totalPages, currentPage, loadMoreTasks } = useFetchTasks();

  const {
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
    handleTitleChange,
    handleDescriptionChange,
    handleEditCancel,
    handleEditOk,
    setFilter,
    setEditTitle,
    setEditDescription
  } = useTaskFunc();
  const { TextArea } = Input;
  return (
    <TodoList>
      <h1>Todo List</h1>
      <Button onClick={showModal}>Создать задачу</Button>
      <Radio.Group style={{ marginTop: 20 }} value={filter} onChange={(e) => setFilter(e.target.value)}>
        <Radio.Button value="all">Все</Radio.Button>
        <Radio.Button value="completed">Выполненные</Radio.Button>
        <Radio.Button value="notCompleted">Не выполненные</Radio.Button>
        <Radio.Button value="favorite">Избранное</Radio.Button>
      </Radio.Group>
      <InfiniteScroll
        dataLength={tasks.length}
        next={loadMoreTasks}
        hasMore={currentPage < totalPages}
        loader={<Spin />}
        endMessage={<p>Задач больше нет</p>}
      >
        {filteredTasks.map((task) => (
          <TaskCardComp task={task}/>
        ))}
      </InfiniteScroll>
      <Modal title="Создание задачи" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Input placeholder="Название" showCount maxLength={40} onChange={handleTitleChange} value={title} />
        <TextArea
          showCount
          maxLength={200}
          onChange={handleDescriptionChange}
          placeholder="Описание"
          style={{ margin: '10px 0', height: 120, resize: 'none' }}
          value={description}
        />
      </Modal>

      <Modal title="Редактирование задачи" open={isEditModalOpen} onOk={handleEditOk} onCancel={handleEditCancel}>
        <Input placeholder="Название" showCount maxLength={40} onChange={(e) => setEditTitle(e.target.value)} value={editTitle} />
        <TextArea
          showCount
          maxLength={200}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Описание"
          style={{ margin: '10px 0', height: 120, resize: 'none' }}
          value={editDescription}
        />
      </Modal>
    </TodoList>
  );
}




export default App;
