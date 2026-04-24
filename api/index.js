require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// --- NUEVAS LIBRERÍAS DE CLOUDINARY ---
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. Configurar conexión a Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configurar la carpeta y el guardado automático
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portafolio_assets', // <--- ¡Aquí separamos esto de las fotos de 3!!
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif']
  }
});
const upload = multer({ storage: storage });

// 3. Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('¡Conectado a MongoDB exitosamente! 🚀'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// 4. Molde del Proyecto
const ProyectoSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  tecnologias: [String],
  enlaceDemo: String,
  imagenUrl: String, // Aquí guardaremos la URL que nos devuelva Cloudinary
  fecha: { type: Date, default: Date.now }
});
const Proyecto = mongoose.model('Proyecto', ProyectoSchema);

// 5. Rutas (Endpoints)
// Obtener todos
app.get('/api/proyectos', async (req, res) => {
  try {
    const proyectos = await Proyecto.find().sort({ fecha: -1 });
    res.json(proyectos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
});

// Crear nuevo (¡AHORA ACEPTA IMÁGENES!)
// Usamos upload.single('imagen') para interceptar el archivo antes de guardar en Mongo
app.post('/api/proyectos', upload.single('imagen'), async (req, res) => {
  try {
    // Si subieron una imagen, Cloudinary nos devuelve la URL mágica en req.file.path
    const imageUrl = req.file ? req.file.path : ''; 

    const nuevoProyecto = new Proyecto({
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      tecnologias: req.body.tecnologias ? req.body.tecnologias.split(',') : [],
      enlaceDemo: req.body.enlaceDemo,
      imagenUrl: imageUrl // Guardamos el texto del enlace en la base de datos
    });

    await nuevoProyecto.save();
    res.status(201).json(nuevoProyecto);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al crear proyecto' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor API listo en puerto ${PORT}`);
});