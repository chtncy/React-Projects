import React, { useState, useRef } from "react";
import "./index.css"; // <-- ensure the path is correct for your project

export default function ToDoList() {
  // tasks are objects with id + text to allow safe keys and reordering
  const [tasks, setTasks] = useState([
    { id: uid(), text: "Eat breakfast" },
    { id: uid(), text: "Walk the dog" },
    { id: uid(), text: "Take a shower" },
  ]);
  const [newTask, setNewTask] = useState("");
  const inputRef = useRef(null);

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function addTask() {
    const text = newTask.trim();
    if (text === "") return;
    // optional: prevent duplicate exact task strings
    if (tasks.some((t) => t.text === text)) {
      // briefly focus and flash input (UX)
      inputRef.current?.focus();
      setNewTask("");
      return;
    }

    setTasks((prev) => [...prev, { id: uid(), text }]);
    setNewTask("");
    inputRef.current?.focus();
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function moveTaskUp(index) {
    setTasks((prev) => {
      if (index <= 0) return prev;
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }

  function moveTaskDown(index) {
    setTasks((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }

  // keyboard: Enter on input adds task
  function handleKeyDown(e) {
    if (e.key === "Enter") addTask();
  }

  return (
    <main className="todo-app" aria-labelledby="todo-heading">
      <header className="header">
        <h1 id="todo-heading">To-Do</h1>
        <p className="subtitle">Clean, modern and responsive to-do list</p>
      </header>

      <section className="controls" aria-labelledby="add-task">
        <div className="input">
          <input
            ref={inputRef}
            id="add-task"
            type="text"
            placeholder="Enter a task..."
            value={newTask}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            aria-label="New task"
          />
        </div>
        <button className="btn btn--add" onClick={addTask} aria-label="Add task">
          Add
        </button>
      </section>

      <section className="list-wrap" aria-live="polite">
        <ol className="task-list">
          {tasks.map((task, index) => (
            <li className="task-item" key={task.id}>
              <div className="task-left">
                <span className="task-text">{task.text}</span>
              </div>

              <div className="item-controls">
                <button
                  className="btn btn--move"
                  onClick={() => moveTaskUp(index)}
                  aria-label={`Move up ${task.text}`}
                  disabled={index === 0}
                >
                  ↑
                </button>
                <button
                  className="btn btn--move"
                  onClick={() => moveTaskDown(index)}
                  aria-label={`Move down ${task.text}`}
                  disabled={index === tasks.length - 1}
                >
                  ↓
                </button>
                <button
                  className="btn btn--delete"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete ${task.text}`}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {tasks.length === 0 && <p className="empty">No tasks yet — add one above.</p>}
        </ol>
      </section>
    </main>
  );
}
