const express = require('express');
const router = express.Router();
const Department = require('../models/department.model');
const controllers = require('../controllers/department.controller');
const createDefaultEndpoints = require('../utils/createDefaultEndpoints');

createDefaultEndpoints(router, Department, controllers);

module.exports = router;
