const Employee = require('../models/employee.model');

exports.getAll = (req, res) => {
  Employee.find()
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json({ message: err._message }));
};

exports.getRandom = (req, res) => {
  Employee.aggregate([{ $sample: { size: 1 } }])
    .then((data) =>
      data ? res.json(data) : res.status(404).json({ message: 'Not found' })
    )
    .catch((err) => res.status(500).json({ message: err._message }));
};
