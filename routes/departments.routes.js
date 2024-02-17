const express = require('express');
const router = express.Router();
const Department = require('../models/department.model');
const createDefaultEndpoints = require('../utils/createDefaultEndpoints');

createDefaultEndpoints(router, Department);

module.exports = router;
