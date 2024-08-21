// src/App.js

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  const [taskInput, setTaskInput] = useState("");
  const [priority, setPriority] = useState("medium");

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const sourceColumn = tasks[source.droppableId];
    const destColumn = tasks[destination.droppableId];

    const sourceItems = [...sourceColumn];
    const destItems = [...destColumn];

    const [movedItem] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, movedItem);

    setTasks({
      ...tasks,
      [source.droppableId]: sourceItems,
      [destination.droppableId]: destItems,
    });
  };

  const addTask = (e) => {
    e.preventDefault();

    if (taskInput.trim() === "") return;

    const newTask = {
      id: `${new Date().getTime()}`,
      text: taskInput,
      priority,
    };

    setTasks({ ...tasks, todo: [...tasks.todo, newTask] });
    setTaskInput("");
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Kanban To-Do List</h1>
        <form className="task-input" onSubmit={addTask}>
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Enter a new task"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button type="submit">Add Task</button>
        </form>
      </header>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {Object.keys(tasks).map((column) => (
            <Column key={column} title={column} tasks={tasks[column]} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

const Column = ({ title, tasks }) => {
  const getBackgroundColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ffadad";
      case "medium":
        return "#ffd6a5";
      case "low":
        return "#caffbf";
      default:
        return "#e8f0fe";
    }
  };

  return (
    <div className="column">
      <h2>{title.replace(/([A-Z])/g, " $1")}</h2>
      <Droppable droppableId={title}>
        {(provided) => (
          <div
            className="task-list"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    className="task-item"
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    style={{
                      backgroundColor: getBackgroundColor(task.priority),
                      ...provided.draggableProps.style,
                    }}
                  >
                    {task.text} <span className="priority">{task.priority}</span>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default App;
