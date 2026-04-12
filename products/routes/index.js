var express = require('express'); var router = express.Router(); router.get('/', (req, res) => { res.json({ service: 'products', status: 'online' }); }); module.exports = router;
