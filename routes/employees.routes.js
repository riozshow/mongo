const express = require('express');
const router = express.Router();
const Employee = require('../models/employee.model');
const createDefaultEndpoints = require('../utils/createDefaultEndpoints');

createDefaultEndpoints(router, Employee);

module.exports = router;
