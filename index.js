const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Importar rutas
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares Globales ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Conexión a MongoDB ---
// Nota: En versiones recientes de Mongoose no es necesario pasar opciones como 
// useNewUrlParser o useUnifiedTopology, ya vienen por defecto.
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1); // Detiene la app si no hay base de datos
  });

// --- Rutas ---
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
res.json({
    name: 'SENATI Store API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
    products: '/api/products',
    categories: '/api/categories',
    users: '/api/users'
    }
});
});

// --- Manejo de Rutas 404 (No Encontradas) ---
app.use((req, res, next) => {
res.status(404).json({
    success: false,
    message: `La ruta ${req.originalUrl} no existe`
});
});

// --- Middleware de Manejo de Errores Global ---
app.use((err, req, res, next) => {
console.error(err.stack);
res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Algo salió mal en el servidor' 
});
});

// --- Iniciar Servidor ---
app.listen(PORT, () => {
console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});