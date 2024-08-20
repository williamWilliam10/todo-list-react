const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Simule une base de données en mémoire pour les tâches
let tasks = [];

// Informations d'identification pour la démo
const validLogin = 'lowewilliam.com';
const validPassword = '0000';

// Route pour la connexion
app.post('/login', (req, res) => {
  const { login, password } = req.body;
  
  if (login === validLogin && password === validPassword) {
    // Simuler un token de connexion pour l'exemple
    res.status(200).json({ token: 'dummy-token' });
  } else {
    res.status(401).json({ message: 'Login ou mot de passe incorrect' });
  }
});

// Route pour obtenir toutes les tâches
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// Route pour ajouter une tâche
app.post('/tasks', (req, res) => {
  const newTask = req.body;
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Route pour mettre à jour une tâche
app.put('/tasks/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  const updatedTask = req.body;
  
  if (index >= 0 && index < tasks.length) {
    tasks[index] = updatedTask;
    res.status(200).json(updatedTask);
  } else {
    res.status(404).json({ message: 'Tâche non trouvée' });
  }
});

// Route pour supprimer une tâche
app.delete('/tasks/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  
  if (index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
    res.status(200).json({ message: 'Tâche supprimée' });
  } else {
    res.status(404).json({ message: 'Tâche non trouvée' });
  }
});

// Route pour la déconnexion (réinitialiser la liste des tâches)
app.post('/logout', (req, res) => {
  tasks = []; // Réinitialiser la liste des tâches
  res.status(200).json({ message: 'Déconnexion réussie' });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
