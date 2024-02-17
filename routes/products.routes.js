const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const controllers = require('../controllers/product.controller');
const createDefaultEndpoints = require('../utils/createDefaultEndpoints');

createDefaultEndpoints(router, Product, controllers);

module.exports = router;
