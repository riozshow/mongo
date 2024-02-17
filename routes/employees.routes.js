const express = require('express');
const router = express.Router();
const Employee = require('../models/employee.model');
const controllers = require('../controllers/employee.controller');
const createDefaultEndpoints = require('../utils/createDefaultEndpoints');

createDefaultEndpoints(router, Employee, controllers);

module.exports = router;
