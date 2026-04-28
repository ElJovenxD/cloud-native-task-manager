require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const jwt = require('jsonwebtoken'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portafolio_assets',
    resource_type: 'auto', 
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif', 'mp4']
  }
});
const upload = multer({ storage: storage });

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('¡Conectado a MongoDB Atlas! 🚀'))
  .catch(err => console.error('Error de conexión:', err));

const ProyectoSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  tecnologias: [String],
  enlaceDemo: String,
  galeria: [{ url: String, explicacion: String }],
  fecha: { type: Date, default: Date.now }
});
const Proyecto = mongoose.model('Proyecto', ProyectoSchema);

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 
  if (!token) return res.status(401).json({ error: 'Acceso denegado.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido.' });
    req.user = user;
    next(); 
  });
};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
});

app.get('/api/proyectos', async (req, res) => {
  try {
    const proyectos = await Proyecto.find().sort({ fecha: -1 });
    res.json(proyectos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

// --- RUTA POST (CREAR) ---
app.post('/api/proyectos', verificarToken, upload.array('media', 5), async (req, res) => {
  try {
    const explicacionesArray = req.body.explicaciones ? req.body.explicaciones.split('||') : [];
    const galeriaConfigurada = req.files.map((file, index) => ({
      url: file.path,
      explicacion: explicacionesArray[index] || "" 
    }));

    const nuevoProyecto = new Proyecto({
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      tecnologias: req.body.tecnologias ? req.body.tecnologias.split(',') : [],
      enlaceDemo: req.body.enlaceDemo,
      galeria: galeriaConfigurada
    });

    await nuevoProyecto.save();
    res.status(201).json(nuevoProyecto);
  } catch (error) {
    res.status(400).json({ error: 'Error al procesar el proyecto' });
  }
});

// --- RUTA PUT (ACTUALIZAR) ---
app.put('/api/proyectos/:id', verificarToken, async (req, res) => {
  try {
    const { titulo, descripcion, tecnologias, enlaceDemo, galeria } = req.body;
    
    // Convertimos las tecnologías a un array si vienen como texto
    const arrayTecnologias = typeof tecnologias === 'string' 
      ? tecnologias.split(',').map(t => t.trim()) 
      : tecnologias;

    const proyectoActualizado = await Proyecto.findByIdAndUpdate(
      req.params.id,
      { titulo, descripcion, tecnologias: arrayTecnologias, enlaceDemo, galeria },
      { new: true }
    );

    if (!proyectoActualizado) return res.status(404).json({ error: 'No encontrado' });
    res.json(proyectoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

app.delete('/api/proyectos/:id', verificarToken, async (req, res) => {
  try {
    await Proyecto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al borrar' });
  }
});

app.listen(PORT, () => console.log(`API activa en puerto ${PORT}`));