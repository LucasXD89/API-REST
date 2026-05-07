const Product = require('../models/Product');

// Obtener todos los productos (con filtros)
const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    let filter = { isActive: true };

    if (category) filter.category = category;

    // Mejora: Evitar que minPrice o maxPrice sobrescriban el objeto si no vienen ambos
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      // Uso de regex para búsqueda flexible
      filter.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(filter).populate('category');
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener producto por ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    
    res.json({ success: true, data: product });
  } catch (error) {
    // Manejo de error específico para IDs de MongoDB mal formados
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'ID de producto no válido' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Crear producto
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Actualizar producto
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Eliminar producto (soft delete)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    
    res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};