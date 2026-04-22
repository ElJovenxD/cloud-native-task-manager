const express = require('express');
const cors = require('cors'); // Importamos la librería que instalaste
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Esto permite que cualquier origen (como tu puerto 5173) se conecte
app.use(express.json()); // Permite que la API entienda JSON en el cuerpo de los mensajes

// Base de datos temporal en memoria
let tareas = [
  { id: 1, titulo: 'Configurar Docker', completada: true },
  { id: 2, titulo: 'Instalar CORS', completada: true },
  { id: 3, titulo: 'Conectar Front y Back', completada: false }
];

// Ruta para obtener todas las tareas
app.get('/api/tasks', (req, res) => {
  res.json(tareas);
});

// Ruta para agregar una nueva tarea
app.post('/api/tasks', (req, res) => {
  const nuevaTarea = {
    id: tareas.length + 1,
    titulo: req.body.titulo,
    completada: false
  };
  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
});

app.listen(PORT, () => {
  console.log(`Servidor API listo en http://localhost:${PORT}`);
});