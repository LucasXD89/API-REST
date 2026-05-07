const express = require('express');
const router = express.Router();

//Ruta temporal
router.get('/', (req, res) => {
    res.json({message: 'Ruta de categorias - En desarrollo'});
});

module.exports = router;