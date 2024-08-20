import React, { useState, useEffect } from 'react';
import './App.css';
import Footer from './components/Footer'; // Importez le composant Footer

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetch('http://localhost:4000/tasks')
        .then(response => response.json())
        .then(data => setTasks(data));
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ login, password })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(data => {
          setLoginError(data.message || 'Login ou mot de passe incorrect');
        });
      }
    })
    .then(data => {
      if (data && data.token) {
        setIsAuthenticated(true);
      }
    })
    .catch(error => {
      console.error('Erreur lors de la connexion:', error);
      setLoginError('Erreur de connexion. Veuillez réessayer.');
    });
  };

  const addTask = () => {
    if (newTask.trim() === '') return;

    const task = { text: newTask, completed: false };
    fetch('http://localhost:4000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })
    .then(response => response.json())
    .then(task => setTasks([...tasks, task]));

    setNewTask('');
  };

  const editTask = (task, index) => {
    setIsEditing(true);
    setCurrentTask({ ...task, index });
    setNewTask(task.text);
  };

  const updateTask = () => {
    fetch(`http://localhost:4000/tasks/${currentTask.index}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: newTask, completed: currentTask.completed })
    }).then(() => {
      const updatedTasks = tasks.map((task, index) =>
        index === currentTask.index ? { ...task, text: newTask } : task
      );
      setTasks(updatedTasks);
      setIsEditing(false);
      setNewTask('');
    });
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    fetch(`http://localhost:4000/tasks/${index}`, {
      method: 'DELETE'
    }).then(() => {
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setTasks([]);
  };

  return (
    <div className="app">
      {isAuthenticated ? (
        <>
          <h1>Ma To-Do List</h1>
          <button onClick={handleLogout} className="logout-button">Déconnexion</button>
          <div className="input-group">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Ajouter ou modifier une tâche"
            />
            {isEditing ? (
              <button onClick={updateTask}>Modifier</button>
            ) : (
              <button onClick={addTask}>Ajouter</button>
            )}
          </div>
          <ul>
            {tasks.map((task, index) => (
              <li key={index} className={task.completed ? 'completed' : ''}>
                <span onClick={() => toggleTaskCompletion(index)}>{task.text}</span>
                <button onClick={() => editTask(task, index)}>Modifier</button>
                <button onClick={() => deleteTask(index)}>Supprimer</button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="login-form">
          <h1>Connexion</h1>
          <div className="login-info">
            <p>Pour la démo, utilisez les informations suivantes :</p>
            <p><strong>Login:</strong> <a href="https://lowewilliam.com" target="_blank" rel="noopener noreferrer">lowewilliam.com</a></p>
            <p><strong>Mot de passe:</strong> 0000</p>
          </div>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Login"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
          />
          <button onClick={handleLogin}>Se connecter</button>
          {loginError && <p className="login-error">{loginError}</p>}
        </div>
      )}
      <Footer /> {/* Incluez le pied de page */}
    </div>
  );
}

export default App;
