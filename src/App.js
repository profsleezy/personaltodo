// src/App.js

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState({
    todo: [
      { id: "1", text: "Task 1", priority: "high" },
      { id: "2", text: "Task 2", priority: "medium" },
    ],
    inProgress: [],
    done: [],
  });

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

  const addTask = () => {
    const taskText = prompt("Enter task description:");
    const taskPriority = prompt("Enter task priority (low, medium, high):");

    if (taskText && taskPriority) {
      const newTask = {
        id: `${new Date().getTime()}`,
        text: taskText,
        priority: taskPriority.toLowerCase(),
      };
      setTasks({ ...tasks, todo: [...tasks.todo, newTask] });
    }
  };

  return (
    <div className="app">
      <h1 className="title">Kanban To-Do List</h1>
      <button className="add-task" onClick={addTask}>
        Add Task
      </button>
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
