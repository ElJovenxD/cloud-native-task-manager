require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// --- NUEVO: El creador de llaves VIP ---
const jwt = require('jsonwebtoken'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portafolio_assets',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif', 'mp4']
  }
});
const upload = multer({ storage: storage });

// 2. Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('¡Conectado a MongoDB exitosamente! 🚀'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// 3. Molde del Proyecto
const ProyectoSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  tecnologias: [String],
  enlaceDemo: String,
  imagenUrl: String,
  fecha: { type: Date, default: Date.now }
});
const Proyecto = mongoose.model('Proyecto', ProyectoSchema);

// --- NUEVO: EL CADENERO (Middleware de Seguridad) ---
// Esta función intercepta las peticiones y revisa si traen el Token correcto
const verificarToken = (req, res, next) => {
  // Busca el token en el encabezado de la petición
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Viene como: "Bearer eyJhbGci..."

  if (!token) return res.status(401).json({ error: 'Alto ahí. No tienes un pase VIP.' });

  // Si hay token, verificamos que tenga tu firma secreta
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Este pase es falso o ya expiró.' });
    req.user = user;
    next(); // ¡Adelante, puedes pasar!
  });
};

// --- NUEVO: RUTA DE LOGIN (La Taquilla) ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Verificamos si las credenciales coinciden con las de tu .env
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    // ¡Eres tú! Te fabricamos un pase VIP que dura 24 horas
    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
});

// 4. Rutas (Endpoints) de tus Proyectos

// GET: PÚBLICA (Cualquier reclutador puede ver los proyectos)
app.get('/api/proyectos', async (req, res) => {
  try {
    const proyectos = await Proyecto.find().sort({ fecha: -1 });
    res.json(proyectos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
});

// POST: PRIVADA (Le pusimos a "verificarToken" como guardia)
app.post('/api/proyectos', verificarToken, upload.single('imagen'), async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : ''; 

    const nuevoProyecto = new Proyecto({
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      tecnologias: req.body.tecnologias ? req.body.tecnologias.split(',') : [],
      enlaceDemo: req.body.enlaceDemo,
      imagenUrl: imageUrl
    });

    await nuevoProyecto.save();
    res.status(201).json(nuevoProyecto);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al crear proyecto' });
  }
});

// DELETE: PRIVADA (Para que puedas borrar posteos viejos)
app.delete('/api/proyectos/:id', verificarToken, async (req, res) => {
  try {
    await Proyecto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: '¡Proyecto eliminado con éxito!' });
  } catch (error) {
    res.status(500).json({ error: 'Error al intentar eliminar' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor API listo en puerto ${PORT}`);
});