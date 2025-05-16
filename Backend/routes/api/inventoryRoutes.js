const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://docsys-app-server.onrender.com/api/prescriptions');
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch data' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await axios.delete(`http://localhost:5000/inventory/${id}`);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete data' });
    }
});


module.exports = router;