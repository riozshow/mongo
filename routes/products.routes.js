const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const createDefaultEndpoints = require('../utils/createDefaultEndpoints');

createDefaultEndpoints(router, Product);

module.exports = router;
