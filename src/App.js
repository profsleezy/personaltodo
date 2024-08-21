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
  const [darkMode, setDarkMode] = useState(false); // Dark mode state

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const startColumn = tasks[source.droppableId];
    const endColumn = tasks[destination.droppableId];

    if (source.droppableId === destination.droppableId) {
      const newTaskOrder = Array.from(startColumn);
      const [movedTask] = newTaskOrder.splice(source.index, 1);
      newTaskOrder.splice(destination.index, 0, movedTask);

      setTasks({
        ...tasks,
        [source.droppableId]: newTaskOrder,
      });
    } else {
      const startTaskOrder = Array.from(startColumn);
      const endTaskOrder = Array.from(endColumn);

      const [movedTask] = startTaskOrder.splice(source.index, 1);
      endTaskOrder.splice(destination.index, 0, movedTask);

      setTasks({
        ...tasks,
        [source.droppableId]: startTaskOrder,
        [destination.droppableId]: endTaskOrder,
      });
    }
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
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <header className="header">
        <h1>Kanban To-Do List</h1>
        <div className="task-input">
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
          <button onClick={addTask}>Add Task</button>
          <button onClick={() => setDarkMode(!darkMode)} className="dark-mode-toggle">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
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
        {(provided, snapshot) => (
          <div
            className={`task-list ${snapshot.isDraggingOver ? "draggingOver" : ""}`}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    className="task-item"
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    style={{
                      backgroundColor: getBackgroundColor(task.priority),
                      ...provided.draggableProps.style,
                      opacity: snapshot.isDragging ? 0.5 : 1,
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
