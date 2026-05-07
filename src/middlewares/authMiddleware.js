const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Verificar si existe el header Authorization y si empieza con Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener el token del string "Bearer [TOKEN]"
      token = req.headers.authorization.split(' ')[1];

      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar el usuario y adjuntarlo al objeto request (excluyendo el password)
      req.user = await User.findById(decoded.id).select('-password');
      
      return next(); // Importante el 'return' para no ejecutar el código de abajo
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: 'No autorizado, token inválido o expirado' 
      });
    }
  }

  // 2. Si no hay token en absoluto
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'No autorizado, token requerido' 
    });
  }
};

const admin = (req, res, next) => {
  // Verificar si el usuario existe y si tiene el rol de admin
  if (req.user && req.user.role === 'admin') {
    next(); // <--- CRÍTICO: Sin esto, la petición se queda bloqueada aquí
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Acceso denegado, se requieren permisos de administrador' 
    });
  }
};

module.exports = { protect, admin };