import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// --- COMPONENTE DE FONDO: JUDGMENT CUT END (Versión Mejorada) ---
const EfectoYamato = () => {
  const [cortes, setCortes] = useState([]);

  useEffect(() => {
    // Función para generar una "ráfaga" de cortes
    const ejecutarJudgmentCut = () => {
      // Genera un combo de entre 2 y 5 cortes cruzados
      const numCortes = Math.floor(Math.random() * 4) + 2;
      const nuevosCortes = [];

      for (let i = 0; i < numCortes; i++) {
        nuevosCortes.push({
          id: Date.now() + Math.random(),
          // Centramos el punto de origen en un rango del 20% al 80% de la pantalla
          x: 20 + Math.random() * 60, 
          y: 20 + Math.random() * 60, 
          angle: Math.random() * 180, // Cubre todos los ángulos de cruce
          length: '150vw', // ¡MAGIA! 150% del ancho de la pantalla para garantizar extremo a extremo
          retraso: Math.random() * 0.3, // Pequeño retraso entre cada corte del combo
        });
      }

      setCortes((prev) => [...prev, ...nuevosCortes]);

      // Borramos los cortes del DOM después de 1.5 segundos para no saturar la RAM
      setTimeout(() => {
        setCortes((prev) => prev.filter(c => !nuevosCortes.map(nc => nc.id).includes(c.id)));
      }, 1500);
    };

    // Disparamos un Judgment Cut cada 2.5 a 4 segundos (para que no sea molesto al leer)
    const interval = setInterval(() => {
      ejecutarJudgmentCut();
    }, 3000); 

    // Disparamos el primero al cargar la página
    ejecutarJudgmentCut();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-50 pointer-events-none bg-[#050505]">
      
      {/* El aura base oscura que combina el azul (Vergil/Superman) y el rojo (Dante) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] mix-blend-screen filter blur-[150px] opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.4) 0%, rgba(220,38,38,0.1) 40%, rgba(0,0,0,0) 70%)' }}
      />

      {/* Renderizado de los Tajos Dimensionales */}
      {cortes.map(corte => (
        <div
          key={corte.id}
          className="absolute"
          style={{
            top: `${corte.y}%`,
            left: `${corte.x}%`,
            /* translate(-50%, -50%) es clave para que el corte gire exactamente sobre su centro */
            transform: `translate(-50%, -50%) rotate(${corte.angle}deg)`, 
            width: corte.length,
            height: '2px', // Grosor base del tajo
          }}
        >
          {/* El tajo blanco brillante con aura azul Vergil */}
          <div
            className="w-full h-full bg-white shadow-[0_0_25px_5px_rgba(59,130,246,0.9),0_0_50px_rgba(255,255,255,1)] animate-yamato"
            style={{
              animationDelay: `${corte.retraso}s`,
              borderRadius: '100%',
            }}
          />
        </div>
      ))}
    </div>
  );
};

// --- COMPONENTE MOTOR DE ANIMACIÓN (Scroll Reveal) ---
const Reveal = ({ children, retraso = 0 }) => {
  const [esVisible, setEsVisible] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    // IntersectionObserver detecta cuando el elemento entra a la pantalla
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEsVisible(true);
          observer.unobserve(ref.current); // Para que solo se anime una vez
        }
      },
      { threshold: 0.1 } // Se activa cuando el 10% del elemento es visible
    );

    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  return (
    <div
      ref={ref}
      // Aquí está la magia de Tailwind: duración de 1 segundo, easing suave
      className={`transition-all duration-1000 ease-out ${
        esVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
      style={{ transitionDelay: `${retraso}ms` }}
    >
      {children}
    </div>
  );
};

// --- COMPONENTE DE TRAYECTORIA (Actualizado) ---
const Trayectoria = () => (
  // Quitamos los márgenes gigantes para que encaje bien en la columna
  <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 p-6 rounded-3xl shadow-xl">
    <div className="flex items-center justify-between mb-8">
      <h3 className="text-xl font-bold text-zinc-100">Trayectoria</h3>
    </div>
    
    <div className="space-y-8 border-l-2 border-zinc-800 ml-2 pl-6 relative">
      
      {/* Desarrollo Independiente */}
      <div className="relative">
        <span className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-[#121212] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
        <h4 className="text-sm font-bold text-zinc-100">Desarrollador Full-Stack Independiente</h4>
        <p className="text-blue-400 text-[10px] font-bold mb-2 uppercase tracking-widest">Proyectos Propios • 2025 - Presente</p>
        <p className="text-blue-100/70 text-xs leading-relaxed">
          Diseño y ejecución de arquitecturas de software. Creación de herramientas desde UI/UX hasta infraestructura y backend.
        </p>
      </div>

      {/* UTL */}
      <div className="relative">
        <span className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-zinc-700 border-4 border-[#121212]"></span>
        <h4 className="text-sm font-bold text-zinc-100">Ingeniería de Software</h4>
        <p className="text-zinc-500 text-[10px] font-bold mb-2 uppercase tracking-widest">UTL • 2024 - Actualidad</p>
        <p className="text-blue-100/70 text-xs leading-relaxed">
          Programación estructurada, arquitecturas escalables, bases de datos avanzadas y buenas prácticas.
        </p>
      </div>

      {/* Experiencia General */}
      <div className="relative">
        <span className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-zinc-700 border-4 border-[#121212]"></span>
        <h4 className="text-sm font-bold text-zinc-100">Administración y Operaciones</h4>
        <p className="text-zinc-500 text-[10px] font-bold mb-2 uppercase tracking-widest">Negocio Familiar • 10 años exp.</p>
        <p className="text-blue-100/70 text-xs leading-relaxed">
          Disciplina operativa y resolución de problemas bajo presión en un entorno de negocio real.
        </p>
      </div>

    </div>
  </div>
);

// --- COMPONENTE FOOTER ---
const Footer = () => (
  <footer className="mt-auto border-t border-zinc-800/50 py-10 text-center">
    <p className="text-zinc-500 text-sm font-medium">
      © {new Date().getFullYear()} José de Jesús Martín Zúñiga.
    </p>
    <p className="text-zinc-600 text-xs mt-2">
      Desarrollado con React, Tailwind CSS & Node.js
    </p>
  </footer>
);

// --- 1. VISTA MAESTRA (Con Animaciones Reveal) ---
const Home = () => {
  const [proyectos, setProyectos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/proyectos`)
      .then(res => res.json())
      .then(data => { setProyectos(data); setCargando(false); })
      .catch(error => console.error("Error:", error));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 relative z-10 flex flex-col min-h-[calc(100vh-80px)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">

        {/* LADO IZQUIERDO */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          
          {/* ANIMACIÓN 1: El Hero aparece de inmediato */}
          <Reveal retraso={0}>
            <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 p-8 rounded-[40px] shadow-2xl flex flex-col-reverse md:flex-row items-center md:items-start gap-8">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-blue-400 font-bold tracking-widest uppercase text-[10px] mb-3">Ingeniero de Software</h2>
                <h1 className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500 tracking-tighter leading-tight">
                  José de Jesús<br/>Martín Zúñiga
                </h1>
                <p className="text-blue-100/70 text-sm max-w-xl leading-relaxed mb-6">
                  Desarrollador Full-Stack especializado en la creación de aplicaciones web y arquitecturas robustas. Combinando diseño de interfaces premium con lógica escalable en el backend. Radicando en León, Guanajuato.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                  {['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Tailwind', 'Java', 'Spring', 'Vue', 'PHP', 'Docker'].map(tech => (
                    <span key={tech} className="px-2.5 py-1 bg-blue-950/30 border border-blue-900/50 rounded-lg text-blue-200 text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm">{tech}</span>
                  ))}
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <a href="mailto:eviljjmz@gmail.com" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 text-xs transition-all">Correo</a>
                  <a href="https://wa.me/524778513430" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/50 text-[#25D366] font-bold rounded-xl text-xs transition-all">WhatsApp</a>
                  <a href="https://github.com/ElJovenxD" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl text-xs transition-all">GitHub</a>
                </div>
              </div>
              <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 relative mx-auto md:mx-0">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20"></div>
                <img src="/perfil.jpg" alt="Perfil" className="w-full h-full object-cover rounded-full border-4 border-zinc-800 relative z-10 shadow-2xl bg-zinc-950" onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300/09090b/10b981?text=JM' }} />
              </div>
            </div>
          </Reveal>

          {/* SECCIÓN DE PROYECTOS */}
          <div>
            {/* ANIMACIÓN 2: El título aparece con un ligero retraso */}
            <Reveal retraso={200}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-zinc-100">Casos de Estudio</h3>
                <div className="h-px flex-1 bg-zinc-800 ml-6"></div>
              </div>
            </Reveal>

            {cargando ? (
              <p className="text-blue-400 animate-pulse text-sm font-medium">⏳ Cargando base de datos...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {proyectos.map((proyecto, index) => (
                  /* ANIMACIÓN 3: Efecto Cascada. Cada tarjeta tarda 150ms más que la anterior */
                  <Reveal key={proyecto._id} retraso={index * 150}>
                    <div className="bg-[#030712]/80 border border-blue-900/30 rounded-3xl overflow-hidden hover:border-red-500/50 transition-all duration-500 flex flex-col group h-full shadow-[0_4px_20px_rgba(37,99,235,0.05)] hover:shadow-[0_4px_30px_rgba(220,38,38,0.15)]">
                      <div className="h-40 w-full bg-zinc-950 overflow-hidden">
                        {proyecto.galeria?.length > 0 && (
                          proyecto.galeria[0].url.endsWith('.mp4') ? (
                            <video src={proyecto.galeria[0].url} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-500" muted autoPlay loop />
                          ) : (
                            <img src={proyecto.galeria[0].url} alt={proyecto.titulo} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-500" />
                          )
                        )}
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-zinc-100 mb-2">{proyecto.titulo}</h3>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {proyecto.tecnologias.slice(0, 3).map((tech, i) => (
                            <span key={i} className="text-[8px] uppercase tracking-widest px-2 py-0.5 bg-blue-950/30 border border-blue-900/50 rounded text-blue-400 font-bold">{tech.trim()}</span>
                          ))}
                          {proyecto.tecnologias.length > 3 && <span className="text-[8px] uppercase px-2 py-0.5 text-zinc-500 font-bold">+{proyecto.tecnologias.length - 3}</span>}
                        </div>
                        <div className="mt-auto">
                          <Link to={`/proyecto/${proyecto._id}`} className="block w-full text-center py-2.5 bg-zinc-950 hover:bg-blue-600 text-zinc-300 hover:text-white border border-zinc-800 hover:border-blue-500 rounded-lg transition-all text-[10px] font-bold uppercase tracking-widest">
                            Ver Proyecto
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LADO DERECHO: SIDEBAR */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-8">
            {/* ANIMACIÓN 4: La trayectoria aparece al final para no robar atención al Hero */}
            <Reveal retraso={400}>
              <Trayectoria />
            </Reveal>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- 2. VISTA DETALLE (Con Lightbox para Ampliar Imágenes) ---
const ProyectoDetalle = () => {
  const { id } = useParams();
  const [proyecto, setProyecto] = useState(null);
  
  // 🔥 NUEVO ESTADO: Guarda la URL de la imagen a la que le diste clic
  const [imagenAmpliada, setImagenAmpliada] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/proyectos`)
      .then(res => res.json())
      .then(data => setProyecto(data.find(p => p._id === id)));
  }, [id]);

  if (!proyecto) return <div className="p-12 text-center text-blue-100/70">Cargando...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 relative z-10">
      <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium mb-8 inline-block">⬅ Volver</Link>
      <h1 className="text-4xl md:text-6xl font-black text-zinc-100 mb-6">{proyecto.titulo}</h1>
      <p className="text-xl leading-relaxed text-zinc-300 mb-12 border-l-4 border-blue-500 pl-6">{proyecto.descripcion}</p>

      <div className="space-y-16">
        {proyecto.galeria?.map((item, index) => (
          <div key={index} className="group">
            <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl mb-4">
              {item.url.endsWith('.mp4') ? (
                <video src={item.url} controls className="w-full" />
              ) : (
                // 🔥 MAGIA AQUÍ: cursor-zoom-in y el evento onClick
                <img 
                  src={item.url} 
                  alt={`Imagen ${index}`} 
                  className="w-full cursor-zoom-in hover:opacity-80 transition-opacity duration-300" 
                  onClick={() => setImagenAmpliada(item.url)}
                />
              )}
            </div>
            {item.explicacion && (
              <div className="bg-zinc-900/40 p-4 rounded-xl border-l-2 border-blue-500/50">
                <p className="text-blue-100/70 text-sm italic uppercase tracking-tight mb-1">Contexto técnico:</p>
                <p className="text-zinc-200">{item.explicacion}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 🔥 EL LIGHTBOX (VISOR DE IMAGEN GIGANTE) */}
      {imagenAmpliada && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-10 cursor-zoom-out"
          onClick={() => setImagenAmpliada(null)}
        >
          {/* Botón de cerrar por si el usuario no intuye que dando clic al fondo se cierra */}
          <button 
            className="absolute top-6 right-6 md:top-10 md:right-10 text-zinc-500 hover:text-red-500 text-4xl font-bold transition-colors"
            onClick={() => setImagenAmpliada(null)}
          >
            &times;
          </button>
          
          <img 
            src={imagenAmpliada} 
            className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_50px_rgba(37,99,235,0.15)] border border-blue-900/30" 
            alt="Ampliación"
            // Esto evita que se cierre la foto si le das clic accidentalmente a la foto misma
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
};

// --- 3. PANEL DE CONTROL (ADMIN CON PREVIEW Y UPDATE) ---
const AdminPanel = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para creación
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tecnologias, setTecnologias] = useState('');
  const [enlaceDemo, setEnlaceDemo] = useState('');
  const [archivos, setArchivos] = useState([]);
  const [explicaciones, setExplicaciones] = useState([]);
  
  // Estados para edición
  const [proyectoEditando, setProyectoEditando] = useState(null); 
  const [modalEditar, setModalEditar] = useState(false);

  const [subiendo, setSubiendo] = useState(false);
  const [misProyectos, setMisProyectos] = useState([]);
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'exito' });
  const [modalEliminar, setModalEliminar] = useState({ visible: false, id: null, titulo: '' });

  const mostrarToast = (mensaje, tipo = 'exito') => {
    setToast({ visible: true, mensaje, tipo });
    setTimeout(() => setToast({ visible: false, mensaje: '', tipo: 'exito' }), 3000);
  };

  const cargarMisProyectos = () => {
    fetch(`${API_URL}/api/proyectos`).then(res => res.json()).then(data => setMisProyectos(data));
  };

  useEffect(() => { if (token) cargarMisProyectos(); }, [token]);

  // --- LÓGICA DE PREVISUALIZACIÓN ---
  const manejarCambioArchivos = (e) => {
    const files = Array.from(e.target.files);
    setArchivos(files);
    setExplicaciones(new Array(files.length).fill(''));
  };

  const manejarExplicacion = (index, valor) => {
    const nuevasExplicaciones = [...explicaciones];
    nuevasExplicaciones[index] = valor;
    setExplicaciones(nuevasExplicaciones);
  };

  // --- FUNCIÓN PARA GUARDAR CAMBIOS (UPDATE) ---
  const guardarCambios = async (e) => {
    e.preventDefault();
    setSubiendo(true);
    
    try {
      const res = await fetch(`${API_URL}/api/proyectos/${proyectoEditando._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(proyectoEditando)
      });

      if (res.ok) {
        mostrarToast("Proyecto actualizado correctamente");
        setModalEditar(false);
        cargarMisProyectos();
      }
    } catch (error) {
      mostrarToast("Error al actualizar", "error");
    }
    setSubiendo(false);
  };

  const publicar = async (e) => {
    e.preventDefault();
    setSubiendo(true);
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('tecnologias', tecnologias);
    formData.append('enlaceDemo', enlaceDemo);
    formData.append('explicaciones', explicaciones.join('||'));
    archivos.forEach(file => formData.append('media', file));

    const res = await fetch(`${API_URL}/api/proyectos`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (res.ok) {
      mostrarToast("¡Publicado con éxito!");
      setTitulo(''); setDescripcion(''); setTecnologias(''); setEnlaceDemo(''); setArchivos([]); setExplicaciones([]);
      document.getElementById('fileInput').value = "";
      cargarMisProyectos();
    }
    setSubiendo(false);
  };

  const confirmarEliminar = async () => {
    await fetch(`${API_URL}/api/proyectos/${modalEliminar.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    mostrarToast("Eliminado", "error");
    setModalEliminar({ visible: false, id: null, titulo: '' });
    cargarMisProyectos();
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-zinc-900/80 backdrop-blur-md p-8 rounded-3xl border border-zinc-800 w-full max-w-sm">
          <h2 className="text-2xl font-black mb-8 text-center text-blue-400 uppercase tracking-tighter">Acceso Restringido</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const res = await fetch(`${API_URL}/api/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok) { localStorage.setItem('token', data.token); setToken(data.token); }
          }} className="space-y-4">
            <input type="text" placeholder="Admin User" onChange={e => setUsername(e.target.value)} className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-blue-500" />
            <input type="password" placeholder="Pass" onChange={e => setPassword(e.target.value)} className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-blue-500" />
            <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20">Desbloquear</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 relative z-10">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4 border-b border-zinc-800 pb-8">
        <h1 className="text-3xl font-black text-white italic tracking-tighter">🛠️ CONTROL_PANEL_V2</h1>
        <div className="flex gap-4">
          <Link to="/" className="px-5 py-2.5 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-700 transition-all font-bold text-xs uppercase">Web Pública</Link>
          <button onClick={() => { localStorage.removeItem('token'); setToken(null); }} className="px-5 py-2.5 border border-red-900/50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all font-bold text-xs uppercase">Logout</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* COLUMNA IZQUIERDA: CREAR PROYECTO */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-zinc-900/40 backdrop-blur-md p-8 rounded-3xl border border-zinc-800">
            <h2 className="text-xl font-bold mb-8 text-blue-400">NUEVO_REGISTRO</h2>
            <form onSubmit={publicar} className="space-y-6">
              <input type="text" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl focus:border-blue-500 outline-none" />
              <textarea placeholder="Descripción general del proyecto..." value={descripcion} onChange={e => setDescripcion(e.target.value)} required className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl h-32 focus:border-blue-500 outline-none" />
              <input type="text" placeholder="Tecnologías (comas)" value={tecnologias} onChange={e => setTecnologias(e.target.value)} required className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl focus:border-blue-500 outline-none" />
              <input type="url" placeholder="Demo Link" value={enlaceDemo} onChange={e => setEnlaceDemo(e.target.value)} className="w-full p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl focus:border-blue-500 outline-none" />
              
              <div className="p-6 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-950/30">
                <input type="file" id="fileInput" multiple accept="image/*,video/mp4" onChange={manejarCambioArchivos} className="block w-full text-xs text-zinc-500 mb-8" />
                
                {/* PREVISUALIZACIÓN CON CAMPOS DE TEXTO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {archivos.map((file, idx) => (
                    <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden p-3">
                      <div className="h-32 w-full mb-3 rounded-xl overflow-hidden bg-black">
                        {file.type.startsWith('video') ? (
                          <video src={URL.createObjectURL(file)} className="w-full h-full object-cover" muted />
                        ) : (
                          <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <input 
                        type="text" 
                        placeholder="Explicación técnica..." 
                        value={explicaciones[idx] || ''} 
                        onChange={(e) => manejarExplicacion(idx, e.target.value)} 
                        className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:border-blue-500 outline-none" 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button disabled={subiendo} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-900/20 uppercase tracking-widest transition-all">
                {subiendo ? 'Sincronizando con la nube...' : 'Publicar en Portafolio'}
              </button>
            </form>
          </div>
        </div>

        {/* COLUMNA DERECHA: GESTIÓN */}
        <div className="lg:col-span-5">
          <div className="bg-zinc-900/40 backdrop-blur-md p-8 rounded-3xl border border-zinc-800 sticky top-8">
            <h2 className="text-xl font-bold mb-8 text-zinc-100 italic">BASE_DATOS_ACTUAL</h2>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {misProyectos.map(p => (
                <div key={p._id} className="p-5 bg-zinc-950/80 border border-zinc-800 rounded-2xl flex flex-col gap-4">
                  <span className="font-bold text-zinc-200 truncate uppercase text-sm tracking-tight">{p.titulo}</span>
                  <div className="flex gap-2">
                    {/* BOTÓN EDITAR */}
                    <button 
                      onClick={() => { setProyectoEditando({...p, tecnologias: p.tecnologias.join(',')}); setModalEditar(true); }}
                      className="flex-1 py-2 bg-zinc-800 hover:bg-blue-600 text-blue-100/70 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all"
                    >
                      Editar Info
                    </button>
                    <button 
                      onClick={() => setModalEliminar({ visible: true, id: p._id, titulo: p.titulo })} 
                      className="flex-1 py-2 border border-red-900/30 text-red-500 hover:bg-red-600 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL DE EDICIÓN (LA "U" DEL CRUD) --- */}
      {modalEditar && proyectoEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl shadow-blue-500/5">
            <h2 className="text-3xl font-black mb-8 text-blue-400 italic">EDIT_MODE: {proyectoEditando.titulo}</h2>
            
            <form onSubmit={guardarCambios} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase">Datos Primarios</label>
                  <input type="text" value={proyectoEditando.titulo} onChange={e => setProyectoEditando({...proyectoEditando, titulo: e.target.value})} className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-2xl" placeholder="Título" />
                  <textarea value={proyectoEditando.descripcion} onChange={e => setProyectoEditando({...proyectoEditando, descripcion: e.target.value})} className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-2xl h-40" placeholder="Descripción" />
                  <input type="text" value={proyectoEditando.tecnologias} onChange={e => setProyectoEditando({...proyectoEditando, tecnologias: e.target.value})} className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-2xl" placeholder="Tecnologías (comas)" />
                </div>

                <div className="space-y-6">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase">Gestión de Galería Actual</label>
                  <div className="space-y-4">
                    {proyectoEditando.galeria.map((item, idx) => (
                      <div key={idx} className="bg-zinc-950 p-4 rounded-3xl border border-zinc-800 flex gap-4 items-center">
                        <img src={item.url} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="flex-1">
                          <input 
                            type="text" 
                            value={item.explicacion} 
                            onChange={(e) => {
                              const nuevaGaleria = [...proyectoEditando.galeria];
                              nuevaGaleria[idx].explicacion = e.target.value;
                              setProyectoEditando({...proyectoEditando, galeria: nuevaGaleria});
                            }} 
                            className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs" 
                            placeholder="Contexto..." 
                          />
                        </div>
                        {/* BOTÓN PARA QUITAR IMAGEN DE LA LISTA */}
                        <button 
                          type="button" 
                          onClick={() => {
                            const nuevaGaleria = proyectoEditando.galeria.filter((_, i) => i !== idx);
                            setProyectoEditando({...proyectoEditando, galeria: nuevaGaleria});
                          }}
                          className="text-red-500 text-lg hover:scale-125 transition-all"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <p className="text-[10px] text-zinc-500 italic">Nota: Para agregar imágenes nuevas, borra el proyecto y súbelo de nuevo.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                <button type="button" onClick={() => setModalEditar(false)} className="flex-1 py-4 bg-zinc-800 text-white font-bold rounded-2xl uppercase text-xs">Cancelar</button>
                <button type="submit" disabled={subiendo} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl uppercase text-xs shadow-lg shadow-blue-500/20">
                  {subiendo ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR Y TOASTS (Iguales que el paso anterior) */}
      {modalEliminar.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-sm w-full text-center">
            <h3 className="text-2xl font-bold text-white mb-4">¿Borrar {modalEliminar.titulo}?</h3>
            <div className="flex gap-4">
              <button onClick={() => setModalEliminar({visible:false, id:null, titulo:''})} className="flex-1 p-3 bg-zinc-800 text-white rounded-xl">No</button>
              <button onClick={confirmarEliminar} className="flex-1 p-3 bg-red-600 text-white font-bold rounded-xl">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}

      {toast.visible && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl border ${toast.tipo === 'exito' ? 'bg-blue-950 border-blue-500 text-blue-50' : 'bg-red-950 border-red-500 text-red-50'}`}>
          <span className="font-bold uppercase text-xs tracking-widest">{toast.mensaje}</span>
        </div>
      )}
    </div>
  );
};

// --- EL ENRUTADOR PRINCIPAL ---
function App() {
  return (
    <BrowserRouter>
      <EfectoYamato />

      {/* 🔥 Layout FIX */}
      <div className="min-h-screen flex flex-col text-white">

        {/* CONTENIDO */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/proyecto/:id" element={<ProyectoDetalle />} />
            <Route path="/admin" element={<AdminPanel />} /> {/* <-- ¡Esta línea te faltaba! */}
          </Routes>
        </div>

        {/* FOOTER GLOBAL */}
        <Footer />
      </div>

    </BrowserRouter>
  );
}

export default App;